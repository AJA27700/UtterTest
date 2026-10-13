import { backend, failed } from '@/lib/backend'
import { setSession } from '@/lib/session'

// POST /api/auth/login  { email, password, remember? }   Live: POST /auth/login → { user, token }
export async function POST(req: Request) {
  const { email, password, remember } = (await req.json().catch(() => ({}))) as { email?: string; password?: string; remember?: string | boolean }
  if (!email || !password) return Response.json({ error: 'Enter your email and password.' }, { status: 400 })
  const r = await backend.login(email, password)
  if (failed(r)) return Response.json({ error: r.error }, { status: r.status === 502 ? 502 : 401 })
  await setSession(r.token, remember === true || remember === '1')
  return Response.json({ member: r.member })
}
