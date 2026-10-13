// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import ContactForm from '@/components/ContactForm'

export default function ContactUs() {
  return (
    <>
      <section className="page-hero" aria-labelledby="contact-title">
        <div className="page-hero__inner">
          <span className="eyebrow">
            <img src="/assets/icons/telephone-receiver.webp" alt="" width="20" height="20" />
            Contact us
          </span>
          <h1 id="contact-title">
            We&apos;d love to
            <br />
            <em>hear from you.</em>
          </h1>
          <p className="lede">
            Comments, suggestions and questions about your order are all welcome. Anything that could make our association better.
          </p>
        </div>
        <div className="float hide-sm" data-speed=".12" style={{ '--x': '7%', '--y': '30%', '--s': '120px' } as React.CSSProperties}>
          <img src="/assets/icons/envelope.webp" alt="" width="120" height="120" />
        </div>
        <div
          className="float hide-sm"
          data-speed=".08"
          style={{ '--x': '84%', '--y': '26%', '--s': '118px', '--delay': '-2s' } as React.CSSProperties}
        >
          <img src="/assets/icons/mobile-phone.webp" alt="" width="118" height="118" />
        </div>
      </section>
      <section className="section section--tight" style={{ paddingTop: '10px' }}>
        <div className="container">
          <div className="contact-grid" data-stagger="">
            <a className="contact-card" href="tel:+19734139585" style={{ '--tint': '#FBE8A6' } as React.CSSProperties} data-reveal="">
              {' '}
              <img src="/assets/icons/telephone-receiver.webp" alt="" width="60" height="60" loading="lazy" />
              <div>
                <span className="label">Call or text Moses</span>
                <b>973-413-9585</b>
                <span>Also the number for delivery-day questions.</span>
              </div>
            </a>{' '}
            <a className="contact-card" href="+19739681391" style={{ '--tint': '#DCE7F6' } as React.CSSProperties} data-reveal="">
              {' '}
              <img src="/assets/icons/mobile-phone.webp" alt="" width="60" height="60" loading="lazy" />
              <div>
                <span className="label">Texts only</span>
                <b>973-968-1391</b>
                <span>Monday to Saturday, 11am–9pm.</span>
              </div>
            </a>{' '}
            <a
              className="contact-card"
              href="mailto:info@uddermilk.com"
              style={{ '--tint': '#E1ECD2' } as React.CSSProperties}
              data-reveal=""
            >
              {' '}
              <img src="/assets/icons/envelope.webp" alt="" width="60" height="60" loading="lazy" />
              <div>
                <span className="label">Email, the best way</span>
                <b>info@uddermilk.com</b>
                <span>Please allow a few days for a reply.</span>
              </div>
            </a>{' '}
            <a
              className="contact-card"
              href={'https://www.google.com/maps/search/?api=1&query=2960+Nolo+Rd+Penn+Run+PA'}
              rel="noopener"
              style={{ '--tint': '#FBE1DC' } as React.CSSProperties}
              data-reveal=""
            >
              {' '}
              <img src="/assets/icons/round-pushpin.webp" alt="" width="60" height="60" loading="lazy" />
              <div>
                <span className="label">The farm</span>
                <b>2960 Nolo Rd, Penn Run, PA</b>
                <span>United States. Open it in Maps.</span>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container split split--top">
          <div>
            <h2 data-reveal="" style={{ fontSize: 'clamp(2.2rem,4.6vw,3.6rem)' }}>
              Send us
              <br />
              <em>a note.</em>
            </h2>
            <p className="lede" data-reveal="" style={{ marginTop: '16px' }}>
              This opens an email to us with your note filled in, so nothing gets lost.
            </p>
            <div className="callout callout--butter" data-reveal="" style={{ marginTop: '26px' }}>
              <img src="/assets/icons/speech-balloon.webp" alt="" width="48" height="48" loading="lazy" />
              <div>
                <b>No answer?</b>
                <p>
                  If we don&apos;t pick up, please leave a message. We&apos;re either on the other line or away from the phone. You can
                  leave a message anytime.
                </p>
              </div>
            </div>
          </div>
          <ContactForm className="form panel">
            <div className="form__row">
              <div className="field">
                <label htmlFor="f-name">Your name</label>
                <input id="f-name" name="name" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="f-email">Email</label>
                <input id="f-email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>
            <div className="form__row">
              <div className="field">
                <label htmlFor="f-topic">Topic</label>
                <input id="f-topic" name="topic" placeholder="An order, a product, an idea…" />
              </div>
              <div className="field">
                <label htmlFor="f-zone">Delivery zone (optional)</label>
                <input id="f-zone" name="zone" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-msg">Message</label>
              <textarea id="f-msg" name="message" required />
            </div>
            <div>
              <button className="btn" type="submit">
                Send message{' '}
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
              </button>
            </div>
          </ContactForm>
        </div>
      </section>
    </>
  )
}
