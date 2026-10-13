// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */

export default function PrivacyPolicy() {
  return (
    <>
      <section className="page-hero" aria-labelledby="pp-title">
        <div className="page-hero__inner">
          <span className="eyebrow">
            <img src="/assets/icons/locked.webp" alt="" width="20" height="20" />
            Privacy policy
          </span>
          <h1 id="pp-title">
            Your information,
            <br />
            <em>kept simple.</em>
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
              The old site&apos;s privacy page was blank. This draft describes how the site and member system appear to work today. Please
              check it against your actual practices, and have it reviewed, before it goes live.
            </div>
          </div>
          <div className="prose">
            <h2>Who we are</h2>
            <p>
              Udder Milk Creamery Association (“Udder Milk,” “we”) is a private members&apos; association at 2960 Nolo Rd, Penn Run, PA. You
              can reach us at <a href="mailto:info@uddermilk.com">info@uddermilk.com</a> or 973-413-9585.
            </p>
            <h2>What we collect</h2>
            <ul>
              <li>
                <b>When you join:</b> your name, email address, password, phone numbers and delivery address, which we confirm on a map.
              </li>
              <li>
                <b>When you order:</b> what you order, your delivery day and zone, your order history, and any notes you send us.
              </li>
              <li>
                <b>When you contact us:</b> whatever you choose to include in your email, call or text.
              </li>
            </ul>
            <p>
              We don&apos;t collect card numbers. Orders are paid in cash on delivery. If we refund you by Venmo or Zelle, we use only the
              details you give us for that refund.
            </p>
            <h2>How we use it</h2>
            <ul>
              <li>To run your membership and your account.</li>
              <li>To prepare, deliver and confirm your orders, and to handle credits and returns.</li>
              <li>To contact you about your orders and deliveries.</li>
              <li>To send you promotional messages by phone, which you agree to when you sign up. Tell us any time and we&apos;ll stop.</li>
            </ul>
            <h2>Who we share it with</h2>
            <p>
              We don&apos;t sell your information. We share it only with the people who help us deliver your order, with the services that
              host our website and member system, and when the law requires it.
            </p>
            <h2>Cookies</h2>
            <p>
              The member system uses cookies to keep you logged in. This website remembers one setting in your browser, the “In stock only”
              shop filter, and nothing else.
            </p>
            <h2>Your choices</h2>
            <p>
              You can update your details in your account at any time. To close your account or ask us to delete your information, email{' '}
              <a href="mailto:info@uddermilk.com">info@uddermilk.com</a>.
            </p>
            <h2>Children</h2>
            <p>Our membership is for adults. We don&apos;t knowingly collect information from children under 13.</p>
            <h2>Changes</h2>
            <p>If we change this policy, we&apos;ll update the date at the top of this page.</p>
          </div>
        </div>
      </section>
    </>
  )
}
