import type { MetadataRoute } from 'next'

// /robots.txt. Member-only pages are also marked noindex on the pages themselves.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/shop-cart', '/checkout', '/order', '/order-history', '/edit-order', '/account'] },
    sitemap: 'https://uddermilk.com/sitemap.xml',
  }
}
