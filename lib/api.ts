// The ONE place the site reads product data from.
//
// UDDERMILK_API_URL set (e.g. https://test.uddermilk.com/api/v1): live from Udder Milk's API, so price,
//   stock and product changes made in their system show up here within a few minutes (or right away
//   when the backend calls /api/revalidate).
// Not set: data/catalog.json, a saved copy of the old site's products (the preview).
import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import localCatalog from '@/data/catalog.json'
import type { Catalog, Category } from './types'
import { live } from './udder/client'
import { fetchLatest, fetchLiveCatalog } from './udder/catalog'
import type { MiniItem } from './udder/map'
export type { MiniItem }

export async function getCatalog(): Promise<Catalog> {
  'use cache'
  cacheLife('minutes') // prices and stock refresh every few minutes
  cacheTag('catalog') // or instantly: the backend calls /api/revalidate after a change
  return live ? fetchLiveCatalog() : (localCatalog as Catalog)
}

export async function getTopCategories(): Promise<Category[]> {
  const c = await getCatalog()
  return c.order.map((s) => c.categories[s]).filter(Boolean)
}

export async function getCategory(slug: string): Promise<Category | null> {
  const c = await getCatalog()
  return c.categories[slug] ?? null
}

export async function getCategorySlugs(prefix: string): Promise<string[]> {
  const c = await getCatalog()
  return Object.values(c.categories)
    .filter((x) => x.path.startsWith(prefix + '/'))
    .map((x) => x.slug)
}


/* ---------- related categories, newly added, back in stock ----------
   Live: related categories come with each category (POST /products returns relatedCats);
   newly added = GET /products/lated-added-items; back in stock = GET /products/lated-updated-items.
   Preview: worked out from data/catalog.json. */

export async function getRelatedCategories(slug: string): Promise<Category[]> {
  const c = await getCatalog()
  const cat = c.categories[slug]
  if (!cat) return []
  if (cat.related?.length) return cat.related.map((s) => c.categories[s]).filter(Boolean).slice(0, 5)
  const parent = cat.parent ? c.categories[cat.parent] : null
  if (parent) return parent.children.filter((s) => s !== slug).map((s) => c.categories[s]).filter(Boolean).slice(0, 5)
  // top-level: the next categories with the same colour (same aisle), then the next ones in the shop
  const top = c.order.map((s) => c.categories[s]).filter(Boolean)
  const i = top.findIndex((x) => x.slug === slug)
  const rest = [...top.slice(i + 1), ...top.slice(0, Math.max(0, i))]
  const same = rest.filter((x) => x.tint === cat.tint)
  return [...same, ...rest.filter((x) => x.tint !== cat.tint)].filter((x) => x.count > 0).slice(0, 5)
}

function sample(c: Catalog, slugs: string[], n: number): MiniItem[] {
  const picks: MiniItem[] = []
  for (const slug of slugs) {
    const cat = c.categories[slug]
    const p = cat?.products.find((x) => !x.allout && x.photo) ?? cat?.products.find((x) => !x.allout)
    if (!cat || !p) continue
    const v = p.variants.find((x) => !x.out && x.price != null)
    picks.push({ id: p.id, name: p.name, variant: v?.label ?? '', href: `/${cat.path}#${p.id}`, photo: p.photo, icon: p.icon, price: v?.price ?? p.fromPrice, from: false, catTitle: cat.title })
    if (picks.length === n) break
  }
  return picks
}

export async function getNewArrivals(n = 8): Promise<MiniItem[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('catalog')
  const c = await getCatalog()
  if (live) return (await fetchLatest('added', c).catch(() => [])).slice(0, n)
  return sample(c, ['raw-cheese-cow-goat-sheep', 'walnut-run-amish-bakery', 'honey-maple-syrup-and-sweeteners', 'goat-dairy', 'ready-to-eat-vegetarian-meat-meals-desserts', 'beef', 'eggs', 'pantry', 'fresh-shrimp'], n)
}

export async function getBackInStock(n = 8): Promise<MiniItem[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('catalog')
  const c = await getCatalog()
  if (live) return (await fetchLatest('updated', c).catch(() => [])).slice(0, n)
  return sample(c, ['cow-dairy', 'sheep-dairy', 'gurnsey-dairy', 'fermented-items', 'lamb', 'baked-goods', 'soup-and-stews', 'buffalo-dairy', 'chickens'], n)
}
