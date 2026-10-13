import { backend } from '@/lib/backend'
import { clearSession, sessionToken } from '@/lib/session'

// POST /api/auth/logout   Live: POST /auth/logout
export async function POST() {
  const t = await sessionToken()
  if (t) await backend.logout(t)
  await clearSession()
  return Response.json({ ok: true })
}
