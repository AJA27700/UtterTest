// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Faq() {
  return (
    <>
      <section className="page-hero" aria-labelledby="faq-title">
        <div className="page-hero__inner">
          <span className="eyebrow">
            <img src="/assets/icons/speech-balloon.webp" alt="" width="20" height="20" />
            Questions &amp; answers
          </span>
          <h1 id="faq-title">
            Good
            <br />
            <em>questions.</em>
          </h1>
          <p className="lede">
            Everything about membership, ordering, delivery and returns. Can&apos;t find it here? <Link href="/contact-us">Ask us</Link>.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: '6px' }}>
            <a className="chip" href="#membership">
              <img src="/assets/icons/admission-tickets.webp" alt="" width="22" height="22" />
              Membership &amp; ordering
            </a>
            <a className="chip" href="#delivery">
              <img src="/assets/icons/delivery-truck.webp" alt="" width="22" height="22" />
              Delivery
            </a>
            <a className="chip" href="#products">
              <img src="/assets/icons/glass-of-milk.webp" alt="" width="22" height="22" />
              Products &amp; returns
            </a>
            <a className="chip" href="#account">
              <img src="/assets/icons/locked.webp" alt="" width="22" height="22" />
              Your account
            </a>
          </div>
        </div>
        <div className="float hide-sm" data-speed=".12" style={{ '--x': '7%', '--y': '32%', '--s': '118px' } as React.CSSProperties}>
          <img src="/assets/icons/speech-balloon.webp" alt="" width="118" height="118" />
        </div>
        <div
          className="float hide-sm"
          data-speed=".08"
          style={{ '--x': '84%', '--y': '28%', '--s': '120px', '--delay': '-2s' } as React.CSSProperties}
        >
          <img src="/assets/icons/brown-cow-face.webp" alt="" width="120" height="120" />
        </div>
      </section>
      <section className="section section--tight" style={{ paddingTop: '10px' }}>
        <div className="container narrow">
          <div className="faq-group" id="membership">
            <h2 data-reveal="">
              <img src="/assets/icons/admission-tickets.webp" alt="" width="52" height="52" loading="lazy" />
              Membership &amp; ordering
            </h2>
            <details className="qa" data-reveal="">
              <summary>
                What does “A&amp;E” mean?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  A&amp;E stands for Adam &amp; Eve: a time when everything was pure, including food and drink. You&apos;ll see it on our
                  shelves and in our product names. It&apos;s the standard we hold our farms to.
                </p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                How do I become a member?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  Sign up online with your name, email, phone and delivery address. Once your account is set up, you can order for your next
                  delivery day.
                </p>
                <p>
                  <Link href="/signup">Sign up</Link>
                </p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                Why don&apos;t you call your products organic?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  The USDA&apos;s organic certification office asked us to stop using the phrase “non-certified organic” on any product. Our
                  farms are small family farms that can&apos;t afford certification, but they don&apos;t use chemicals, fungicides,
                  herbicides, pesticides or hormones.
                </p>
                <p>
                  So we just call things what they are: milk, cheese, meat. Where a brand we carry <em>is</em> certified organic, we say so.
                </p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                How do I cancel an order?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <ol>
                  <li>Log in to your account.</li>
                  <li>
                    Open <b>My Cart</b>.
                  </li>
                  <li>Delete the items one by one until the cart is empty.</li>
                </ol>
                <p>
                  That&apos;s it, your order is canceled. Cancel before you get the confirmation email. If you have trouble, email{' '}
                  <a href="mailto:info@uddermilk.com">info@uddermilk.com</a> with your full name, address and zone name.
                </p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                What do Open, Closed and Confirmed mean?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  <b>Open</b> means we have your order and you can still change it. <b>Closed</b> or <b>Confirmed</b> means it&apos;s locked
                  in, and it will be delivered on your scheduled delivery day.
                </p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                I clicked Check Out and it never asked for a card. Is that an error?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  No. Payment is cash on delivery, and we don&apos;t accept cards or checks, so checkout doesn&apos;t ask for them. As soon
                  as you click Check Out, your order is scheduled for delivery.
                </p>
              </div>
            </details>
          </div>
          <div className="faq-group" id="delivery">
            <h2 data-reveal="">
              <img src="/assets/icons/delivery-truck.webp" alt="" width="52" height="52" loading="lazy" />
              Delivery
            </h2>
            <details className="qa" data-reveal="">
              <summary>
                When will my order arrive?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  Log in and open the <b>Delivery Day</b> tab. It shows your delivery day and the date orders need to be in by.
                </p>
                <ul>
                  <li>We deliver between 11am and midnight.</li>
                  <li>About 10% of members get their order after 10pm, depending on where they live.</li>
                  <li>We deliver late because we try to get your milk to you 12–24 hours after milking.</li>
                  <li>
                    We don&apos;t give exact times, so please leave a cooler out if you&apos;ll be away. You can email us for your general
                    window.
                  </li>
                </ul>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                What size cooler should I leave out?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>It depends on how much you order, but an 11-quart cooler with ice works for most orders. Put your cash inside.</p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                What if you can&apos;t deliver on my usual day?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>We&apos;ll deliver the next day instead, and we&apos;ll let you know by email.</p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                What happens if I miss a delivery?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  If we haven&apos;t received a cancellation, or it came after cut-off day, or no one is home and there&apos;s no cooler
                  with payment, or the driver can&apos;t get into your building (a locked lobby, for example), you&apos;ll be charged 50% of
                  the undelivered order on your next order.
                </p>
              </div>
            </details>
          </div>
          <div className="faq-group" id="products">
            <h2 data-reveal="">
              <img src="/assets/icons/glass-of-milk.webp" alt="" width="52" height="52" loading="lazy" />
              Products &amp; returns
            </h2>
            <details className="qa" data-reveal="">
              <summary>
                Why are some cuts of meat so often unavailable?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  We only sell grass-fed meat. Grass doesn&apos;t grow in winter, so at the end of summer the best cuts are frozen to carry
                  us through.
                </p>
                <p>
                  Grass-fed animals also take much longer to reach weight than grain-fed ones, so it can be a while before a farmer has
                  another cow, goat or lamb ready. The cuts sell out quickly.
                </p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                How do returns work?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <ol>
                  <li>Email us about the item.</li>
                  <li>If it needs the fridge, refrigerate it. If it needs the freezer, freeze it.</li>
                  <li>Give it back to your driver the following week and you&apos;ll get credit.</li>
                </ol>
                <p>
                  Drivers can&apos;t give credit without the item. If something was missing or you need to swap it, reorder it and subtract
                  it from your next order&apos;s total. You can also email us for a refund by Venmo or Zelle.
                </p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                How should I store cream and butter?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  Move cream into a glass jar as soon as it arrives. Set the jar in a bowl of ice water in the fridge, and top up the ice as
                  it melts. Sitting in near-freezing water, the cream keeps longer and won&apos;t sour as fast. Salted and unsalted butter
                  keep longer this way too.
                </p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                Is raw milk right for everyone?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  Raw milk isn&apos;t pasteurized, so keep it cold and use it while it&apos;s fresh. The CDC and FDA advise that pregnant
                  women, babies and young children, older adults and anyone with a weakened immune system avoid raw milk and raw-milk
                  products. If you&apos;re not sure, talk with your doctor first.
                </p>
              </div>
            </details>
          </div>
          <div className="faq-group" id="account">
            <h2 data-reveal="">
              <img src="/assets/icons/locked.webp" alt="" width="52" height="52" loading="lazy" />
              Your account
            </h2>
            <details className="qa" data-reveal="">
              <summary>
                I forgot my password. How do I log in?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  Use the <b>Forgot Password</b> link under the login box and we&apos;ll email you.{' '}
                  <Link href="/forgot-password">Reset your password</Link>
                </p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                I forgot which email I signed up with.
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <p>
                  You&apos;ll need to create a new account with a different email address. Use <b>Sign up</b> near the login box.
                </p>
              </div>
            </details>
            <details className="qa" data-reveal="">
              <summary>
                How can I reach you?
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </i>
              </summary>
              <div className="qa__body">
                <ul>
                  <li>
                    Call or text Moses: <a href="tel:+19734139585">973-413-9585</a> (also for delivery-day questions)
                  </li>
                  <li>
                    Texts only: <a href="+19739681391">973-968-1391</a>, Monday to Saturday, 11am–9pm
                  </li>
                  <li>
                    Email: <a href="mailto:info@uddermilk.com">info@uddermilk.com</a>
                  </li>
                </ul>
                <p>
                  Email is the best way to reach us. Please allow a few days for a reply. If we don&apos;t pick up, leave a message:
                  we&apos;re either on the other line or away from the phone.
                </p>
              </div>
            </details>
          </div>
          <div className="callout" data-reveal="">
            <img src="/assets/icons/telephone-receiver.webp" alt="" width="48" height="48" loading="lazy" />
            <div>
              <b>Still wondering?</b>
              <p>
                Call or text Moses at <a href="tel:+19734139585">973-413-9585</a>, or email{' '}
                <a href="mailto:info@uddermilk.com">info@uddermilk.com</a>. We&apos;re happy to help.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
