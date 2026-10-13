import { backend, failed, type OrderPatch } from '@/lib/backend'
import { requireSession } from '@/lib/session'

// GET /api/orders/:id: one order.   Live: GET /order/details/:id
// PATCH: change an open order (items, delivery/pickup, day, recurring, notes) or cancel it.
//   Live: POST /order/update-order/:id, POST /order/cancel-order
export async function GET(_req: Request, ctx: RouteContext<'/api/orders/[id]'>) {
  const s = await requireSession(); if (s instanceof Response) return s
  const o = await backend.getOrder(s.token, (await ctx.params).id)
  return o ? Response.json(o) : Response.json({ error: 'Not found' }, { status: 404 })
}

export async function PATCH(req: Request, ctx: RouteContext<'/api/orders/[id]'>) {
  const s = await requireSession(); if (s instanceof Response) return s
  const patch = (await req.json().catch(() => ({}))) as OrderPatch
  if (patch.status && patch.status !== 'canceled') return Response.json({ error: 'Only cancelling is allowed.' }, { status: 400 })
  const r = await backend.updateOrder(s.token, (await ctx.params).id, patch)
  return failed(r) ? Response.json({ error: r.error }, { status: r.status ?? 400 }) : Response.json(r)
}
