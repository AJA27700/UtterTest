import { backend, failed } from '@/lib/backend'
import { requireSession } from '@/lib/session'
import type { NewOrder } from '@/lib/types'

// GET /api/orders?page=1: this member's orders, newest first, 10 a page.   Live: GET /order/history?page=
// POST /api/orders: place an order (items + choices only; the server prices it).   Live: POST /order/place-order
export async function GET(req: Request) {
  const s = await requireSession(); if (s instanceof Response) return s
  const page = Math.max(1, Number(new URL(req.url).searchParams.get('page')) || 1)
  const r = await backend.listOrders(s.token, page)
  return failed(r) ? Response.json({ error: r.error }, { status: r.status ?? 502 }) : Response.json(r)
}

export async function POST(req: Request) {
  const s = await requireSession(); if (s instanceof Response) return s
  const body = (await req.json().catch(() => ({}))) as NewOrder
  if (!Array.isArray(body.items) || !body.items.length) return Response.json({ error: 'Your cart is empty.' }, { status: 400 })
  const r = await backend.placeOrder(s.token, body)
  return failed(r) ? Response.json({ error: r.error }, { status: r.status ?? 400 }) : Response.json(r, { status: 201 })
}
