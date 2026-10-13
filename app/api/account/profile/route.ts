import { backend, failed, type ProfileInput } from '@/lib/backend'
import { requireSession } from '@/lib/session'

// POST /api/account/profile { firstName, lastName, phone, phone2, email }   Live: POST /user/update-profile
export async function POST(req: Request) {
  const s = await requireSession(); if (s instanceof Response) return s
  const b = (await req.json().catch(() => ({}))) as Partial<ProfileInput>
  const p: ProfileInput = { firstName: (b.firstName ?? '').trim(), lastName: (b.lastName ?? '').trim(), phone: (b.phone ?? '').trim(), phone2: (b.phone2 ?? '').trim(), email: (b.email ?? '').trim() }
  if (!p.firstName || !p.lastName) return Response.json({ error: 'First and last name are required.' }, { status: 400 })
  if (p.phone.replace(/\D/g, '').length !== 10) return Response.json({ error: 'Enter a valid phone number (10 digits).' }, { status: 400 })
  if (p.phone2 && p.phone2.replace(/\D/g, '').length !== 10) return Response.json({ error: 'Enter a valid secondary phone number, or leave it empty.' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return Response.json({ error: 'Enter a valid email address.' }, { status: 400 })
  const r = await backend.updateProfile(s.token, p)
  return failed(r) ? Response.json({ error: r.error }, { status: r.status ?? 400 }) : Response.json({ member: r })
}
