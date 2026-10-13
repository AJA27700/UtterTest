'use client'
// Search the whole shop (every category). Suggestions as you type; Enter opens the full results page.
// Used on the shop page, in the category sidebar, and on phones above the category picker.
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { iconUrl, money } from '@/lib/format'
import { Search, X } from './icons'

type Hit = { id: string; name: string; href: string; icon: string; cat: string; out: boolean; price: number | null; from: boolean }

export default function GlobalSearch({ size = 'lg', initial = '', placeholder = 'Search milk, cheese, lamb, honey…', id = 'gq' }: { size?: 'lg' | 'sm'; initial?: string; placeholder?: string; id?: string }) {
  const [q, setQ] = useState(initial)
  const [res, setRes] = useState<{ q: string; total: number; hits: Hit[] } | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const box = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    const term = q.trim()
    if (!term) return
    const ctl = new AbortController()
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctl.signal }).then((r) => r.json()).then((d) => { setRes(d); setActive(-1) }).catch(() => {})
    }, 160)
    return () => { clearTimeout(t); ctl.abort() }
  }, [q])
  useEffect(() => {
    const off = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('click', off)
    return () => document.removeEventListener('click', off)
  }, [])

  const term = q.trim()
  const hits = term && res?.q === term ? res.hits : []
  const go = () => { if (term) { setOpen(false); router.push(`/search?q=${encodeURIComponent(term)}`) } }

  return (
    <form ref={box} role="search" className={`search search--${size}${q ? ' has-q' : ''}${open && term ? ' is-open' : ''}`} onSubmit={(e) => { e.preventDefault(); if (active >= 0 && hits[active]) { setOpen(false); router.push(hits[active].href) } else go() }}>
      <span className="search__icon"><Search /></span>
      <label className="sr-only" htmlFor={id}>Search all products</label>
      <input
        id={id} type="search" placeholder={placeholder} autoComplete="off" value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') { setQ(''); setOpen(false) }
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (hits.length) setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length) }
        }}
        role="combobox" aria-expanded={open && !!term} aria-controls={`${id}-results`} aria-autocomplete="list"
      />
      <button className="search__clear" type="button" aria-label="Clear search" onClick={() => { setQ(''); setRes(null) }}><X /></button>
      <div className="results" id={`${id}-results`} role="listbox" aria-live="polite">
        {term && res?.q === term && !hits.length && <div className="results__empty">Nothing matches <b>{term}</b>. Try “butter”, “kefir”, “lamb” or “honey”.</div>}
        {hits.map((it, i) => (
          <Link key={it.id} className={`result${i === active ? ' is-active' : ''}`} href={it.href} role="option" aria-selected={i === active} onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconUrl(it.icon)} alt="" width={44} height={44} loading="lazy" />
            <span><b>{it.name}</b><small>{it.cat}{it.out ? ' · sold out' : ''}</small></span>
            {it.price != null ? <span className="price">{it.from && <small>from </small>}{money(it.price)}</span> : <span />}
          </Link>
        ))}
        {term && res?.q === term && res.total > 0 && (
          <button type="submit" className="results__all">See all {res.total} result{res.total === 1 ? '' : 's'} for “{term}” →</button>
        )}
      </div>
    </form>
  )
}
