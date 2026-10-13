'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useCart } from './cart'
import { useAuth } from './auth'
import { count } from '@/lib/format'
import { Bag, Chevron, Mail, Phone, User } from './icons'

// Articles, Recipes, News and FAQ live in the footer ("Learn").
export const TABS: [string, string][] = [
  ['/', 'Home'], ['/shop', 'Shop'], ['/about-us', 'About Us'], ['/videos', 'Videos'],
  ['/where-we-deliver', 'Where We Deliver'], ['/contact-us', 'Contact Us'], // includes Pickup & Delivery
]

function activeTab(path: string) {
  if (path === '/') return '/'
  if (path.startsWith('/shop-cart') || path.startsWith('/checkout')) return 'cart'
  if (path.startsWith('/order') || path.startsWith('/edit-order') || path.startsWith('/account')) return 'orders'
  if (path.startsWith('/shop') || path.startsWith('/category') || path.startsWith('/sub-category') || path.startsWith('/products/')) return '/shop'
  return TABS.find(([href]) => href !== '/' && path.startsWith(href))?.[0] ?? ''
}

export default function Header() {
  const path = usePathname()
  const cur = activeTab(path)
  const { items, ready } = useCart()
  const { member, logout } = useAuth()
  const n = ready ? count(items) : 0
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLElement>(null)
  const [bump, setBump] = useState(false)
  const prevN = useRef(n)

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu after navigating
  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    const grew = n > prevN.current
    prevN.current = n
    if (grew) { setBump(true); const t = setTimeout(() => setBump(false), 600); return () => clearTimeout(t) }
  }, [n])
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node) && !(e.target as Element).closest('[data-menu]')) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('click', onDoc); document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  const label = TABS.find(([h]) => h === cur)?.[1] ?? (cur === 'cart' ? 'Cart' : cur === 'orders' ? 'My orders' : 'All pages')

  return (
    <>
      <div className="topstrip">
        <div className="topstrip__inner">
          <div className="topstrip__contact">
            <a href="tel:+19734139585"><Phone /><span className="hide-sm">Call or text&nbsp;</span>973-413-9585</a>
            <a className="hide-md" href="mailto:info@uddermilk.com"><Mail />info@uddermilk.com</a>
          </div>
          <nav className="topstrip__acct" aria-label="Account">
            <Link href={member ? '/account' : '/order-history'} aria-current={cur === 'orders' ? 'page' : undefined}><Bag />My orders</Link>
            {member ? (
              <>
                <Link className="topstrip__hi" href="/account"><User />Hi, {member.firstName}</Link>
                <button className="topstrip__out" type="button" onClick={() => logout()}>Log out</button>
              </>
            ) : (
              <>
                <Link href="/login"><User />Log in</Link>
                <Link className="topstrip__signup" href="/signup">Sign up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
      <div className="mainbar">
        <div className="mainbar__brand">
          <Link className="brand brand--logo" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/logo-udder-milk-hq-630.webp" alt="Udder Milk, satisfying customers since 2005" width={630} height={426} />
          </Link>
          <button className="menubtn" type="button" style={{ display: 'none' }} data-menu aria-expanded={open} aria-controls="mmenu" onClick={() => setOpen((o) => !o)}>
            <span className="menubtn__icon" aria-hidden="true"><i></i><i></i><i></i></span>
            <span className="menubtn__txt"><small>Menu</small><b>{label}</b></span>
            <Chevron className="menubtn__chev" />
          </button>
          <nav className="mmenu" id="mmenu" aria-label="Main" hidden={!open} ref={menuRef}>
            <ul>
              {TABS.map(([href, text]) => (
                <li key={href}><Link href={href} aria-current={cur === href ? 'page' : undefined}>{text}</Link></li>
              ))}
            </ul>
            <div className="mmenu__extra">
              <Link href="/shop-cart"><Bag />Cart</Link>
              <Link href={member ? '/account' : '/order-history'}><Bag />{member ? 'My account' : 'My orders'}</Link>
            </div>
          </nav>
        </div>
        <nav className="tabs" aria-label="Main">
          <ul>
            {TABS.map(([href, text]) => (
              <li key={href}><Link href={href} aria-current={cur === href ? 'page' : undefined}>{text}</Link></li>
            ))}
          </ul>
        </nav>
        <Link className={`cartbtn${bump ? ' is-bump' : ''}`} href="/shop-cart" aria-current={cur === 'cart' ? 'page' : undefined} aria-label="Cart">
          <Bag /><span className="cartbtn__label">Cart</span><b className="cartbtn__n" hidden={!n}>{n}</b>
        </Link>
      </div>
    </>
  )
}
