import { backend } from '@/lib/backend'

// POST /api/auth/forgot { email }   Live: POST /auth/send-password-to-email
// Same answer whether or not the account exists, so nobody can use it to check who's a member.
export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string }
  if (!email?.trim()) return Response.json({ error: 'Enter the email you signed up with.' }, { status: 400 })
  await backend.forgotPassword(email.trim())
  return Response.json({ ok: true })
}
