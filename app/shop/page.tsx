import type { Metadata } from 'next'
import { getCatalog, getNewArrivals } from '@/lib/api'
import { iconUrl } from '@/lib/format'
import GlobalSearch from '@/components/GlobalSearch'
import { CategoryTile, CatPicker, ShopSidebar } from '@/components/ShopNav'

export const metadata: Metadata = {
  title: 'Shop the farm',
  description: 'Raw dairy, grass-fed meat, bakery, pantry and more from the Udder Milk farm stand.',
}

export default async function ShopPage() {
  const catalog = await getCatalog()
  const top = catalog.order.map((s) => catalog.categories[s])
  const all = Object.values(catalog.categories)
  const newItems = await getNewArrivals(6)
  const nProducts = all.reduce((s, c) => s + c.products.length, 0)
  return (
    <div className="shop-layout">
      <ShopSidebar catalog={catalog} newItems={newItems} search={false} />
      <div className="shop-main">
        <CatPicker catalog={catalog} />
        <section className="shop-hero" aria-labelledby="shop-title">
          <span className="eyebrow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconUrl('shopping-bags')} alt="" width={20} height={20} />
            The farm stand · {nProducts} products
          </span>
          <h1 id="shop-title">
            Shop <em>the farm.</em>
          </h1>
          <p className="lede">
            Pick a category, or search for anything from buttermilk to beef tongue. Anyone can look. Members log in to order, and pay cash
            on delivery.
          </p>
          <GlobalSearch />
        </section>
        <h2 className="sr-only">All categories</h2>
        <div className="cgrid">
          {top.map((c) => (
            <CategoryTile key={c.slug} c={c} />
          ))}
        </div>
      </div>
    </div>
  )
}
