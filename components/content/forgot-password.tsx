// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import AccountForm from '@/components/AccountForm'
import Link from 'next/link'

export default function ForgotPassword() {
  return (
    <>
      <section className="account" aria-labelledby="acct-title">
        <div className="account__grid">
          <div className="account__card">
            <span className="eyebrow">
              <img src="/assets/icons/key.webp" alt="" width="20" height="20" />
              Account help
            </span>
            <h1 id="acct-title">
              Forgot your <em>password?</em>
            </h1>
            <p className="muted">Enter the email you signed up with, and we&apos;ll email you a link to reset your password.</p>
            <AccountForm kind="forgot" className="form account__form">
              <div className="field">
                <label htmlFor="forgot-email">Email</label>{' '}
                <input id="forgot-email" name="email" type="email" autoComplete="email" required />
              </div>
              <button className="btn btn--wide" type="submit">
                Send the reset link{' '}
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
              </button>{' '}
            </AccountForm>
            <div className="account__alt">
              <Link href="/login">
                <img src="/assets/icons/bust-in-silhouette.webp" alt="" width="34" height="34" loading="lazy" />
                <span>
                  <b>Remembered it?</b>Back to log in
                </span>
                <svg
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
              <a href="mailto:info@uddermilk.com">
                <img src="/assets/icons/envelope.webp" alt="" width="34" height="34" loading="lazy" />
                <span>
                  <b>No email from us?</b>info@uddermilk.com
                </span>
                <svg
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
              </a>
            </div>
          </div>
          <div className="account__art scene scene--photo" aria-hidden="true">
            <img
              className="scene__photo"
              src="/assets/img/cow-portrait-720.jpg"
              srcSet="/assets/img/cow-portrait-720.jpg 720w, /assets/img/cow-portrait-1200.jpg 1200w"
              sizes="(max-width: 900px) 100vw, 560px"
              width="720"
              height="720"
              alt=""
              decoding="async"
            />
            <div className="scene__ribbon">
              <svg className="ribbon" viewBox="0 0 640 112" role="img" aria-label="Satisfying customers since 2005">
                <defs>
                  <linearGradient id="acct-rb-band-forgot-password" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FFE7A0" />
                    <stop offset=".48" stopColor="#F5C544" />
                    <stop offset="1" stopColor="#DDA02A" />
                  </linearGradient>
                  <linearGradient id="acct-rb-tail-forgot-password" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#E7AF38" />
                    <stop offset="1" stopColor="#B98019" />
                  </linearGradient>
                  <path id="acct-rb-arc-forgot-password" d="M80 72Q320 46 560 72" />
                </defs>
                <path d="M102 46H20l24 30-24 30h82z" fill="url(#acct-rb-tail-forgot-password)" />
                <path d="M538 46h82l-24 30 24 30h-82z" fill="url(#acct-rb-tail-forgot-password)" />
                <path d="M80 90l22 16V90z" fill="#8A5E10" />
                <path d="M560 90l-22 16V90z" fill="#8A5E10" />
                <path d="M80 30Q320 2 560 30V90Q320 62 80 90Z" fill="url(#acct-rb-band-forgot-password)" stroke="#B8841D" strokeWidth="2" />
                <path d="M86 38Q320 12 554 38" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
                <text className="ribbon__text">
                  <textPath href="#acct-rb-arc-forgot-password" startOffset="50%" textAnchor="middle">
                    Satisfying customers since 2005
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
