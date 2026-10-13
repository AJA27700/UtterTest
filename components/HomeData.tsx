/* eslint-disable @next/next/no-img-element */
// The two homepage sections that show live catalogue data: the featured picks and the category tiles.
// Prices and stock come from getCatalog(), so they follow the backend once it's connected.
import Link from 'next/link'
import type { Catalog } from '@/lib/types'
import { iconUrl, money } from '@/lib/format'
import { Arrow } from './icons'
import Amp from './Amp'

const ArrowRound = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
const ArrowBack = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
const ArrowDiag = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>

// Edit this list to change the featured products. `variant` picks which size's price is shown;
// leave it out to show "from" the lowest price.
const PICKS = [
  { name: 'Raw Guernsey Milk', tags: ['Raw', 'A2/A2'], desc: "Kathy's golden Guernsey milk, with a thick layer of cream on top.", cat: 'gurnsey-dairy', id: 'raw-guernsey-milk', variant: 'Gallon', unit: 'gallon', icon: 'glass-of-milk', tint: '#DCE7F6' },
  { name: 'Raw Grass-Fed Butter', tags: ['Raw', 'A2/A2'], desc: 'Churned from grass-fed Jersey and Guernsey cream.', cat: 'cow-dairy', id: 'raw-grass-fed-butter', variant: 'Jersey unsalted · half pint', unit: 'half pint', icon: 'butter', tint: '#FBE8A6' },
  { name: 'Heritage Eggs', tags: ['Pasture-raised'], desc: 'Pastel shells from Araucana, Welsummer and Marans hens.', cat: 'eggs', id: 'heritage-eggs', variant: 'Dozen', unit: 'dozen', icon: 'egg', tint: '#E1ECD2' },
  { name: 'Raw Sheep Yogurt', tags: ['Raw'], desc: 'So rich it sets thick like Greek yogurt, and naturally sweet.', cat: 'sheep-dairy', id: 'raw-sheep-yogurt', variant: 'Pint', unit: 'pint', icon: 'bowl-with-spoon', tint: '#FBE1DC' },
  { name: "Maryam's Guernsey Cheese", tags: ['Raw', 'A2/A2'], desc: 'Twenty handmade wheels, from gouda to tomme to blue.', cat: 'raw-cheese-cow-goat-sheep', id: 'maryams-a2-a2-raw-guernsey-cheese', unit: '½ lb', icon: 'cheese-wedge', tint: '#FBE8A6' },
  { name: 'Wildflower Honey', tags: ['Raw', 'Local'], desc: 'From the Pennsylvania mountains, never heated past 115°F.', cat: 'honey-maple-syrup-and-sweeteners', id: 'raw-local-honey-pourable', variant: 'Raw local wildflower · pint', unit: 'pint', icon: 'honey-pot', tint: '#F8DDC4' },
  { name: 'Einkorn Heritage Sourdough', tags: ['Einkorn'], desc: "Walnut Run's slow-risen loaf, made with Jersey milk and pastured butter.", cat: 'sourdough-heritage-bread', id: 'einkorn-sourdough-heritage-bread', variant: '25 oz loaf', unit: '25 oz loaf', icon: 'bread', tint: '#FBE8A6' },
  { name: 'Grass-Fed Rib Eye', tags: ['100% grass-fed'], desc: 'Frozen right after slaughter. Marinate it a day ahead.', cat: 'beef', id: 'beef-steaks', variant: 'Rib eye · 2 lb', unit: '2 lb', icon: 'cut-of-meat', tint: '#FBE1DC' },
]

export const HOME_CATS = ['eggs', 'gurnsey-dairy', 'cow-dairy', 'goat-dairy', 'sheep-dairy', 'raw-cheese-cow-goat-sheep', 'grass-fed-meats', 'fresh-shrimp',
  'honey-maple-syrup-and-sweeteners', 'ready-to-eat-vegetarian-meat-meals-desserts', 'walnut-run-amish-bakery', '2021-fresh-organic-produce']

export function Picks({ catalog }: { catalog: Catalog }) {
  const picks = PICKS.flatMap((p) => {
    const c = catalog.categories[p.cat]
    const prod = c?.products.find((x) => x.id === p.id)
    if (!c || !prod) return [] // dropped from the catalogue: skip it
    const v = p.variant ? prod.variants.find((x) => x.label === p.variant) : undefined
    const price = v?.price ?? prod.fromPrice
    const from = !v && prod.variants.length > 1
    return [{ ...p, href: `/${c.path}#${p.id}`, price, from, out: prod.allout || !!v?.out }]
  })
  return (
    <section className="section" aria-labelledby="picks-title">
      <div className="container" data-scroller="">
        <div className="head head--row">
          <div className="head" style={{ margin: 0 }}>
            <span className="eyebrow" data-reveal=""><img src={iconUrl('sparkles')} alt="" width="20" height="20" />From the dairy case &amp; beyond</span>
            <h2 id="picks-title" data-reveal="">Start with<br /><em>the good stuff.</em></h2>
          </div>
          <div className="picks-nav" data-reveal="">
            <button className="round-btn" type="button" data-prev="" aria-label="Scroll back"><ArrowBack /></button>
            <button className="round-btn" type="button" data-next="" aria-label="Scroll forward"><ArrowRound /></button>
          </div>
        </div>
        <div className="picks" data-stagger="">
          {picks.map((p) => (
            <Link key={p.id} className="pick" href={p.href} style={{ ['--tint' as string]: p.tint }} data-reveal="">
              <div className="pick__top"><div className="tags">{p.tags.map((t) => <span key={t} className="tag tag--milk">{t}</span>)}{p.out && <span className="tag tag--out">Sold out</span>}</div></div>
              <div className="pick__img"><img src={iconUrl(p.icon)} alt="" width="190" height="190" loading="lazy" /></div>
              <h3><Amp text={p.name} /></h3>
              <p>{p.desc}</p>
              <div className="pick__foot">
                {p.price != null ? <span className="price">{p.from && <small>from </small>}{money(p.price)}<small>/ {p.unit}</small></span> : <span className="price"><small>Price at login</small></span>}
                <span className="round-btn" aria-hidden="true"><ArrowRound /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Tiles({ catalog }: { catalog: Catalog }) {
  const n = catalog.order.length
  const cats = HOME_CATS.map((s) => catalog.categories[s]).filter(Boolean)
  return (
    <section className="section" style={{ paddingTop: 0 }} aria-labelledby="cats-title">
      <div className="container">
        <div className="head head--row">
          <div className="head" style={{ margin: 0 }}>
            <span className="eyebrow" data-reveal=""><img src={iconUrl('shopping-bags')} alt="" width="20" height="20" />The farm stand</span>
            <h2 id="cats-title" data-reveal="">{n} categories,<br /><em>one farm stand.</em></h2>
          </div>
          <p className="lede" data-reveal="">From raw milk in five kinds to hand-painted papyrus art. Here&apos;s where most members start.</p>
        </div>
        <div className="tiles tiles--4" data-stagger="">
          {cats.map((c) => (
            <Link key={c.slug} className="tile" href={`/${c.path}`} style={{ ['--tint' as string]: c.tint }} data-reveal="">
              <img className="tile__img" src={iconUrl(c.icon)} alt="" width="92" height="92" loading="lazy" />
              <h3><Amp text={c.title} /></h3>
              <div className="tile__meta">
                <span>{c.count === 0 ? 'Back soon' : c.allout ? 'All sold out' : `${c.instock} in stock${c.fromPrice != null ? ` · from ${money(c.fromPrice)}` : ''}`}</span>
                <span className="tile__go"><ArrowDiag /></span>
              </div>
            </Link>
          ))}
        </div>
        <div className="center" style={{ marginTop: 30 }} data-reveal="">
          <Link className="btn" href="/shop">See all {n} categories <Arrow /></Link>
        </div>
      </div>
    </section>
  )
}
