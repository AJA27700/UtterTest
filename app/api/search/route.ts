import { getCatalog } from '@/lib/api'
import { searchCatalog } from '@/lib/search'

// GET /api/search?q=butter[&full=1]
//   default: a short list for the search box's suggestions
//   full=1:  every match with full product data, for the results page
// Their API: POST /products/search { search }.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get('q') ?? '').trim().slice(0, 80)
  const hits = q ? searchCatalog(await getCatalog(), q) : []
  if (url.searchParams.get('full') === '1') return Response.json({ q, total: hits.length, hits: hits.slice(0, 120) })
  return Response.json({
    q,
    total: hits.length,
    hits: hits.slice(0, 8).map(({ product: p, cat }) => ({
      id: p.id, name: p.name, href: `/${cat.path}#${p.id}`, icon: p.icon, cat: cat.title, out: p.allout,
      price: p.fromPrice, from: p.variants.length > 1,
    })),
  })
}
