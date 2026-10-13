// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Article301() {
  return (
    <>
      <article>
        <header className="article-hero">
          <div className="container narrow">
            <ol className="crumbs" aria-label="Breadcrumb">
              <li>
                <Link href="/articles">Articles</Link>
              </li>
              <li aria-current="page">How we make Guernsey cultured butter</li>
            </ol>
            <div className="article-art">
              <img src="/assets/icons/butter.webp" alt="" width="180" height="180" />
            </div>
            <h1>How we make Guernsey cultured butter</h1>
            <p className="lede">
              Twenty-four hours of culture, a long ice bath, then the churn. Here&apos;s how our cultured butter gets its tang.
            </p>
            <div className="byline" style={{ marginTop: '18px' }}>
              <span>By Udder Milk</span>
              <span>·</span>
              <time dateTime="2021-01-11">January 11, 2021</time>
              <span>·</span>
              <span>3 min read</span>
            </div>
          </div>
        </header>
        <div className="section section--tight" style={{ paddingTop: '18px' }}>
          <div className="container narrow prose">
            <p>
              Cultured butter is butter made the old way. Before it&apos;s churned, the cream spends a day with live cultures, the way cream
              used to ripen on its own before refrigerators. The result tastes deeper and a little tangy. It&apos;s closer to the butter on
              a farmhouse table than the sweet-cream butter in most stores.
            </p>
            <h2>How we make it</h2>
            <h3>1. Warm the cream</h3>
            <p>We start with raw heavy cream from Kathy&apos;s Guernseys and bring it up to about 77°F.</p>
            <h3>2. Add the culture</h3>
            <p>
              Then we stir in MM 100, a live, active culture, and hold the cream at that temperature for 24 hours. We only use stainless
              steel containers for this step.
            </p>
            <h3>3. Chill it down</h3>
            <p>Next, the cultured cream sits in ice water for 12 to 24 hours, until it&apos;s cold all the way through.</p>
            <h3>4. Churn</h3>
            <p>Once it&apos;s properly chilled, we churn it into butter.</p>
            <blockquote>Most of the flavor comes from those 24 hours of culturing. You can&apos;t rush it.</blockquote>
            <h2>How to use it</h2>
            <p>
              Put it on good bread first, so you can really taste it. After that, use it anywhere you&apos;d use butter. To keep it longest,
              store it in a jar set in a bowl of ice water in the fridge.
            </p>
            <p>
              <Link href="/products/product_lists/gurnsey-dairy#raw-cultured-guernsey-butter">Shop raw cultured Guernsey butter</Link> or{' '}
              <Link href="/recipes#cultured-butter">make your own at home</Link>.
            </p>
          </div>
        </div>
      </article>
      <section className="section section--tight" style={{ paddingTop: '0' }}>
        <div className="container narrow">
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '18px' }} data-reveal="">
            Keep <em>reading.</em>
          </h2>
          <div className="post-list" data-stagger="">
            <Link className="post" href="/articles/new_articledetails/304" data-reveal="">
              {' '}
              <span className="post__img" style={{ '--tint': '#DCE7F6' } as React.CSSProperties}>
                <img src="/assets/icons/brown-cow.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                <span className="label">August 11, 2026</span>
                <h3>Cow milk: Jersey, Guernsey and the European herd</h3>
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
                <span className="label">August 11, 2026</span>
                <h3>Goat milk: mild, sweet and grass-fed</h3>
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
                <span className="label">August 11, 2026</span>
                <h3>Sheep milk: the creamiest milk we carry</h3>
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
