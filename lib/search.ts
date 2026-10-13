import 'server-only'
import type { Catalog, Category, Product } from './types'

// Search every product in the catalogue. Their API: POST /products/search { search }.
// Matches every word anywhere in the name, category, tags, sizes and description; name matches rank first.
export type SearchHit = { product: Product; cat: Pick<Category, 'slug' | 'title' | 'path' | 'tint'> }

export function searchCatalog(catalog: Catalog, q: string): SearchHit[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 8)
  if (!terms.length) return []
  const seen = new Set<string>()
  const hits: { h: SearchHit; score: number }[] = []
  for (const c of Object.values(catalog.categories)) {
    for (const p of c.products) {
      if (seen.has(p.id)) continue
      const name = p.name.toLowerCase()
      const hay = `${name} ${c.title} ${p.tags.map((t) => t.text).join(' ')} ${p.variants.map((v) => v.label).join(' ')} ${p.desc}`.toLowerCase()
      if (!terms.every((t) => hay.includes(t))) continue
      seen.add(p.id)
      const at = name.indexOf(terms[0])
      const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const whole = terms.every((t) => new RegExp(`(^|[^a-z])${esc(t)}($|[^a-z])`).test(name)) // "butter", not "buttermilk"
      const last = terms.some((t) => new RegExp(`(^|[^a-z])${esc(t)}s?\\s*$`).test(name)) // the thing itself: "Raw Goat Butter", not "Butter Bread"
      const score = (whole ? 0 : 100) + (last ? 0 : 30) + (at < 0 ? 60 : at * 0.5) + name.length * 0.3 + (terms.every((t) => name.includes(t)) ? 0 : 50) + (p.allout ? 200 : 0)
      hits.push({ h: { product: p, cat: { slug: c.slug, title: c.title, path: c.path, tint: c.tint } }, score })
    }
  }
  return hits.sort((a, b) => a.score - b.score).map((x) => x.h)
}
