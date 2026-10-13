import { backend, failed } from '@/lib/backend'
import { currentMember, requireSession } from '@/lib/session'
import type { Address } from '@/lib/types'

// POST /api/account/address { streetNo, street, apt, city, state, zip, country }   Live: POST /user/update-address
// The zone, cut-off day and delivery day follow from the address, so the answer is the updated member.
export async function POST(req: Request) {
  const s = await requireSession(); if (s instanceof Response) return s
  const b = (await req.json().catch(() => ({}))) as Partial<Address>
  const t = (v?: string) => (v ?? '').trim()
  const a: Address = { streetNo: t(b.streetNo), street: t(b.street), apt: t(b.apt), city: t(b.city), state: t(b.state).toUpperCase(), zip: t(b.zip), country: t(b.country) || 'USA' }
  const missing = (['streetNo', 'street', 'city', 'state', 'zip'] as const).filter((k) => !a[k])
  if (missing.length) return Response.json({ error: 'Please fill in street number, street, city, state and ZIP.' }, { status: 400 })
  if (!/^\d{5}(-\d{4})?$/.test(a.zip)) return Response.json({ error: 'Enter a 5-digit ZIP code.' }, { status: 400 })
  const r = await backend.updateAddress(s.token, a)
  if (failed(r)) return Response.json({ error: r.error }, { status: r.status ?? 400 })
  return Response.json({ member: (await currentMember()) ?? r }) // with the chosen delivery day applied
}
