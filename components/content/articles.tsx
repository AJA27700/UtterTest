// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Articles() {
  return (
    <>
      <section className="page-hero" aria-labelledby="art-title">
        <div className="page-hero__inner">
          <span className="eyebrow">
            <img src="/assets/icons/open-book.webp" alt="" width="20" height="20" />
            Articles
          </span>
          <h1 id="art-title">
            Notes from
            <br />
            <em>the creamery.</em>
          </h1>
          <p className="lede">How we make things, and what makes each milk different.</p>
        </div>
        <div className="float hide-sm" data-speed=".12" style={{ '--x': '7%', '--y': '30%', '--s': '118px' } as React.CSSProperties}>
          <img src="/assets/icons/open-book.webp" alt="" width="118" height="118" />
        </div>
        <div
          className="float hide-sm"
          data-speed=".08"
          style={{ '--x': '84%', '--y': '28%', '--s': '112px', '--delay': '-2s' } as React.CSSProperties}
        >
          <img src="/assets/icons/butter.webp" alt="" width="112" height="112" />
        </div>
      </section>
      <section className="section section--tight" style={{ paddingTop: '0' }}>
        <div className="container narrow">
          <div className="post-list" data-stagger="">
            <Link className="post" href="/articles/new_articledetails/308" data-reveal="">
              {' '}
              <span className="post__img" style={{ '--tint': '#DCE7F6' } as React.CSSProperties}>
                <img src="/assets/icons/glass-of-milk.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                {' '}
                <span className="label">August 20, 2026 · 4 min read</span>
                <h3>Raw milk in NYC: what to know before you buy</h3>
                <p>What raw milk is, how we keep it fresh from the farm to your door, and who should skip it.</p>
              </span>{' '}
              <span className="round-btn" aria-hidden="true">
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
              </span>{' '}
            </Link>{' '}
            <Link className="post" href="/articles/new_articledetails/304" data-reveal="">
              {' '}
              <span className="post__img" style={{ '--tint': '#DCE7F6' } as React.CSSProperties}>
                <img src="/assets/icons/brown-cow.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                {' '}
                <span className="label">August 11, 2026 · 4 min read</span>
                <h3>Cow milk: Jersey, Guernsey and the European herd</h3>
                <p>What the percentages mean, what A2/A2 means, and how to choose between our three cow milks.</p>
              </span>{' '}
              <span className="round-btn" aria-hidden="true">
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
              </span>{' '}
            </Link>{' '}
            <Link className="post" href="/articles/new_articledetails/305" data-reveal="">
              {' '}
              <span className="post__img" style={{ '--tint': '#E1ECD2' } as React.CSSProperties}>
                <img src="/assets/icons/goat.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                {' '}
                <span className="label">August 11, 2026 · 3 min read</span>
                <h3>Goat milk: mild, sweet and grass-fed</h3>
                <p>How our goats are fed, what the milk tastes like, and the cheeses, kefir and ice cream we make from it.</p>
              </span>{' '}
              <span className="round-btn" aria-hidden="true">
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
              </span>{' '}
            </Link>{' '}
            <Link className="post" href="/articles/new_articledetails/306" data-reveal="">
              {' '}
              <span className="post__img" style={{ '--tint': '#FBE1DC' } as React.CSSProperties}>
                <img src="/assets/icons/ewe.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                {' '}
                <span className="label">August 11, 2026 · 3 min read</span>
                <h3>Sheep milk: the creamiest milk we carry</h3>
                <p>
                  Naturally homogenized, sweeter than cow&apos;s milk, and so rich its yogurt sets like Greek. Here&apos;s how to buy it.
                </p>
              </span>{' '}
              <span className="round-btn" aria-hidden="true">
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
              </span>{' '}
            </Link>{' '}
            <Link className="post" href="/articles/new_articledetails/307" data-reveal="">
              {' '}
              <span className="post__img" style={{ '--tint': '#E8E0F4' } as React.CSSProperties}>
                <img src="/assets/icons/water-buffalo.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                {' '}
                <span className="label">August 11, 2026 · 3 min read</span>
                <h3>Buffalo milk: thick, snow-white and rare</h3>
                <p>Water buffalo milk has about twice the butterfat of cow&apos;s milk. It&apos;s what real mozzarella is made from.</p>
              </span>{' '}
              <span className="round-btn" aria-hidden="true">
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
              </span>{' '}
            </Link>{' '}
            <Link className="post" href="/articles/new_articledetails/301" data-reveal="">
              {' '}
              <span className="post__img" style={{ '--tint': '#FBE8A6' } as React.CSSProperties}>
                <img src="/assets/icons/butter.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                {' '}
                <span className="label">January 11, 2021 · 3 min read</span>
                <h3>How we make Guernsey cultured butter</h3>
                <p>Twenty-four hours of culture, a long ice bath, then the churn. Here&apos;s how our cultured butter gets its tang.</p>
              </span>{' '}
              <span className="round-btn" aria-hidden="true">
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
              </span>{' '}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
