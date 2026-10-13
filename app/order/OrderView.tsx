'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/components/cart'
import { Arrow, Check } from '@/components/icons'
import { Chip, Details, Empty, Lines, ordersApi, Preview, Steps, Summary, Tracker, TypeChip, orderNo } from '@/components/orders'
import { useAuth } from '@/components/auth'
import { count } from '@/lib/format'
import type { Order } from '@/lib/types'

export default function OrderView() {
  const sp = useSearchParams()
  const id = sp.get('id')
  const fresh = sp.get('new') === '1'
  const router = useRouter()
  const { add } = useCart()
  const [o, setO] = useState<Order | null | undefined>(undefined)
  const { member } = useAuth()

  useEffect(() => {
    (async () => setO(id ? await ordersApi.get(id) : (await ordersApi.list(1)).orders[0] ?? null))()
  }, [id])

  if (o === undefined) return <div className="om"><Preview /><p className="muted" style={{ padding: 40 }}>Loading your order…</p></div>
  if (o === null) return <div className="om"><Preview /><div className="om__card"><Empty title="No order to show." text="Once you check out, your order appears here."><Link className="btn" href="/shop">Go to the shop <Arrow /></Link></Empty></div></div>

  const first = member?.firstName ?? ''
  const isFresh = fresh && o.status === 'open'
  return (
    <div className="om">
      <Preview />
      <Steps at={2} />
      <header className={`om__head${isFresh ? ' om__head--yay' : ''}`}>
        {isFresh && <span className="om__yay"><Check /></span>}
        <span className="eyebrow">Order #{orderNo(o)}{o.sample ? ' · sample' : ''}</span>
        <h1>{isFresh ? <>Thank you{first ? `, ${first}` : ''}! <em>It&apos;s in.</em></> : <>Order <em>#{orderNo(o)}.</em></>}</h1>
        <p className="muted">{isFresh ? `We have your order${o.deliveryDay ? ` for ${o.deliveryDay}` : ''}${o.recurring ? ', and it repeats every delivery day' : ''}. You can still change it until your zone's cut-off.` : `Placed ${o.placed}.`}</p>
      </header>
      <Tracker s={o.status} />
      <div className="om__grid">
        <section className="om__card">
          <div className="om__cardhead"><h2>{count(o.items)} item{count(o.items) === 1 ? '' : 's'}</h2><span className="om__chips"><TypeChip recurring={o.recurring} /><Chip s={o.status} /></span></div>
          <Lines items={o.items} />
        </section>
        <aside className="om__sum">
          <Summary items={o.items} fee={o.deliveryFee}>
            <Details o={o} />
            {o.editable
              ? <Link className="btn btn--wide" href={`/edit-order?id=${encodeURIComponent(o.id)}`}>View &amp; edit order <Arrow /></Link>
              : <button className="btn btn--wide" type="button" onClick={() => { add(o.items); router.push('/shop-cart') }}>Order these again <Arrow /></button>}
            <Link className="om__keep" href="/order-history">All my orders</Link>
          </Summary>
        </aside>
      </div>
    </div>
  )
}
