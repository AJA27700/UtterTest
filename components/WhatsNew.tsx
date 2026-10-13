'use client'
// Homepage "What's new at the farm": two tabs that fill themselves from the backend.
//   Just added    → GET /products/lated-added-items
//   Back in stock → GET /products/lated-updated-items
// When the farm adds or restocks something, it shows up here on its own (the catalogue refreshes every few minutes).
import Link from 'next/link'
import { useState } from 'react'
import type { MiniItem } from '@/lib/udder/map'
import { iconUrl, money } from '@/lib/format'
import { Arrow } from './icons'

function Thumb({ it }: { it: MiniItem }) {
  const [broken, setBroken] = useState(false)
  return it.photo && !broken
    // eslint-disable-next-line @next/next/no-img-element
    ? <img className="wn__photo" src={it.photo} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
    // eslint-disable-next-line @next/next/no-img-element
    : <img className="wn__icon" src={iconUrl(it.icon)} alt="" width={96} height={96} loading="lazy" />
}

export default function WhatsNew({ added, restocked }: { added: MiniItem[]; restocked: MiniItem[] }) {
  const tabs = [['added', 'Just added', added], ['restocked', 'Back in stock', restocked]] as const
  const [tab, setTab] = useState<'added' | 'restocked'>(added.length ? 'added' : 'restocked')
  const items = tab === 'added' ? added : restocked
  if (!added.length && !restocked.length) return null
  return (
    <section className="section wn" aria-labelledby="wn-title">
      <div className="container">
        <div className="head head--row">
          <div className="head" style={{ margin: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className="eyebrow" data-reveal=""><img src={iconUrl('hatching-chick')} alt="" width={20} height={20} />Fresh on the shelf</span>
            <h2 id="wn-title" data-reveal="">What&apos;s new<br /><em>at the farm.</em></h2>
          </div>
          <div className="wn__tabs" role="tablist" aria-label="What's new" data-reveal="">
            {tabs.map(([k, label, list]) => (
              <button key={k} role="tab" type="button" aria-selected={tab === k} aria-controls="wn-panel" disabled={!list.length} className={`chip${tab === k ? ' is-active' : ''}`} onClick={() => setTab(k)}>
                {label}<b>{list.length}</b>
              </button>
            ))}
          </div>
        </div>
        <ul className="wn__grid" id="wn-panel" role="tabpanel">
          {items.map((it) => (
            <li key={it.id}>
              <Link className="wn__card" href={it.href}>
                <span className="wn__img"><Thumb it={it} /><span className={`wn__badge${tab === 'restocked' ? ' wn__badge--back' : ''}`}>{tab === 'added' ? 'New' : 'Back'}</span></span>
                <span className="wn__body">
                  <b>{it.name}</b>
                  <small>{[it.variant, it.catTitle].filter(Boolean).join(' · ')}</small>
                  {it.price != null && <span className="price">{money(it.price)}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="center" style={{ marginTop: 26 }}><Link className="btn btn--ghost" href="/shop">Browse the whole shop <Arrow /></Link></div>
      </div>
    </section>
  )
}
