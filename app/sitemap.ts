import type { MetadataRoute } from 'next'
import { getCatalog } from '@/lib/api'
import { ARTICLES } from '@/components/content/article-pages'

const SITE = 'https://uddermilk.com'
const PAGES = ['', '/shop', '/about-us', '/videos', '/articles', '/recipes', '/news', '/faq', '/contact-us', '/where-we-deliver', '/signup', '/privacy-policy', '/terms-services']

// /sitemap.xml: every public page, so Google finds them all. Rebuilt along with the catalogue.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog()
  return [
    ...PAGES.map((p) => ({ url: SITE + p, changeFrequency: p === '' || p === '/shop' ? ('daily' as const) : ('monthly' as const), priority: p === '' ? 1 : 0.7 })),
    ...Object.values(catalog.categories).map((c) => ({ url: `${SITE}/${c.path}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...Object.keys(ARTICLES).map((id) => ({ url: `${SITE}/articles/new_articledetails/${id}`, changeFrequency: 'yearly' as const, priority: 0.5 })),
  ]
}
