import Link from 'next/link'
import type { Catalog, Category } from '@/lib/types'
import type { MiniItem } from '@/lib/udder/map'
import { iconUrl, money } from '@/lib/format'
import GlobalSearch from './GlobalSearch'
import { Chevron } from './icons'
import Amp from './Amp'

function CatList({ catalog, current }: { catalog: Catalog; current?: Category }) {
  const top = catalog.order.map((s) => catalog.categories[s])
  return (
    <ul className="catlist">
      <li><Link href="/shop" aria-current={!current ? 'page' : undefined}><span>All categories</span><b>{top.length}</b></Link></li>
      {top.map((c) => {
        const open = c.children.length > 0 && (current?.slug === c.slug || current?.parent === c.slug)
        return (
          <li key={c.slug} className={c.children.length ? `has-kids${open ? ' is-open' : ''}` : undefined}>
            <Link href={`/${c.path}`} aria-current={current?.slug === c.slug ? 'page' : undefined}><span>{c.title}</span>{c.count > 0 && <b>{c.count}</b>}</Link>
            {c.children.length > 0 && (
              <ul hidden={!open}>
                {c.children.map((s) => catalog.categories[s]).map((ch) => (
                  <li key={ch.slug}><Link href={`/${ch.path}`} aria-current={current?.slug === ch.slug ? 'page' : undefined}><span>{ch.title}</span>{ch.count > 0 && <b>{ch.count}</b>}</Link></li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}

// Left column on the shop, category and search pages (desktop). Layout follows the new site's category
// page: search, categories, related categories, newly added items.
export function ShopSidebar(props: { catalog: Catalog; current?: Category; related?: Category[]; newItems?: MiniItem[]; search?: boolean }) {
  const { related = [], newItems = [], search = true } = props
  return (
    <aside className="sidebar">
      {search && (
        <div className="sidebar__search">
          <GlobalSearch size="sm" id="side-q" placeholder="Search all products" />
        </div>
      )}
      <div className="sidebar__box sidebar__box--cats">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="sidebar__head"><img src={iconUrl('basket')} alt="" width={34} height={34} /><h2>Categories</h2></div>
        <nav aria-label="Shop categories"><CatList catalog={props.catalog} current={props.current} /></nav>
      </div>
      {related.length > 0 && <RelatedBox related={related} />}
      {newItems.length > 0 && <NewItemsBox items={newItems} />}
      <div className="sidebar__note">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconUrl('delivery-truck')} alt="" width={40} height={40} loading="lazy" />
        <p>Members <Link href="/login">log in</Link> to order, then pay cash on delivery. New here? <Link href="/signup">Sign up</Link>.</p>
      </div>
    </aside>
  )
}

export function RelatedBox({ related }: { related: Category[] }) {
  return (
    <section className="sidebar__box sidebar__mini" aria-labelledby="side-related">
      <h2 id="side-related" className="sidebar__mini-h">Related categories</h2>
      <ul className="minilist">
        {related.map((c) => (
          <li key={c.slug}>
            <Link href={`/${c.path}`} style={{ ['--tint' as string]: c.tint }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <span className="minilist__img"><img src={iconUrl(c.icon)} alt="" width={36} height={36} loading="lazy" /></span>
              <span><b>{c.title}</b><small>{c.count === 0 ? 'Back soon' : `${c.instock} in stock`}</small></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function NewItemsBox({ items }: { items: MiniItem[] }) {
  return (
    <section className="sidebar__box sidebar__mini" aria-labelledby="side-new">
      <h2 id="side-new" className="sidebar__mini-h">Newly added items</h2>
      <ul className="minilist">
        {items.map((it) => (
          <li key={it.id}>
            <Link href={it.href}>
              <span className="minilist__img minilist__img--photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconUrl(it.icon)} alt="" width={36} height={36} loading="lazy" />
              </span>
              <span><b>{it.name}</b><small>{it.price != null ? <>{money(it.price)}{it.variant ? ` · ${it.variant}` : ''}</> : it.catTitle}</small></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function CatPicker(props: { catalog: Catalog; current?: Category }) {
  return (
    <details className="cat-picker">
      <summary>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconUrl('basket')} alt="" width={30} height={30} />
        <span><small>Categories</small>{props.current?.title ?? 'All categories'}</span>
        <i><Chevron /></i>
      </summary>
      <nav aria-label="Shop categories, list"><CatList {...props} /></nav>
    </details>
  )
}

export function CategoryTile({ c }: { c: Category }) {
  const meta = c.count === 0 ? 'Back soon' : c.allout ? `${c.count} item${c.count !== 1 ? 's' : ''} · all sold out` : `${c.instock} in stock${c.fromPrice != null ? ` · from $${c.fromPrice.toFixed(2)}` : ''}`
  return (
    <Link className={`ctile${c.count === 0 || c.allout ? ' is-empty' : ''}`} href={`/${c.path}`} style={{ ['--tint' as string]: c.tint }}>
      <span className="ctile__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ctile__icon" src={iconUrl(c.icon)} alt="" width={120} height={120} loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {c.photos[0] && <img className="ctile__photo" src={c.photos[0]} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span className="ctile__badge"><img src={iconUrl(c.icon)} alt="" width={44} height={44} loading="lazy" /></span>
      </span>
      <span className="ctile__body">
        <span className="ctile__name"><Amp text={c.title} /></span>
        <span className="ctile__meta">{meta}</span>
      </span>
    </Link>
  )
}
