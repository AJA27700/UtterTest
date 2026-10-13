'use client'
import { useEffect, useState } from 'react'
import type { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import { Search, X } from './icons'

export default function ProductList({ products, catPath, tint, title }: { products: Product[]; catPath: string; tint: string; title: string }) {
  const [inStock, setInStock] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const grid = products.length > 6 // phones: 3-across tiles for bigger categories
  const [q, setQ] = useState('')
  // Local search: only this category's products (name, sizes, tags, description)
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  const match = (p: Product) => !terms.length || terms.every((t) => `${p.name} ${p.variants.map((v) => v.label).join(' ')} ${p.tags.map((x) => x.text).join(' ')} ${p.desc}`.toLowerCase().includes(t))
  const shown = products.filter((p) => (!inStock || !p.allout) && match(p))

  useEffect(() => {
    document.body.classList.toggle('sheet-open', !!openId)
    if (!openId) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenId(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openId])

  return (
    <>
      <div className="cat-tools">
        <div className="cat-tools__bar">
          <div className={`localsearch${q ? ' has-q' : ''}`}>
            <Search />
            <label className="sr-only" htmlFor="local-q">Search in {title}</label>
            <input id="local-q" type="search" placeholder={`Search in ${title.length > 26 ? 'this category' : title}`} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Escape' && setQ('')} autoComplete="off" />
            {q && <button type="button" aria-label="Clear" onClick={() => setQ('')}><X /></button>}
          </div>
          <nav className="jump" aria-label="Products on this page">
            {shown.map((p) => <a key={p.id} href={`#${p.id}`}>{p.name}</a>)}
          </nav>
          <label className="toggle">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
            <span className="toggle__ui" aria-hidden="true"></span><span>In stock<span className="t-long"> only</span></span>
          </label>
        </div>
      </div>
      <div className={`products${grid ? ' products--grid' : ''}`}>
        {shown.map((p) => (
          <ProductCard key={p.id} p={p} catPath={catPath} tint={tint} grid={grid} open={openId === p.id} onOpen={() => setOpenId(p.id)} onClose={() => setOpenId(null)} />
        ))}
        {shown.length === 0 && (
          <p className="hidden-note" style={{ display: 'block' }}>
            {terms.length
              ? <>Nothing in {title} matches “{q}”. <a href={`/search?q=${encodeURIComponent(q)}`}>Search all products instead</a>.</>
              : 'Everything in this category is sold out right now. Switch off “In stock only” to see the full list.'}
          </p>
        )}
      </div>
      {openId && <div className="sheet-veil" onClick={() => setOpenId(null)} />}
    </>
  )
}
