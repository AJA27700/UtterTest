import { currentMember } from '@/lib/session'

// GET /api/auth/me: the logged-in member (with address, zone and delivery day), or null.   Live: GET /auth/validate
export async function GET() {
  return Response.json({ member: await currentMember() }, { headers: { 'cache-control': 'no-store' } })
}
