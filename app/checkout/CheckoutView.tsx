'use client'
// Checkout, laid out like the new site (front.uddermilk.com/checkout):
// left "Your Items" (product, price × qty, subtotal, delivery fee, total); right "Order Preferences".
// Delivery days, fee, minimum and pickup locations come from the member's zone (GET /api/order/conditions).
// The server re-prices the order from the catalogue and re-checks the minimum; the browser only sends items + choices.
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/components/cart'
import { useAuth } from '@/components/auth'
import { Arrow } from '@/components/icons'
import { Empty, ItemImg, ordersApi, Preview, Steps, toLines } from '@/components/orders'
import OrderPreferences, { checkPrefs, type PrefErrors, type Prefs } from '@/components/OrderPreferences'
import { count, formatAddress, iconUrl, money, sum } from '@/lib/format'
import type { CheckoutConditions } from '@/lib/types'

export default function CheckoutView() {
  const { items, ready, clear, setEditing } = useCart()
  const { member } = useAuth()
  const router = useRouter()
  const [c, setC] = useState<CheckoutConditions | null | undefined>(undefined)
  const [p, setP] = useState<Prefs>({ recurring: false, method: 'delivery', deliveryDay: '', pickupLocationId: '', note: '' })
  const [errors, setErrors] = useState<PrefErrors>({})
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ordersApi.conditions().then((x) => {
      setC(x)
      // start on the member's delivery day (set in My Address), or the zone's only day
      const days = x?.zone?.deliveryDays ?? []
      const mine = member?.deliveryDay && days.includes(member.deliveryDay) ? member.deliveryDay : days.length === 1 ? days[0] : ''
      if (mine) setP((v) => ({ ...v, deliveryDay: v.deliveryDay || mine }))
    })
  }, [member?.deliveryDay])

  const subtotal = sum(items)
  const fee = p.method === 'pickup' ? 0 : c?.deliveryFee ?? 0
  const min = c?.zone?.minimumTotal ?? 0
  const short = Math.max(0, min - subtotal)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = checkPrefs(p)
    setErrors(errs)
    if (Object.keys(errs).length) return
    if (short > 0) { setMsg(`Minimum order price is ${money(min)}. Add ${money(short)} more to your cart to meet it.`); return }
    setBusy(true); setMsg('')
    try {
      const o = await ordersApi.create({ items: toLines(items), method: p.method, deliveryDay: p.method === 'delivery' ? p.deliveryDay : undefined, pickupLocationId: p.method === 'pickup' ? p.pickupLocationId : undefined, recurring: p.recurring, note: p.note.trim() })
      clear(); setEditing(null)
      router.push(`/order?id=${encodeURIComponent(o.id)}&new=1`)
    } catch (err) { setMsg((err as Error).message); setBusy(false) }
  }

  if (ready && !items.length) {
    return <div className="om"><Preview /><Steps at={1} /><div className="om__card" style={{ marginTop: 26 }}><Empty title="Nothing to check out yet." text="Your cart is empty. Add a few things from the shop first."><Link className="btn" href="/shop">Go to the shop <Arrow /></Link></Empty></div></div>
  }

  return (
    <div className="om">
      <Preview />
      <Steps at={1} />
      <header className="om__head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span className="eyebrow"><img src={iconUrl('delivery-truck')} alt="" width={20} height={20} />Check out</span>
        <h1>Almost <em>there.</em></h1>
        <p className="muted">Carefully check your items and preferences before placing your order. Payment is cash on delivery.</p>
      </header>
      <div className="om__grid co">
        <section className="om__card co__items" aria-labelledby="co-items">
          <div className="om__cardhead">
            <h2 id="co-items">Your items</h2>
            <Link className="btn btn--sm btn--ghost" href="/shop-cart">Go to cart</Link>
          </div>
          <table className="cotable">
            <thead><tr><th scope="col"><span className="sr-only">Photo</span></th><th scope="col">Product</th><th scope="col" className="num">Price × Qty</th><th scope="col" className="num">Subtotal</th></tr></thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.key}>
                  <td className="cotable__img"><ItemImg it={it} /></td>
                  <td><Link href={it.url} className="cotable__name">{it.name}</Link><small>{it.variant}</small></td>
                  <td className="num" data-label="Price × Qty">{money(it.price)} × {it.qty}</td>
                  <td className="num" data-label="Subtotal"><b>{money(it.price * it.qty)}</b></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><th scope="row" colSpan={3}>Items ({count(items)})</th><td className="num">{money(subtotal)}</td></tr>
              <tr><th scope="row" colSpan={3}>Delivery fee</th><td className="num">{p.method === 'pickup' ? 'Pickup' : c === undefined ? '…' : fee ? money(fee) : 'Free'}</td></tr>
              <tr className="cotable__total"><th scope="row" colSpan={3}>Total, cash on delivery</th><td className="num">{money(subtotal + fee)}</td></tr>
            </tfoot>
          </table>
          {min > 0 && (
            <div className={`comin${short > 0 ? '' : ' is-met'}`} role="status">
              <div className="comin__bar"><span style={{ width: `${Math.min(100, (subtotal / min) * 100)}%` }} /></div>
              <p>{short > 0 ? <>Your zone has a <b>{money(min)}</b> minimum. Add <b>{money(short)}</b> more to check out. <Link href="/shop">Keep shopping</Link></> : <>You&apos;ve reached your zone&apos;s {money(min)} minimum.</>}</p>
            </div>
          )}
          {member && p.method === 'delivery' && (
            member.address
              ? <p className="co__addr">Delivering to <b>{formatAddress(member.address)}</b>. <Link href="/account/address">Change address</Link></p>
              : <p className="co__addr">No delivery address on your account yet. <Link href="/account/address">Add your address</Link></p>
          )}
        </section>

        <aside className="om__sum">
          <form className="sum co__prefs form" onSubmit={submit} noValidate>
            <h2>Order <em>preferences</em></h2>
            {c === undefined ? <p className="muted">Loading your delivery options…</p> : (
              <OrderPreferences c={c} p={p} onChange={(v) => { setP(v); setMsg(''); setErrors({}) }} errors={errors} />
            )}
            {msg && <p className="form__note" role="alert">{msg}</p>}
            <button className="btn btn--wide" type="submit" disabled={busy || c === undefined}>{busy ? 'Placing your order…' : <>Place order · {money(subtotal + fee)} <Arrow /></>}</button>
            <p className="om__fine">You can change your order until your zone&apos;s cut-off. If no one&apos;s home and there&apos;s no cooler with payment, 50% of the order is added to your next one. <Link href="/where-we-deliver#delivery-day">Delivery details</Link></p>
          </form>
        </aside>
      </div>
    </div>
  )
}
