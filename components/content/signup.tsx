// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import SignupWizard from '@/components/SignupWizard'
import Link from 'next/link'

export default function Signup() {
  return (
    <>
      <section className="account account--wide" aria-labelledby="acct-title">
        <div className="account__grid">
          <div className="account__card">
            <span className="eyebrow">
              <img src="/assets/icons/waving-hand.webp" alt="" width="20" height="20" />
              Become a member
            </span>
            <h1 id="acct-title">
              Sign <em>up.</em>
            </h1>
            <p className="muted">
              Four quick steps. Already have an account? <Link href="/login">Log in instead</Link>.
            </p>
            <SignupWizard />
          </div>
          <aside className="account__side" aria-label="How membership works">
            <img
              className="account__photo"
              src="/assets/img/cow-portrait-720.jpg"
              width="720"
              height="720"
              alt="A brown and white cow looking up from the grass"
              loading="lazy"
              decoding="async"
            />
            <h2>
              How it <em>works.</em>
            </h2>
            <ol className="steps">
              <li>
                <span>
                  <b>Sign up</b>
                  <span>Udder Milk is a private members&apos; association. This form makes you a member.</span>
                </span>
              </li>
              <li>
                <span>
                  <b>Find your delivery day</b>
                  <span>Your account shows your zone, your delivery day and your order cut-off.</span>
                </span>
              </li>
              <li>
                <span>
                  <b>Order, then leave a cooler</b>
                  <span>We deliver from 11am to midnight. Leave an 11-quart cooler with ice and your cash by the door.</span>
                </span>
              </li>
            </ol>
            <p className="account__help">
              Questions? Call or text <a href="tel:+19734139585">973-413-9585</a>.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
