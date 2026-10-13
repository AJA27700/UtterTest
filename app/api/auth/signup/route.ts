import { backend, failed, type SignupInput } from '@/lib/backend'
import { setSession } from '@/lib/session'

// POST /api/auth/signup  (the 4-step sign-up form)   Live: POST /user/sign-up, then log in
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Partial<SignupInput> & { confirmPassword?: string }
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const need: [keyof SignupInput, string][] = [['firstName', 'first name'], ['lastName', 'last name'], ['primaryPhone', 'phone'], ['email', 'email'], ['streetNo', 'street number'], ['street_address', 'street'], ['city', 'city'], ['state', 'state'], ['zip', 'ZIP code'], ['password', 'password']]
  const missing = need.filter(([k]) => !str(b[k])).map(([, label]) => label)
  if (missing.length) return Response.json({ error: `Please add your ${missing.join(', ')}.` }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(b.email))) return Response.json({ error: 'Enter a valid email address.' }, { status: 400 })
  if (str(b.primaryPhone).replace(/\D/g, '').length !== 10) return Response.json({ error: 'Enter a valid phone number (10 digits).' }, { status: 400 })
  if (!/^\d{5}(-\d{4})?$/.test(str(b.zip))) return Response.json({ error: 'Enter a 5-digit ZIP code.' }, { status: 400 })
  if ((b.password ?? '').length < 6) return Response.json({ error: 'Use at least 6 characters for your password.' }, { status: 400 })
  if (b.password !== b.confirmPassword) return Response.json({ error: "The two passwords don't match." }, { status: 400 })
  if (!b.agreeTermsPolicy || !b.agreeAgreement) return Response.json({ error: 'Please agree to the terms and the membership agreement.' }, { status: 400 })
  if (!str(b.signatureImage).startsWith('data:image/png')) return Response.json({ error: 'Please sign the agreement.' }, { status: 400 })
  const r = await backend.signup(b as SignupInput)
  if (failed(r)) return Response.json({ error: r.error }, { status: r.status ?? 409 })
  if ('pending' in r) return Response.json({ pending: true, message: r.message }, { status: 202 })
  await setSession(r.token)
  return Response.json({ member: r.member }, { status: 201 })
}
