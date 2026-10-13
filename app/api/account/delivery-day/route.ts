import { cookies } from 'next/headers'
import { DAY_COOKIE, requireSession } from '@/lib/session'

// POST /api/account/delivery-day { day }: choose between the zone's delivery days (when it has more than one).
// Their API has no endpoint for this, so the choice is kept in a cookie (see lib/session.ts).
export async function POST(req: Request) {
  const s = await requireSession(); if (s instanceof Response) return s
  const { day } = (await req.json().catch(() => ({}))) as { day?: string }
  const days = s.member.zone?.deliveryDays ?? []
  if (!day || !days.includes(day)) return Response.json({ error: days.length ? `Your zone delivers on ${days.join(' and ')}.` : 'Your address has no delivery zone yet.' }, { status: 400 })
  ;(await cookies()).set(DAY_COOKIE, day, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 365 })
  return Response.json({ member: { ...s.member, deliveryDay: day } })
}
