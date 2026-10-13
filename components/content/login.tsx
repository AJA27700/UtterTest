/* eslint-disable @next/next/no-img-element */
// Log in. Layout follows the new site (front.uddermilk.com/login): photo on the left, form on the right,
// "Remember me" + "Forgot password?" on one line. Styled to match the rest of this site.
import AccountForm from '@/components/AccountForm'
import Link from 'next/link'

export default function Login() {
  return (
    <section className="account account--login" aria-labelledby="acct-title">
      <div className="account__grid">
        <figure className="login-photo">
          <img
            src="/assets/img/daughter-flowers.webp"
            alt="Gina and Moaz's daughter in a blue dress, holding a big bouquet of flowers"
            width="900"
            height="1025"
            decoding="async"
          />
          <figcaption>
            <span>The next generation</span>
            <small>Udder Milk is a family business, since 2005.</small>
          </figcaption>
        </figure>

        <div className="account__card">
          <span className="eyebrow">
            <img src="/assets/icons/bust-in-silhouette.webp" alt="" width="20" height="20" />
            Members
          </span>
          <h1 id="acct-title">
            Log <em>in.</em>
          </h1>
          <p className="muted">
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </p>
          <AccountForm kind="login" className="form account__form">
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input id="login-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <div className="login-line">
              <label className="check check--inline">
                <input type="checkbox" name="remember" value="1" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password">Forgot password?</Link>
            </div>
            <button className="btn btn--wide" type="submit">
              Log in{' '}
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </AccountForm>
          <p className="account__help">
            Trouble logging in? Call or text <a href="tel:+19734139585">973-413-9585</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
