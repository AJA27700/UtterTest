import { getCatalog } from '@/lib/api'

// GET /api/catalog: the whole catalogue (cached, refreshed every few minutes)
export async function GET() {
  return Response.json(await getCatalog())
}
