// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Article307() {
  return (
    <>
      <article>
        <header className="article-hero">
          <div className="container narrow">
            <ol className="crumbs" aria-label="Breadcrumb">
              <li>
                <Link href="/articles">Articles</Link>
              </li>
              <li aria-current="page">Buffalo milk: thick, snow-white and rare</li>
            </ol>
            <div className="article-art">
              <img src="/assets/icons/water-buffalo.webp" alt="" width="180" height="180" />
            </div>
            <h1>Buffalo milk: thick, snow-white and rare</h1>
            <p className="lede">
              Water buffalo milk has about twice the butterfat of cow&apos;s milk. It&apos;s what real mozzarella is made from.
            </p>
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
              Water buffalo milk is thick, sweet and snow-white. It has roughly twice the butterfat of cow&apos;s milk, and it&apos;s the
              milk traditional mozzarella is made from. It&apos;s also rare, which is why it costs more.
            </p>
            <h2>Why is it so white?</h2>
            <p>
              Cows pass beta-carotene from grass into their milk, which gives Guernsey milk its golden color. Buffalo turn it into vitamin A
              instead, so their milk and butter stay bright white.
            </p>
            <h2>What we carry</h2>
            <ul>
              <li>
                <b>Raw buffalo milk</b>: quart $18, glass half gallon $32, gallon $48.
              </li>
              <li>
                <b>A buffalo and Guernsey blend</b>, a glass half gallon for $20. It&apos;s a good way to try it.
              </li>
              <li>
                <b>Raw buffalo chocolate milk</b>, by the pint or quart.
              </li>
              <li>
                <b>Cream, yogurt and kefir</b>: heavy cream, light cream, sour cream, Greek yogurt and kefir.
              </li>
              <li>
                <b>Butter and ghee</b>, including Mediterranean-style ghee made by culturing the milk into yogurt, hand-churning it, then
                slowly cooking the butter.
              </li>
              <li>
                <b>Cheese</b>: fresh mozzarella, gouda, cheddar, smoked cheddar, paneer, camembert and a soft spreadable cheese.
              </li>
              <li>
                <b>Ice cream</b>: vanilla, chocolate, strawberry and dandelion.
              </li>
            </ul>
            <h2>Buffalo milk for sale, delivered</h2>
            <p>Members order online before their cut-off and we deliver on their delivery day.</p>
            <p>
              <Link href="/category/buffalo-dairy">Shop buffalo dairy</Link> · <Link href="/signup">Become a member</Link>
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
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
