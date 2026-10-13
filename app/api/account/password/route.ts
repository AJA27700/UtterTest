import { backend, failed } from '@/lib/backend'
import { requireSession } from '@/lib/session'

// POST /api/account/password { current, next }   Live: POST /user/update-password { password, npassword, cpassword }
export async function POST(req: Request) {
  const s = await requireSession(); if (s instanceof Response) return s
  const { current, next, confirm } = (await req.json().catch(() => ({}))) as { current?: string; next?: string; confirm?: string }
  if (!current) return Response.json({ error: 'Enter your current password.' }, { status: 400 })
  if (!next || next.length < 6) return Response.json({ error: 'Use at least 6 characters for your new password.' }, { status: 400 })
  if (next !== confirm) return Response.json({ error: "The two new passwords don't match." }, { status: 400 })
  const r = await backend.updatePassword(s.token, current, next)
  return failed(r) ? Response.json({ error: r.error }, { status: r.status ?? 400 }) : Response.json({ ok: true })
}
