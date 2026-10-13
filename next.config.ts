import type { NextConfig } from 'next'

// Old uddermilk.com addresses that moved. Permanent (308) redirects, so Google moves its ranking over.
const MOVED: [string, string][] = [
  ['/pages/new_index', '/'],
  ['/products/new_shop', '/shop'],
  ['/news/shownews', '/news'],
  ['/articles/showarticles', '/articles'],
  ['/news/newsdetails/106', '/faq'],
  ['/news/newsdetails/110', '/about-us'],
  ['/articles/articledetails/223', '/where-we-deliver'],
  ['/pickup-delivery', '/where-we-deliver'], // merged into Where We Deliver
  ['/Wherewedelivers/new_deliverdetails/19', '/where-we-deliver'],
  ['/products/productdetails/163', '/category/soup-and-stews'],
  ['/products/productdetails/76', '/category/sheep-dairy'],
  ['/products/productdetails/168', '/category/bread-taboun-bread'],
  ['/driver-login', '/login'], // the driver login was removed
  // articles that were merged into others
  ['/articles/new_articledetails/302', '/articles'],
  ['/articles/new_articledetails/309', '/about-us'],
  ['/articles/new_articledetails/310', '/about-us'],
  ['/articles/new_articledetails/311', '/articles/new_articledetails/306'],
  ['/articles/new_articledetails/312', '/articles/new_articledetails/306'],
  ['/articles/new_articledetails/313', '/articles/new_articledetails/307'],
  ['/articles/new_articledetails/314', '/articles/new_articledetails/305'],
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/:path*/index.html', destination: '/:path*', permanent: true },
      ...MOVED.map(([source, destination]) => ({ source, destination, permanent: true })),
    ]
  },
}

export default nextConfig
