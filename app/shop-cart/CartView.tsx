'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/components/cart'
import { Arrow } from '@/components/icons'
import { Empty, Lines, ordersApi, Preview, Steps, Summary, toLines } from '@/components/orders'
import { count, iconUrl } from '@/lib/format'

export default function CartView() {
  const { items, ready, setQty, remove, clear, editing, setEditing } = useCart()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function addToOrder() {
    if (!editing) return
    setBusy(true)
    try {
      const o = await ordersApi.get(editing)
      if (!o) throw new Error('That order no longer exists.')
      const merged = [...o.items.map((x) => ({ ...x }))]
      for (const it of items) {
        const hit = merged.find((x) => x.key === it.key)
        if (hit) hit.qty = Math.min(99, hit.qty + it.qty); else merged.push(it)
      }
      await ordersApi.update(o.id, { items: toLines(merged) })
      clear(); setEditing(null)
      router.push(`/edit-order?id=${encodeURIComponent(o.id)}&added=1`)
    } catch (e) { setErr((e as Error).message); setBusy(false) }
  }

  return (
    <div className="om">
      <Preview />
      <Steps at={0} />
      <header className="om__head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span className="eyebrow"><img src={iconUrl('shopping-cart')} alt="" width={20} height={20} />My cart</span>
        <h1>Your <em>cart.</em></h1>
        <p className="muted">Order before your cut-off and it comes on your next delivery day. Pay cash at your door.</p>
      </header>
      {editing && items.length > 0 && (
        <div className="om__editing">
          <span><b>Adding to order {editing}.</b> Put these items into that order, or check them out as a new one.</span>
          <div className="btn-row">
            <button className="btn btn--sm btn--blue" type="button" disabled={busy} onClick={addToOrder}>Add to order {editing}</button>
            <button className="btn btn--sm btn--ghost" type="button" onClick={() => setEditing(null)}>New order instead</button>
          </div>
        </div>
      )}
      {err && <p className="form__note">{err}</p>}
      <div className="om__grid">
        <section className="om__card" aria-label="Items in your cart">
          {!ready ? null : items.length === 0 ? (
            <Empty title="Your cart is empty." text="Find something good in the shop: raw milk, butter, eggs, grass-fed meat and more."><Link className="btn" href="/shop">Go to the shop <Arrow /></Link></Empty>
          ) : (
            <>
              <div className="om__cardhead"><h2>{count(items)} item{count(items) === 1 ? '' : 's'}</h2><button className="linkbtn" type="button" onClick={clear}>Empty cart</button></div>
              <Lines items={items} onQty={setQty} onRemove={remove} />
            </>
          )}
        </section>
        <aside className="om__sum">
          <Summary items={items}>
            {items.length ? <Link className="btn btn--wide" href="/checkout">Check out <Arrow /></Link> : <span className="btn btn--wide is-disabled" aria-disabled="true">Check out</span>}
            <Link className="om__keep" href="/shop">Keep shopping</Link>
          </Summary>
        </aside>
      </div>
    </div>
  )
}
