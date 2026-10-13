import Link from 'next/link'
import { getTopCategories } from '@/lib/api'
import { ArrowUp, Chat, Mail, Phone, Pin } from './icons'

export default async function Footer() {
  const top = await getTopCategories()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__intro">
            <Link className="brand brand--logo brand--foot" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/logo-udder-milk-hq-630.webp" alt="Udder Milk, satisfying customers since 2005" width={630} height={426} loading="lazy" />
            </Link>
            <p>A private members&apos; creamery association, satisfying customers since 2005. We bring raw, grass-fed dairy and good farm food from small Pennsylvania farms straight to your door.</p>
            <div className="footer__contact">
              <a href="tel:+19734139585"><Phone />973-413-9585 · call or text Moses</a>
              <a href="sms:+19739681391"><Chat />973-968-1391 · texts, Mon–Sat 11am–9pm</a>
              <a href="mailto:info@uddermilk.com"><Mail />info@uddermilk.com</a>
              <a href="https://maps.google.com/?q=2960+Nolo+Rd,+Penn+Run,+PA" rel="noopener"><Pin />2960 Nolo Rd, Penn Run, PA</a>
            </div>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              {top.slice(0, 7).map((c) => <li key={c.slug}><Link href={`/${c.path}`}>{c.title}</Link></li>)}
              <li><Link href="/shop">All {top.length} categories</Link></li>
            </ul>
          </div>
          <div>
            <h4>Information</h4>
            <ul>
              {[['/about-us', 'About Us'], ['/videos', 'Videos'], ['/where-we-deliver', 'Where We Deliver'], ['/where-we-deliver#delivery-day', 'Pickup & Delivery'], ['/contact-us', 'Contact Us']].map(([h, t]) => <li key={h}><Link href={h}>{t}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4>Learn</h4>
            <ul>
              {[['/articles', 'Articles'], ['/recipes', 'Recipes'], ['/news', 'News'], ['/faq', 'FAQ']].map(([h, t]) => <li key={h}><Link href={h}>{t}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4>Account</h4>
            <ul>
              <li><Link href="/shop-cart">Cart</Link></li>
              <li><Link href="/order-history">Order history</Link></li>
              <li><Link href="/login">Log in</Link></li>
              <li><Link href="/signup">Sign up</Link></li>
              <li><Link href="/forgot-password">Forgot password</Link></li>
            </ul>
          </div>
        </div>
        <div className="wordmark" aria-hidden="true">udder <em>milk</em></div>
        <div className="footer__base">
          <span>© 2026 Udder Milk Creamery Association</span>
          <nav aria-label="Legal"><Link href="/privacy-policy">Privacy</Link><Link href="/terms-services">Terms</Link><Link href="/faq">FAQ</Link></nav>
          <a className="to-top" href="#main">Back to top <ArrowUp /></a>
        </div>
      </div>
    </footer>
  )
}
