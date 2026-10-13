'use client'
// Order history (new site: /orders): every order, 10 a page.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { OrdersTable, Pager } from '@/components/account'
import { Empty, ordersApi, Preview, type OrderPage } from '@/components/orders'
import { Arrow } from '@/components/icons'

export default function HistoryView() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<OrderPage | null>(null)
  useEffect(() => { ordersApi.list(page).then(setData) }, [page])
  return (
    <>
      <Preview />
      <header className="acct__head"><h1>Order <em>history.</em></h1></header>
      <section className="om__card ohist" aria-label="All orders">
        {data === null ? <p className="muted">Loading your orders…</p> : data.total === 0 ? (
          <Empty title="You haven't placed any orders yet." text="When you place an order, it shows up here."><Link className="btn" href="/shop">Shop now <Arrow /></Link></Empty>
        ) : (
          <>
            <OrdersTable orders={data.orders} />
            <Pager page={data.page} pages={data.pages} total={data.total} onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
          </>
        )}
      </section>
    </>
  )
}
