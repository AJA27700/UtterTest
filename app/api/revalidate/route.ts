import { revalidateTag } from 'next/cache'

// The backend calls POST /api/revalidate (with the shared secret) whenever a price or stock changes,
// so the shop pages update right away instead of waiting a few minutes.
export async function POST(req: Request) {
  if (req.headers.get('x-revalidate-secret') !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  revalidateTag('catalog', 'max')
  return Response.json({ revalidated: true })
}
