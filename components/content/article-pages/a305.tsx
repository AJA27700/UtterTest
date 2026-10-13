// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Article305() {
  return (
    <>
      <article>
        <header className="article-hero">
          <div className="container narrow">
            <ol className="crumbs" aria-label="Breadcrumb">
              <li>
                <Link href="/articles">Articles</Link>
              </li>
              <li aria-current="page">Goat milk: mild, sweet and grass-fed</li>
            </ol>
            <div className="article-art">
              <img src="/assets/icons/goat.webp" alt="" width="180" height="180" />
            </div>
            <h1>Goat milk: mild, sweet and grass-fed</h1>
            <p className="lede">How our goats are fed, what the milk tastes like, and the cheeses, kefir and ice cream we make from it.</p>
            <div className="byline" style={{ marginTop: '18px' }}>
              <span>By Udder Milk</span>
              <span>·</span>
              <time dateTime="2026-08-11">August 11, 2026</time>
              <span>·</span>
              <span>3 min read</span>
            </div>
          </div>
        </header>
        <div className="section section--tight" style={{ paddingTop: '18px' }}>
          <div className="container narrow prose">
            <p>
              Our goat milk comes from goats that spend their days eating grass, hay and alfalfa. It&apos;s mild, clean-tasting and a little
              sweet when it&apos;s fresh. Much of what people dislike about goat milk comes from milk that&apos;s been sitting around, so
              ours comes to you quickly and cold.
            </p>
            <h2>How our goats eat</h2>
            <p>Their diet is about 92% grass, hay and alfalfa. The other 8% is organic oats, parsley and peas.</p>
            <h2>What we make from it</h2>
            <ul>
              <li>
                <b>Raw goat milk</b>: glass quart $8, half gallon $11.50, gallon $22.
              </li>
              <li>
                <b>Kefir</b>, cultured with kefir grains. It&apos;s milder and less sour than cow kefir. $12.50 a quart.
              </li>
              <li>
                <b>Drinkable yogurt</b>, plain or maple, and thick <b>Greek yogurt</b>.
              </li>
              <li>
                <b>Chèvre</b>, soft and mild: plain, honey lavender or spicy. $10 for 8 oz.
              </li>
              <li>
                <b>Aged cheeses</b>: cheddar, gouda, feta, BBQ smoked jack, and Midnight Dream, aged six months.
              </li>
              <li>
                <b>Ice cream</b> in strawberry, vanilla, chocolate and maple, and a slow-cooked <b>goat milk caramel sauce</b>.
              </li>
              <li>
                <b>Raw goat butter</b>, from the same farmer who brings us the milk. It&apos;s rare, so there isn&apos;t much of it.
              </li>
            </ul>
            <h2>Buying goat milk from us</h2>
            <p>Members order online before their cut-off, and we deliver on their delivery day, cold, with the rest of their order.</p>
            <p>
              <Link href="/category/goat-dairy">Shop goat dairy</Link> · <Link href="/signup">Become a member</Link>
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
            <Link className="post" href="/articles/new_articledetails/301" data-reveal="">
              {' '}
              <span className="post__img" style={{ '--tint': '#FBE8A6' } as React.CSSProperties}>
                <img src="/assets/icons/butter.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                <span className="label">January 11, 2021</span>
                <h3>How we make Guernsey cultured butter</h3>
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
