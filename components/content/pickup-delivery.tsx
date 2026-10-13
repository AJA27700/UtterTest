// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

// Delivery day, window, order status, changes, returns and pickup. Shown on the Where We Deliver page
// (Pickup & Delivery was merged into it; /pickup-delivery redirects there).
export default function PickupDelivery() {
  return (
    <>
      <section className="section section--tight" id="delivery-day" aria-labelledby="day-title">
        <div className="container split split--top">
          <div>
            <h2 id="day-title" data-reveal="" style={{ fontSize: 'clamp(2.2rem,4.6vw,3.6rem)', marginBottom: '22px' }}>
              Your <em>delivery day.</em>
            </h2>
            <ol className="steps" data-stagger="">
              <li data-reveal="">
                <span>
                  <b>Find your day and cut-off</b>
                  <span>Log in and open the Delivery Day tab. It shows your delivery day and the date your order needs to be in.</span>
                </span>
              </li>
              <li data-reveal="">
                <span>
                  <b>Put out a cooler</b>
                  <span>
                    We don&apos;t give exact delivery times. If you&apos;ll be out, leave a cooler with ice by the door. An 11-quart cooler
                    fits most orders.
                  </span>
                </span>
              </li>
              <li data-reveal="">
                <span>
                  <b>Leave your cash inside</b>
                  <span>Payment is cash on delivery. We don&apos;t take cards or checks.</span>
                </span>
              </li>
              <li data-reveal="">
                <span>
                  <b>Look for us between 11am and midnight</b>
                  <span>
                    If we can&apos;t make your regular day, we&apos;ll deliver the next day and let you know by email. Want a rough window?
                    Email us and we&apos;ll tell you.
                  </span>
                </span>
              </li>
            </ol>
          </div>
          <div>
            <div className="window" data-reveal="">
              <span className="label">Delivery window</span>
              <h3 style={{ fontSize: 'clamp(26px,2.8vw,34px)', margin: '8px 0 18px' }}>
                11am <em>to midnight</em>
              </h3>
              <div className="window__bar">
                <div className="window__late" />
              </div>
              <div className="window__ends">
                <span>
                  <img src="/assets/icons/sun.webp" alt="" width="30" height="30" />
                  11am
                </span>
                <span>
                  midnight
                  <img src="/assets/icons/crescent-moon.webp" alt="" width="30" height="30" />
                </span>
              </div>
              <p className="window__note">
                About <b>1 in 10</b> orders arrive after 10pm.
              </p>
            </div>
            <div className="callout" data-reveal="" style={{ marginTop: '14px' }}>
              <img src="/assets/icons/alarm-clock.webp" alt="" width="48" height="48" loading="lazy" />
              <div>
                <b>Why so late?</b>
                <p>
                  We try to deliver your milk 12–24 hours after milking. The late-night stops are the price of that freshness, and most
                  members think it&apos;s worth it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--tight" aria-labelledby="status-title">
        <div className="container">
          <div className="head head--center">
            <span className="eyebrow" data-reveal="">
              <img src="/assets/icons/clipboard.webp" alt="" width="20" height="20" />
              Order status
            </span>
            <h2 id="status-title" data-reveal="" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)' }}>
              Open, closed
              <br />
              <em>or confirmed?</em>
            </h2>
          </div>
          <div className="status-row" data-stagger="">
            <div className="status" data-reveal="">
              <span className="tag tag--grass">Open</span>
              <p>We have your order, and you can still change it.</p>
            </div>
            <div className="status" data-reveal="">
              <span className="tag tag--raw">Closed</span>
              <p>Your order is locked in and can&apos;t be changed. It will come on your delivery day.</p>
            </div>
            <div className="status" data-reveal="">
              <span className="tag tag--a2">Confirmed</span>
              <p>Same as closed. You&apos;ll get a confirmation email, and it&apos;s on the truck for your day.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--tight" aria-labelledby="change-title">
        <div className="container split split--top">
          <div className="panel" data-reveal="">
            <img src="/assets/icons/spiral-calendar.webp" alt="" width="72" height="72" loading="lazy" style={{ marginBottom: '14px' }} />
            <h3 id="change-title">Changing or canceling</h3>
            <p>
              Cancel before you get your confirmation email. To cancel, log in, open My Cart, and delete your items one by one until the
              cart is empty.
            </p>
            <p>
              If that doesn&apos;t work, email the cancellation to <a href="mailto:info@uddermilk.com">info@uddermilk.com</a> with your full
              name, address and the name of your zone.
            </p>
            <div className="callout callout--clover" style={{ marginTop: '18px' }}>
              <img src="/assets/icons/balance-scale.webp" alt="" width="48" height="48" loading="lazy" />
              <div>
                <b>Missed deliveries</b>
                <p>
                  If we don&apos;t get a cancellation before cut-off, nobody&apos;s home and there&apos;s no cooler with payment, or the
                  driver can&apos;t get into your building, you&apos;ll be charged 50% of the undelivered order on your next order.
                </p>
              </div>
            </div>
          </div>
          <div className="panel" data-reveal="">
            <img src="/assets/icons/package.webp" alt="" width="72" height="72" loading="lazy" style={{ marginBottom: '14px' }} />
            <h3>Returns</h3>
            <ol className="steps" style={{ marginTop: '16px' }}>
              <li>
                <span>
                  <b>Email us about the item</b>
                  <span>Tell us what&apos;s wrong. We want to know.</span>
                </span>
              </li>
              <li>
                <span>
                  <b>Keep it cold</b>
                  <span>Refrigerate it if it needs the fridge, freeze it if it needs the freezer.</span>
                </span>
              </li>
              <li>
                <span>
                  <b>Hand it to your driver next week</b>
                  <span>You&apos;ll get credit on the spot. Drivers can&apos;t give credit without the item.</span>
                </span>
              </li>
            </ol>
            <p style={{ marginTop: '16px' }}>
              Something missing, or need to swap an item? Reorder it and subtract it from your next order&apos;s total. You can also email
              us for a refund by Venmo or Zelle.
            </p>
          </div>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container">
          <div className="band" data-reveal="scale" style={{ gridTemplateColumns: '1fr auto' }}>
            <div>
              <h2>
                Picking up <em>instead?</em>
              </h2>
              <p>
                Pickup spots and times are listed in your account. If your pickup order is under the minimum, just add the $15 minimum order
                adjuster.
              </p>
              <div className="btn-row" style={{ marginTop: '26px' }}>
                <Link className="btn btn--butter" href="/category/minimum-order-adjuster-pick-up-only">
                  Minimum order adjuster{' '}
                  <svg
                    className="arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>{' '}
                <Link className="btn btn--milk" href="/faq">
                  More questions? FAQ
                </Link>
              </div>
            </div>
            <div className="band__img">
              <img src="/assets/icons/basket.webp" alt="" width="180" height="180" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
