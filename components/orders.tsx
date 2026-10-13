'use client'
// Shared pieces for the cart and order pages.
import Link from 'next/link'
import { useState } from 'react'
import type { CartItem, CheckoutConditions, NewOrder, Order, OrderStatus } from '@/lib/types'

export type OrderPage = { orders: Order[]; total: number; page: number; pages: number }
export const orderNo = (o: Order) => o.number ?? o.id
export const orderTotal = (o: Order) => o.total ?? sum(o.items) + (o.deliveryFee ?? 0)
export const orderCount = (o: Order) => (o.items.length ? count(o.items) : o.itemCount ?? 0)
import { count, fmtDate, iconUrl, money, sum } from '@/lib/format'
import { Check, Leaf, Minus, Plus, Trash } from './icons'

export const STATUS: Record<OrderStatus, [string, string]> = {
  open: ['Open', 'You can still change it'], closed: ['Closed', 'Locked in for your delivery day'],
  confirmed: ['Confirmed', 'Packed for your delivery day'], out: ['Out for delivery', 'On the truck today'], delivered: ['Delivered', ''], canceled: ['Canceled', ''],
}

export type OrderPatch = Partial<NewOrder> & { status?: 'canceled' }
export const toLines = (items: CartItem[]) => items.map((i) => ({ key: i.key, qty: i.qty }))

// The order API. Today it's this app's own /api routes (mock backend); later the same routes forward to the real one.
export const ordersApi = {
  async list(page = 1): Promise<OrderPage> { const r = await fetch(`/api/orders?page=${page}`, { cache: 'no-store' }); return r.ok ? r.json() : { orders: [], total: 0, page: 1, pages: 1 } },
  async get(id: string): Promise<Order | null> { const r = await fetch(`/api/orders/${encodeURIComponent(id)}`, { cache: 'no-store' }); return r.ok ? r.json() : null },
  async conditions(): Promise<CheckoutConditions | null> { const r = await fetch('/api/order/conditions', { cache: 'no-store' }); return r.ok ? r.json() : null },
  async create(body: NewOrder) {
    const r = await fetch('/api/orders', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error || 'Something went wrong')
    return data as Order
  },
  async update(id: string, patch: OrderPatch) {
    const r = await fetch(`/api/orders/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(patch) })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error || 'Something went wrong')
    return data as Order
  },
}

export function Preview() {
  return <div className="om__preview" role="note"><Leaf /><span><b>Preview.</b> Orders go to a stand-in backend on this server. Nothing reaches Udder Milk yet.</span></div>
}

export function Steps({ at }: { at: 0 | 1 | 2 }) {
  return (
    <ol className="om__steps" aria-label="Ordering steps">
      {['Cart', 'Check out', 'Order placed'].map((s, i) => <li key={s} className={i === at ? 'is-on' : i < at ? 'is-done' : ''}><span>{i + 1}</span>{s}</li>)}
    </ol>
  )
}

export function Tabs({ here }: { here?: 'history' }) {
  return (
    <nav className="om__tabs" aria-label="Your account">
      <Link href="/account">My account</Link>
      <Link href="/order-history" aria-current={here === 'history' ? 'page' : undefined}>Order history</Link>
      <Link href="/shop-cart">Cart</Link>
    </nav>
  )
}

export function ItemImg({ it }: { it: CartItem }) {
  const [broken, setBroken] = useState(false)
  return it.img && !broken
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={it.img} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
    // eslint-disable-next-line @next/next/no-img-element
    : <img className="is-icon" src={iconUrl(it.icon)} alt="" loading="lazy" />
}

export function Lines({ items, onQty, onRemove }: { items: CartItem[]; onQty?: (key: string, q: number) => void; onRemove?: (key: string) => void }) {
  const editable = !!onQty
  return (
    <ul className="lines">
      {items.map((it) => (
        <li className="oline" key={it.key}>
          <Link className="line__img" href={it.url} tabIndex={-1} aria-hidden="true"><ItemImg it={it} /></Link>
          <div className="line__info">
            <Link className="line__name" href={it.url}>{it.name}</Link>
            <span className="line__var">{it.variant}</span>
            <span className="line__each">{money(it.price)} each</span>
          </div>
          {editable ? (
            <div className="line__ctl">
              <div className="qty qty--sm" role="group" aria-label={`Quantity of ${it.name}`}>
                <button type="button" aria-label="One fewer" onClick={() => onQty!(it.key, it.qty - 1)}><Minus /></button>
                <input type="number" min={1} max={99} value={it.qty} aria-label="Quantity" onChange={(e) => onQty!(it.key, parseInt(e.target.value) || 1)} />
                <button type="button" aria-label="One more" onClick={() => onQty!(it.key, it.qty + 1)}><Plus /></button>
              </div>
              <button className="line__rm" type="button" aria-label={`Remove ${it.name}`} onClick={() => onRemove!(it.key)}><Trash /><span>Remove</span></button>
            </div>
          ) : <span className="line__qty">× {it.qty}</span>}
          <b className="line__tot">{money(it.price * it.qty)}</b>
        </li>
      ))}
    </ul>
  )
}

export function Summary({ items, fee, children }: { items: CartItem[]; fee?: number; children?: React.ReactNode }) {
  return (
    <div className="sum">
      <h2>Order <em>summary</em></h2>
      <dl>
        <div><dt>Items ({count(items)})</dt><dd>{money(sum(items))}</dd></div>
        {fee != null && <div><dt>Delivery fee</dt><dd>{fee ? money(fee) : 'Free'}</dd></div>}
        <div><dt>Payment</dt><dd>Cash on delivery</dd></div>
      </dl>
      <div className="sum__total"><span>Cash due at your door</span><b>{money(sum(items) + (fee ?? 0))}</b></div>
      {children}
    </div>
  )
}

export function Chip({ s }: { s: OrderStatus }) {
  return <span className={`ostat ostat--${s}`}>{STATUS[s][0]}</span>
}

export function Tracker({ s }: { s: OrderStatus }) {
  if (s === 'canceled') return <div className="track track--x"><Chip s="canceled" /><span>This order was canceled.</span></div>
  const steps: OrderStatus[] = ['open', 'closed', 'confirmed', 'out', 'delivered']
  const at = steps.indexOf(s)
  return (
    <ol className="track">
      {steps.map((k, i) => (
        <li key={k} className={i < at ? 'is-done' : i === at ? 'is-on' : ''}>
          <i>{i < at ? <Check /> : i + 1}</i><b>{STATUS[k][0]}</b>{i === at && STATUS[k][1] && <small>{STATUS[k][1]}</small>}
        </li>
      ))}
    </ol>
  )
}

export function Details({ o }: { o: Order }) {
  return (
    <dl className="odet">
      <div><dt>Placed</dt><dd>{fmtDate(o.placed)}</dd></div>
      {o.method === 'pickup'
        ? <div><dt>Pickup</dt><dd>{o.pickupLocation?.title ?? 'At your pickup location'}</dd></div>
        : <div><dt>Delivery</dt><dd>{o.deliveryDay ? `${o.deliveryDay}, 11am to midnight` : "Your zone's delivery day"}</dd></div>}
      <div><dt>Order type</dt><dd>{o.recurring ? 'Recurring' : 'One time'}</dd></div>
      {o.note && <div><dt>Instructions</dt><dd>{o.note}</dd></div>}
      <div><dt>Payment</dt><dd>Cash on delivery</dd></div>
    </dl>
  )
}

export function TypeChip({ recurring }: { recurring: boolean }) {
  return <span className={`otype${recurring ? ' otype--rec' : ''}`}>{recurring ? 'Recurring' : 'Non-recurring'}</span>
}

export function Empty({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="om__empty">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={iconUrl('basket')} alt="" width={120} height={120} />
      <h2>{title}</h2><p className="muted">{text}</p><div className="btn-row">{children}</div>
    </div>
  )
}
