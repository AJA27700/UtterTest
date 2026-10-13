// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function TermsServices() {
  return (
    <>
      <section className="page-hero" aria-labelledby="tos-title">
        <div className="page-hero__inner">
          <span className="eyebrow">
            <img src="/assets/icons/page-facing-up.webp" alt="" width="20" height="20" />
            Terms of service
          </span>
          <h1 id="tos-title">
            The rules of
            <br />
            <em>the association.</em>
          </h1>
          <p className="lede">Last updated September 28, 2026</p>
        </div>
      </section>
      <section className="section section--tight" style={{ paddingTop: '0' }}>
        <div className="container narrow">
          <div className="editor-note">
            <img src="/assets/icons/memo.webp" alt="" width="34" height="34" />
            <div>
              <b>Draft for review. Remove this note before publishing.</b>
              The old site&apos;s terms page was blank. This draft is assembled from the rules already published in the FAQ and delivery
              pages. Please have it reviewed before it goes live.
            </div>
          </div>
          <div className="prose">
            <h2>1. A private members&apos; association</h2>
            <p>
              Udder Milk Creamery Association is a private members&apos; association. When you sign up and accept these terms, you become a
              member.
            </p>
            <h2>2. Your account</h2>
            <p>
              Please give us accurate contact and delivery details and keep your password to yourself. You&apos;re responsible for orders
              placed from your account.
            </p>
            <h2>3. Ordering</h2>
            <ul>
              <li>Place your order before the cut-off date shown under the Delivery Day tab.</li>
              <li>
                While an order is <b>Open</b>, you can change it. Once it&apos;s <b>Closed</b> or <b>Confirmed</b>, it&apos;s locked in for
                your delivery day.
              </li>
              <li>
                Farm supply changes with the seasons. When Guernsey milk runs short, we substitute Jersey. Weights on meat are approximate.
              </li>
              <li>Prices can change. You pay the price shown when you order.</li>
            </ul>
            <h2>4. Payment</h2>
            <p>
              Payment is cash on delivery. We don&apos;t accept credit cards or checks, which is why checkout doesn&apos;t ask for them.
            </p>
            <h2>5. Delivery</h2>
            <p>
              We deliver between 11am and midnight on your delivery day. We don&apos;t give exact times, so please leave a cooler with ice
              and your payment if you&apos;ll be out. If we can&apos;t make your usual day, we&apos;ll deliver the next day and email you.
            </p>
            <h2>6. Cancellations and missed deliveries</h2>
            <p>
              Cancel before you receive your confirmation email, either by emptying your cart or by emailing us with your full name, address
              and zone name. If we don&apos;t receive a cancellation, or it comes after cut-off, or no one is home and no cooler with
              payment is left, or our driver can&apos;t get into your building, 50% of the undelivered order is added to your next order.
            </p>
            <h2>7. Returns and credits</h2>
            <p>
              If an item isn&apos;t right, email us, keep it refrigerated or frozen as appropriate, and return it to your driver the
              following week for credit. Drivers can&apos;t give credit without the item. Missing items can be reordered and subtracted from
              your next order, or refunded by Venmo or Zelle.
            </p>
            <h2>8. Raw and unpasteurized foods</h2>
            <p>
              Many of our products are raw and unpasteurized. Keep them cold and use them while fresh. The CDC and FDA advise that pregnant
              women, young children, older adults and people with weakened immune systems avoid raw milk products. See our{' '}
              <Link href="/faq#products">FAQ</Link>.
            </p>
            <h2>9. Changes and contact</h2>
            <p>
              We may update these terms and will change the date above when we do. Questions? Email{' '}
              <a href="mailto:info@uddermilk.com">info@uddermilk.com</a> or call 973-413-9585.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
