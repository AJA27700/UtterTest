import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCatalog, getNewArrivals, getRelatedCategories } from '@/lib/api'
import { iconUrl } from '@/lib/format'
import ProductList from './ProductList'
import { CategoryTile, CatPicker, NewItemsBox, RelatedBox, ShopSidebar } from './ShopNav'
import GlobalSearch from './GlobalSearch'
import Amp from './Amp'

// One category page. Used by /category/[slug], /sub-category/[slug] and /products/product_lists/[slug],
// the three address patterns the old site used.
export default async function CategoryPage({ slug, prefix }: { slug: string; prefix: string }) {
  const catalog = await getCatalog()
  const cat = catalog.categories[slug]
  if (!cat || cat.path !== `${prefix}/${slug}`) notFound() // only at its own address
  const parent = cat.parent ? catalog.categories[cat.parent] : null
  const children = cat.children.map((s) => catalog.categories[s])
  const [related, newItems] = await Promise.all([getRelatedCategories(slug), getNewArrivals(6)])

  return (
    <div className="shop-layout">
      <ShopSidebar catalog={catalog} current={cat} related={related} newItems={newItems} />
      <div className="shop-main">
        <div className="phone-search"><GlobalSearch size="sm" id="phone-q" placeholder="Search all products" /></div>
        <CatPicker catalog={catalog} current={cat} />
        <section className="cat-hero" aria-labelledby="cat-title">
          <div className="cat-hero__grid">
            <div className="cat-hero__text">
              <ol className="crumbs" aria-label="Breadcrumb">
                <li><Link href="/shop">Shop</Link></li>
                {parent && <li><Link href={`/${parent.path}`}>{parent.title}</Link></li>}
                <li aria-current="page">{cat.title}</li>
              </ol>
              <h1 id="cat-title"><Amp text={cat.title} /></h1>
              {cat.note && <p className="lede">{cat.note}</p>}
              <div className="cat-stats">
                {cat.count ? (
                  <>
                    <span className="tag tag--milk">{cat.count} product{cat.count !== 1 ? 's' : ''}</span>
                    <span className="tag tag--grass">{cat.instock} in stock</span>
                    {cat.fromPrice != null && <span className="tag tag--milk">from ${cat.fromPrice.toFixed(2)}</span>}
                  </>
                ) : <span className="tag tag--out">Back soon</span>}
              </div>
            </div>
            <div className="collage" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {cat.photos.slice(0, 3).map((ph, n) => <span key={ph} className={`collage__ph collage__ph--${n + 1}`}><img src={ph} alt="" loading="lazy" referrerPolicy="no-referrer" /></span>)}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <span className="collage__plate" style={{ ['--tint' as string]: cat.tint }}><img src={iconUrl(cat.icon)} alt="" width={200} height={200} /></span>
            </div>
          </div>
        </section>

        {children.length > 0 && (
          <section className="sub-cats" aria-label={`In ${cat.title}`}>
            <div className="cgrid">{children.map((c) => <CategoryTile key={c.slug} c={c} />)}</div>
          </section>
        )}

        {cat.products.length > 0 ? (
          <ProductList products={cat.products} catPath={cat.path} tint={cat.tint} title={cat.title} />
        ) : children.length === 0 && (
          <div className="products"><div className="empty-note">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconUrl(cat.icon)} alt="" width={110} height={110} />
            <div><h2>Nothing on the shelf right now.</h2><p className="muted">{cat.note}</p></div>
          </div></div>
        )}

        {related.length > 0 && (
          <section className="related" aria-labelledby="more-title">
            <h2 id="more-title">Related <em>categories</em></h2>
            <div className="cgrid cgrid--4">{related.slice(0, 4).map((c) => <CategoryTile key={c.slug} c={c} />)}</div>
          </section>
        )}
        <div className="phone-only phone-boxes">
          {newItems.length > 0 && <NewItemsBox items={newItems} />}
          {related.length > 4 && <RelatedBox related={related.slice(4)} />}
        </div>
      </div>
    </div>
  )
}
