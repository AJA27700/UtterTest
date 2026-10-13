import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getCatalog, getNewArrivals } from '@/lib/api'
import { CatPicker, ShopSidebar } from '@/components/ShopNav'
import SearchView from './SearchView'

export const metadata: Metadata = { title: 'Search', robots: { index: false } }

// /search?q=butter: every product that matches, across all categories, with add to cart.
export default async function Page() {
  const [catalog, newItems] = await Promise.all([getCatalog(), getNewArrivals(6)])
  return (
    <div className="shop-layout">
      <ShopSidebar catalog={catalog} newItems={newItems} search={false} />
      <div className="shop-main">
        <CatPicker catalog={catalog} />
        <Suspense fallback={<div className="shop-hero" style={{ minHeight: '40vh' }} />}>
          <SearchView />
        </Suspense>
      </div>
    </div>
  )
}
