'use client'
// Order dashboard (new site: /dashboard): welcome, zone / cut-off / delivery day, active and recurring orders.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth'
import { OrdersTable, ZoneCards } from '@/components/account'
import { Empty, ordersApi, Preview } from '@/components/orders'
import { Arrow } from '@/components/icons'
import type { Order } from '@/lib/types'

const active = (o: Order) => ['open', 'confirmed', 'out', 'closed'].includes(o.status) || (o.recurring && o.status !== 'canceled')

export default function DashboardView() {
  const { member } = useAuth()
  const [orders, setOrders] = useState<Order[] | null>(null)
  useEffect(() => { ordersApi.list(1).then((p) => setOrders(p.orders.filter(active))) }, [])
  if (!member) return null
  return (
    <>
      <Preview />
      <header className="acct__head">
        <h1>Hi {member.firstName}! <em>Welcome back.</em></h1>
      </header>
      <ZoneCards m={member} />
      <section className="om__card ohist" aria-labelledby="active-title">
        <div className="om__cardhead">
          <div>
            <small className="acct__kicker">Recurring and one-time orders</small>
            <h2 id="active-title">My active &amp; recurring orders</h2>
            <p className="muted acct__sub">Track status and open any order for full details.</p>
          </div>
          <Link className="btn btn--sm btn--ghost" href="/order-history">All orders <Arrow /></Link>
        </div>
        {orders === null ? <p className="muted">Loading your orders…</p> : orders.length ? <OrdersTable orders={orders} /> : (
          <Empty title="You haven't placed any orders yet." text="When you place an order, it shows up here so you can check its status and details at a glance.">
            <Link className="btn" href="/shop">Shop now <Arrow /></Link>
          </Empty>
        )}
      </section>
    </>
  )
}
