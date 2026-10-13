// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function NotFoundContent() {
  return (
    <>
      <section className="hero hero--404" aria-labelledby="nf-title">
        <div className="sky" aria-hidden="true">
          <div className="cloud" style={{ '--x': '8%', '--y': '12%', '--s': '130px', '--d': '24s' } as React.CSSProperties}>
            <img src="/assets/icons/cloud.webp" alt="" width="256" height="256" />
          </div>
          <div
            className="cloud hide-sm"
            style={{ '--x': '70%', '--y': '8%', '--s': '100px', '--d': '30s', '--delay': '-6s' } as React.CSSProperties}
          >
            <img src="/assets/icons/cloud.webp" alt="" width="256" height="256" />
          </div>
          <img className="hero__butterfly" src="/assets/icons/butterfly.webp" alt="" width="54" height="54" />
        </div>
        <div className="hero__stage">
          <div className="nf" data-hero-fade="">
            <span className="eyebrow">Error 404</span>
            <h1 id="nf-title">
              This page wandered
              <br />
              <em>off to pasture.</em>
            </h1>
            <p>It might have moved when we rebuilt the site. Try the shop, or head back home.</p>
            <div className="btn-row">
              <Link className="btn" href="/shop">
                Shop the farm{' '}
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
              <Link className="btn btn--milk" href="/">
                Back home
              </Link>
            </div>
          </div>
          <div className="nf__photo">
            <img src="/assets/img/cow-portrait-720.jpg" width="720" height="720" alt="" decoding="async" />
          </div>
        </div>
        <div className="meadow" aria-hidden="true">
          <svg className="meadow__hills" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 96C160 44 340 36 540 76s360 22 520-14 280-24 380 4V260H0Z" fill="#BEE19A" />
            <path d="M0 156c170-44 350-52 540-24 190 28 280 26 400 6 170-28 350-28 500 6V260H0Z" fill="#86C463" />
            <path d="M0 212c230-34 440-40 660-22s430 26 620 10c70-6 120-8 160-6V260H0Z" fill="#3B7D3C" />
          </svg>
        </div>
        <div className="grass grass--short" />
      </section>
    </>
  )
}
