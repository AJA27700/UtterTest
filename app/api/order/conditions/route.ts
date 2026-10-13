import { backend, failed } from '@/lib/backend'
import { requireSession } from '@/lib/session'

// GET /api/order/conditions: the member's zone (delivery days, cut-off, fee, minimum) and pickup locations.
// Live: GET /order/pre-checkout/conditions
export async function GET() {
  const s = await requireSession(); if (s instanceof Response) return s
  const r = await backend.conditions(s.token)
  return failed(r) ? Response.json({ error: r.error }, { status: r.status ?? 502 }) : Response.json(r, { headers: { 'cache-control': 'no-store' } })
}
