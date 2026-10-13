import 'server-only'
import localCatalog from '@/data/catalog.json'
import type { Catalog } from '../types'
import { call, dataOf, IMG } from './client'
import { buildCatalog, mapMiniItems, type ApiCategory, type ApiPackage, type ApiProduct, type MiniItem } from './map'

// The whole shop from their API: GET /categories, then POST /products { slugName } for every category
// (about 80 calls, 6 at a time; the result is cached for a few minutes by lib/api.ts).
// Icons, colours, notes and long descriptions are kept from data/catalog.json where the names match.
export async function fetchLiveCatalog(): Promise<Catalog> {
  const cats = dataOf<ApiCategory[]>(await call('/categories'))
  const slugs: string[] = []
  const walk = (c: ApiCategory) => { slugs.push(c.slug); for (const k of (c.child_categories?.length ? c.child_categories : c.lavel_one) ?? []) walk(k) }
  cats.filter((c) => !c.parent_cat_id).forEach(walk)
  const bySlug: Record<string, { data?: ApiProduct[]; relatedCats?: ApiCategory[] }> = {}
  let i = 0
  const worker = async () => {
    while (i < slugs.length) {
      const slug = slugs[i++]
      try { bySlug[slug] = await call('/products', { body: { slugName: slug } }) } catch { bySlug[slug] = {} }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker))
  return buildCatalog(cats, bySlug, IMG, localCatalog as Catalog)
}

export async function fetchLatest(kind: 'added' | 'updated', catalog: Catalog): Promise<MiniItem[]> {
  const r = await call(kind === 'added' ? '/products/lated-added-items' : '/products/lated-updated-items')
  return mapMiniItems(dataOf<ApiPackage[]>(r) ?? [], catalog, IMG)
}
