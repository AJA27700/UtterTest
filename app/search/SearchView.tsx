'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import GlobalSearch from '@/components/GlobalSearch'
import ProductCard from '@/components/ProductCard'
import { Arrow } from '@/components/icons'
import { iconUrl } from '@/lib/format'
import type { Category, Product } from '@/lib/types'

type Hit = { product: Product; cat: Pick<Category, 'slug' | 'title' | 'path' | 'tint'> }

export default function SearchView() {
  const q = (useSearchParams().get('q') ?? '').trim()
  const [res, setRes] = useState<{ q: string; total: number; hits: Hit[] } | null>(null)
  useEffect(() => {
    if (!q) return
    const ctl = new AbortController()
    fetch(`/api/search?q=${encodeURIComponent(q)}&full=1`, { signal: ctl.signal }).then((r) => r.json()).then(setRes).catch(() => {})
    return () => ctl.abort()
  }, [q])

  const ready = !!q && res?.q === q
  const groups: { cat: Hit['cat']; items: Product[] }[] = []
  if (ready) for (const h of res!.hits) {
    const g = groups.find((x) => x.cat.slug === h.cat.slug)
    if (g) g.items.push(h.product); else groups.push({ cat: h.cat, items: [h.product] })
  }

  return (
    <>
      <section className="shop-hero" aria-labelledby="search-title">
        <span className="eyebrow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconUrl('magnifying-glass-tilted-left')} alt="" width={20} height={20} />
          Search all products
        </span>
        <h1 id="search-title">{q ? <>Results for <em>“{q}”</em></> : <>Search the <em>shop.</em></>}</h1>
        <p className="lede">{!q ? 'Type what you are looking for: a product, a size, a farm.' : !ready ? 'Searching…' : res!.total ? `${res!.total} product${res!.total === 1 ? '' : 's'} in ${groups.length} categor${groups.length === 1 ? 'y' : 'ies'}.` : 'No products match. Try a shorter word, like “butter”, “kefir”, “lamb” or “honey”.'}</p>
        <GlobalSearch key={q} initial={q} id="sq" />
      </section>
      {ready && groups.map((g) => (
        <section key={g.cat.slug} className="sgroup" aria-label={g.cat.title}>
          <div className="sgroup__head">
            <h2>{g.cat.title}</h2>
            <Link className="link-arrow" href={`/${g.cat.path}`}>Open category <Arrow /></Link>
          </div>
          <div className="products">
            {g.items.map((p) => <ProductCard key={p.id} p={p} catPath={g.cat.path} tint={g.cat.tint} grid={false} open={false} onOpen={() => {}} onClose={() => {}} />)}
          </div>
        </section>
      ))}
      {ready && res!.total > res!.hits.length && <p className="muted" style={{ textAlign: 'center' }}>Showing the first {res!.hits.length}. Add another word to narrow it down.</p>}
    </>
  )
}
