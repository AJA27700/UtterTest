'use client'
// The member account area, laid out like the new site: a side menu (Order Dashboard, Order History,
// My Profile, My Address, Change Password) next to the page. On phones the menu becomes a grid of buttons.
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './auth'
import { Chip, orderCount, orderNo, orderTotal, TypeChip } from './orders'
import { fmtDate, iconUrl, money } from '@/lib/format'
import type { Member, Order } from '@/lib/types'
import { useCart } from './cart'

const NAV: [string, string, string][] = [
  ['/account', 'Order dashboard', 'house-with-garden'],
  ['/order-history', 'Order history', 'clipboard'],
  ['/account/profile', 'My profile', 'identification-card'],
  ['/account/address', 'My address & delivery', 'round-pushpin'],
  ['/account/password', 'Change password', 'key'],
]

export function AccountShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const { logout } = useAuth()
  const router = useRouter()
  return (
    <div className="acct">
      <nav className="acct__nav" aria-label="My account">
        {NAV.map(([href, label, icon]) => (
          <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconUrl(icon)} alt="" width={26} height={26} />
            <span>{label}</span>
          </Link>
        ))}
        <button type="button" className="acct__out" onClick={async () => { await logout(); router.push('/') }}>Log out</button>
      </nav>
      <div className="acct__main">{children}</div>
    </div>
  )
}

// My zone / Cut-off day / Delivery day. All three follow from the member's address.
export function ZoneCards({ m }: { m: Member }) {
  const z = m.zone
  if (!z) {
    return (
      <div className="zonecards zonecards--none" role="status">
        <p>
          <b>{m.address ? `We don't deliver to ${m.address.zip} yet.` : 'Add your delivery address to see your delivery day.'}</b>{' '}
          {m.address ? 'You can still order for pickup, or ' : ''}<Link href="/account/address">{m.address ? 'update your address' : 'Add address'}</Link>.
        </p>
      </div>
    )
  }
  return (
    <div className="zonecards">
      <div className="zonecard">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconUrl('round-pushpin')} alt="" width={36} height={36} />
        <div><small>My zone</small><b>{z.name}</b></div>
      </div>
      <div className="zonecard">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconUrl('alarm-clock')} alt="" width={36} height={36} />
        <div><small>Cut-off day</small><b>{z.cutOffDay}</b></div>
      </div>
      <div className="zonecard">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconUrl('delivery-truck')} alt="" width={36} height={36} />
        <div><small>Delivery day</small><b>{m.deliveryDay || z.deliveryDays[0]}</b></div>
      </div>
    </div>
  )
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  const { add } = useCart()
  const router = useRouter()
  return (
    <table className="otable">
      <thead><tr><th scope="col">Order no.</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col" className="num">Total</th><th scope="col">Order type</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
      <tbody>
        {orders.map((o) => {
          const view = `/order?id=${encodeURIComponent(o.id)}`
          const n = orderCount(o)
          return (
            <tr key={o.id}>
              <td data-label="Order no."><Link className="otable__id" href={view}>#{orderNo(o)}</Link>{o.sample && <span className="ocard__sample">sample</span>}</td>
              <td data-label="Date">{fmtDate(o.placed)}</td>
              <td data-label="Status"><Chip s={o.status} /></td>
              <td data-label="Total" className="num"><b>{money(orderTotal(o))}</b><small>{n} item{n === 1 ? '' : 's'}</small></td>
              <td data-label="Order type"><TypeChip recurring={o.recurring} /></td>
              <td className="otable__act">
                <Link className="btn btn--sm btn--ghost" href={view}>View</Link>
                {o.editable
                  ? <Link className="btn btn--sm" href={`/edit-order?id=${encodeURIComponent(o.id)}`}>Edit</Link>
                  : o.items.length > 0 && <button className="btn btn--sm" type="button" onClick={() => { add(o.items); router.push('/shop-cart') }}>Order again</button>}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export function Pager({ page, pages, total, per = 10, onPage }: { page: number; pages: number; total: number; per?: number; onPage: (p: number) => void }) {
  if (total === 0) return null
  const from = (page - 1) * per + 1, to = Math.min(total, page * per)
  const nums = [...new Set([1, page - 1, page, page + 1, pages].filter((n) => n >= 1 && n <= pages))].sort((a, b) => a - b)
  return (
    <nav className="pager" aria-label="Pages">
      <span className="pager__info">Showing {from} to {to} of {total} order{total === 1 ? '' : 's'}</span>
      {pages > 1 && (
        <span className="pager__btns">
          <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
          {nums.map((n, i) => (
            <span key={n}>
              {i > 0 && n - nums[i - 1] > 1 && <span className="pager__gap">…</span>}
              <button type="button" aria-current={n === page ? 'page' : undefined} onClick={() => onPage(n)}>{n}</button>
            </span>
          ))}
          <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
        </span>
      )}
    </nav>
  )
}

// A small form helper: POST JSON, show the answer.
export async function postJson(url: string, body: unknown) {
  const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}
