'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/components/cart'
import { Arrow, Check } from '@/components/icons'
import { Chip, Details, Empty, Lines, ordersApi, Preview, STATUS, Summary, Tabs, toLines, Tracker, TypeChip, orderNo } from '@/components/orders'
import OrderPreferences, { checkPrefs, type PrefErrors, type Prefs } from '@/components/OrderPreferences'
import { count } from '@/lib/format'
import type { CheckoutConditions, Order } from '@/lib/types'

const prefsOf = (o: Order): Prefs => ({ recurring: o.recurring, method: o.method, deliveryDay: o.deliveryDay ?? '', pickupLocationId: o.pickupLocation?.id ?? '', note: o.note })

export default function EditView() {
  const sp = useSearchParams()
  const id = sp.get('id')
  const router = useRouter()
  const { add, setEditing } = useCart()
  const [saved, setSaved] = useState<Order | null | undefined>(undefined)
  const [draft, setDraft] = useState<Order | null>(null)
  const [msg, setMsg] = useState(sp.get('added') ? 'Added. The new items are in your order.' : '')
  const [armed, setArmed] = useState(false)
  const [c, setC] = useState<CheckoutConditions | null>(null)
  const [p, setP] = useState<Prefs | null>(null)
  const [errors, setErrors] = useState<PrefErrors>({})

  useEffect(() => {
    (async () => {
      const o = id ? await ordersApi.get(id) : (await ordersApi.list(1)).orders.find((x) => !!x.editable) ?? null
      setSaved(o); setDraft(o ? structuredClone(o) : null)
      if (o) setP(prefsOf(o))
      setC(await ordersApi.conditions())
    })()
  }, [id])
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 5000); return () => clearTimeout(t) }, [armed])

  if (saved === undefined) return <div className="om"><Preview /><p className="muted" style={{ padding: 40 }}>Loading your order…</p></div>
  if (!saved || !draft) return <div className="om"><Preview /><Tabs /><div className="om__card"><Empty title="No open order to edit." text="Open orders show up here. Find one in your order history."><Link className="btn" href="/order-history">Order history <Arrow /></Link></Empty></div></div>

  const editable = !!saved.editable
  const setItems = (items: Order['items']) => setDraft({ ...draft, items })

  async function save() {
    if (draft!.items.length) {
      const errs = checkPrefs(p!)
      setErrors(errs)
      if (Object.keys(errs).length) return
    }
    try {
      const o = await ordersApi.update(draft!.id, { items: toLines(draft!.items), method: p!.method, deliveryDay: p!.deliveryDay || undefined, pickupLocationId: p!.pickupLocationId || undefined, recurring: p!.recurring, note: p!.note })
      setSaved(o); setDraft(structuredClone(o)); setP(prefsOf(o))
      setMsg(o.status === 'canceled' ? 'Every item was removed, so the order is canceled.' : 'Saved. Your order is updated.')
    } catch (e) { setMsg((e as Error).message) }
  }
  async function cancel() {
    if (!armed) { setArmed(true); return }
    const o = await ordersApi.update(draft!.id, { status: 'canceled' })
    setSaved(o); setDraft(structuredClone(o)); setArmed(false); setMsg('Your order is canceled.')
  }

  return (
    <div className="om">
      <Preview />
      <Tabs />
      <header className="om__head">
        <span className="eyebrow">Order #{orderNo(draft)}{draft.sample ? ' · sample' : ''}</span>
        <h1>{editable ? <>View &amp; <em>edit.</em></> : <>Order <em>#{orderNo(draft)}.</em></>}</h1>
        <p className="muted">{editable ? "Change quantities, remove items, add more, or change your delivery settings. Changes are possible until your zone's cut-off." : `This order is ${STATUS[saved.status][0].toLowerCase()}, so it can't be changed online. To change it, call or text 973-413-9585 or email info@uddermilk.com.`}</p>
      </header>
      <Tracker s={saved.status} />
      {msg && <p className="om__msg" role="status">{msg}</p>}
      <div className="om__grid">
        <section className="om__card">
          <div className="om__cardhead"><h2>{draft.items.length ? `${count(draft.items)} item${count(draft.items) === 1 ? '' : 's'}` : 'No items'}</h2><span className="om__chips"><TypeChip recurring={saved.recurring} /><Chip s={saved.status} /></span></div>
          {draft.items.length
            ? <Lines items={draft.items} {...(editable ? { onQty: (k: string, q: number) => setItems(draft.items.map((x) => x.key === k ? { ...x, qty: Math.max(1, Math.min(99, q)) } : x)), onRemove: (k: string) => setItems(draft.items.filter((x) => x.key !== k)) } : {})} />
            : <p className="muted om__none">Every item is removed. Save to cancel this order, or add more items.</p>}
          {editable && (
            <>
              <div className="om__addmore"><button className="btn btn--sm btn--ghost" type="button" onClick={() => { setEditing(draft.id); router.push('/shop') }}>+ Add more items</button></div>
              <div className="om__editfs form">
                <h3>Order settings</h3>
                {p && <OrderPreferences c={c} p={p} onChange={(v) => { setP(v); setErrors({}) }} errors={errors} />}
              </div>
            </>
          )}
        </section>
        <aside className="om__sum">
          <Summary items={draft.items} fee={p?.method === 'pickup' ? 0 : saved.method === 'pickup' ? c?.deliveryFee ?? 0 : saved.deliveryFee}>
            <Details o={draft} />
            {editable ? (
              <>
                <button className="btn btn--wide" type="button" onClick={save}>Save changes <Check /></button>
                <button className="btn btn--wide btn--ghost om__cancel" type="button" onClick={cancel}>{armed ? 'Tap again to cancel the order' : 'Cancel this order'}</button>
              </>
            ) : <button className="btn btn--wide" type="button" onClick={() => { add(draft.items); router.push('/shop-cart') }}>Order these again <Arrow /></button>}
            <Link className="om__keep" href="/order-history">Back to my orders</Link>
          </Summary>
        </aside>
      </div>
    </div>
  )
}
