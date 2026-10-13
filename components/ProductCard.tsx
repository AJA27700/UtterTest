'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/lib/types'
import { iconUrl, money } from '@/lib/format'
import { useCart } from './cart'
import { Bag, Chevron, Minus, Plus } from './icons'
import Amp from './Amp'

type Props = { p: Product; catPath: string; tint: string; open: boolean; onOpen: () => void; onClose: () => void; grid: boolean }

export default function ProductCard({ p, catPath, tint, open, onOpen, onClose, grid }: Props) {
  const { add } = useCart()
  const buyable = p.variants.filter((v) => !v.out && v.price != null)
  const [variant, setVariant] = useState(buyable[0]?.label ?? '')
  const [qty, setQty] = useState(1)
  const [more, setMore] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const [photo, setPhoto] = useState(p.photo)
  const [photoOk, setPhotoOk] = useState(true)
  const [added, setAdded] = useState(false)
  const descRef = useRef<HTMLParagraphElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const d = descRef.current
    if (d) setOverflows(d.scrollHeight > d.clientHeight + 2)
  }, [])
  useEffect(() => { if (open) closeRef.current?.focus({ preventScroll: true }) }, [open])

  const hasLong = p.long.length > 0
  const clamp = !more && (hasLong || overflows)
  const from = p.allout ? 'Sold out' : p.fromPrice != null ? `${p.variants.length > 1 ? 'from ' : ''}${money(p.fromPrice)}` : 'Price at login'

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const v = buyable.find((x) => x.label === variant)
    if (!v || v.price == null) return
    add([{ key: `${p.id}|${v.label}`, name: p.name, variant: v.label, price: v.price, qty, url: `/${catPath}#${p.id}`, img: p.photo, icon: p.icon }])
    setQty(1); setAdded(true); setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article
      className={`product${p.allout ? ' is-allout' : ''}${photo ? ' has-photo' : ''}${open ? ' is-open' : ''}`}
      id={p.id}
      style={{ ['--tint' as string]: tint }}
      tabIndex={grid ? -1 : undefined}
      onClickCapture={(e) => {
        // Phones, big categories: a tap on the small tile opens the full product as a bottom sheet.
        if (grid && !open && window.matchMedia('(max-width: 640px)').matches) { e.preventDefault(); e.stopPropagation(); onOpen() }
      }}
    >
      <div className="product__media">
        <figure className="ph">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ph__icon" src={iconUrl(p.icon)} alt="" width={160} height={160} loading="lazy" />
          {photo && photoOk && (
            <span className="ph__zoom">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ph__img" src={photo} alt={p.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setPhotoOk(false)} />
            </span>
          )}
        </figure>
        {p.gallery.length > 0 && (
          <div className="thumbs" role="group" aria-label={`More photos of ${p.name}`}>
            {[p.photo, ...p.gallery].filter(Boolean).slice(0, 10).map((g) => (
              <button key={g} className={`thumb${g === photo ? ' is-on' : ''}`} type="button" aria-pressed={g === photo} onClick={() => { setPhoto(g); setPhotoOk(true) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g!} alt="" loading="lazy" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}
      </div>
      <button className="sheet-x" type="button" aria-label="Close" ref={closeRef} onClick={onClose}>×</button>
      <div className="product__body">
        <h2><Amp text={p.name} /></h2>
        <p className="product__from">{from}</p>
        <div className="tags">
          {p.tags.map((t) => <span key={t.text} className={`tag${t.cls ? ` tag--${t.cls}` : ''}`}>{t.text}</span>)}
          {p.allout && <span className="tag tag--out">Sold out</span>}
        </div>
        {p.desc && (!more || !hasLong) && <p className={`product__desc${clamp ? ' is-clamped' : ''}`} ref={descRef}>{p.desc}</p>}
        {hasLong && more && (
          <div className="product__long">
            {p.long.map((b, i) =>
              b.k === 'h' ? <h3 key={i}>{b.t}</h3>
              : b.k === 'note' ? <p key={i} className="health-note">{b.t}</p>
              : b.k === 'p' ? <p key={i}>{b.t}</p>
              : 'items' in b ? <ul key={i} className={b.k === 'check' ? 'checks' : 'bul'}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul> : null,
            )}
          </div>
        )}
        {(hasLong || overflows) && (
          <button className="more-btn" type="button" aria-expanded={more} onClick={() => setMore((m) => !m)}>
            <span>{more ? 'Show less' : 'Read more'}</span> <Chevron />
          </button>
        )}
        <ul className={`variants${p.variants.length > 8 ? ' variants--cols' : ''}`} aria-label="Sizes and prices">
          {p.variants.map((v) => (
            <li key={v.label} className={v.out ? 'is-out' : undefined}>
              <span className="v-label">{v.label}</span>
              {v.price != null ? <span className="price">{money(v.price)}</span> : <span className="ask">Price at login</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="product__foot">
        {p.allout ? (
          <a className="btn btn--ghost btn--sm" href={`mailto:info@uddermilk.com?subject=${encodeURIComponent('Back in stock: ' + p.name)}`}>Ask when it&apos;s back</a>
        ) : buyable.length ? (
          <form className="addcart" onSubmit={submit}>
            <label className="sr-only" htmlFor={`${p.id}-v`}>Size</label>
            <select id={`${p.id}-v`} value={variant} onChange={(e) => setVariant(e.target.value)}>
              {buyable.map((v) => <option key={v.label} value={v.label}>{v.label} · {money(v.price)}</option>)}
            </select>
            <div className="qty" role="group" aria-label="Quantity">
              <button type="button" aria-label="One fewer" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus /></button>
              <input type="number" min={1} max={99} value={qty} inputMode="numeric" aria-label="Quantity" onChange={(e) => setQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))} />
              <button type="button" aria-label="One more" onClick={() => setQty((q) => Math.min(99, q + 1))}><Plus /></button>
            </div>
            <button className={`btn btn--sm${added ? ' is-added' : ''}`} type="submit"><Bag /> Add to cart</button>
          </form>
        ) : (
          <Link className="btn btn--sm" href="/login">Log in to see prices</Link>
        )}
        {!p.allout && <span className="muted">Members only · pay on delivery</span>}
      </div>
    </article>
  )
}
