// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Article304() {
  return (
    <>
      <article>
        <header className="article-hero">
          <div className="container narrow">
            <ol className="crumbs" aria-label="Breadcrumb">
              <li>
                <Link href="/articles">Articles</Link>
              </li>
              <li aria-current="page">Cow milk: Jersey, Guernsey and the European herd</li>
            </ol>
            <div className="article-art">
              <img src="/assets/icons/brown-cow.webp" alt="" width="180" height="180" />
            </div>
            <h1>Cow milk: Jersey, Guernsey and the European herd</h1>
            <p className="lede">What the percentages mean, what A2/A2 means, and how to choose between our three cow milks.</p>
            <div className="byline" style={{ marginTop: '18px' }}>
              <span>By Udder Milk</span>
              <span>·</span>
              <time dateTime="2026-08-11">August 11, 2026</time>
              <span>·</span>
              <span>4 min read</span>
            </div>
          </div>
        </header>
        <div className="section section--tight" style={{ paddingTop: '18px' }}>
          <div className="container narrow prose">
            <p>
              We carry raw cow milk from three kinds of herds. All three are 100% grass-fed whole milk, straight from the cow. The
              difference is in the breed, and you can taste it.
            </p>
            <h2>Three herds, three milks</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Milk</th>
                    <th>Butterfat</th>
                    <th>What it&apos;s like</th>
                    <th>From</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>Jersey</b>
                    </td>
                    <td>6.3%</td>
                    <td>Very rich and creamy. A2/A2.</td>
                    <td>$6.50 · half gallon</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Guernsey</b>
                    </td>
                    <td>High</td>
                    <td>Golden from beta-carotene, high in protein and fat. A2/A2.</td>
                    <td>$5.50 · glass quart</td>
                  </tr>
                  <tr>
                    <td>
                      <b>European herd</b>
                    </td>
                    <td>4.8%</td>
                    <td>A mixed herd of Swiss, Dutch Belted and Shorthorn cows. A little lighter.</td>
                    <td>$6.50 · half gallon</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>The percentages are butterfat. Every one of them is whole milk. Nothing is skimmed off or added.</p>
            <h2>Why Guernsey is special</h2>
            <p>
              Guernsey milk has a golden color all the way through, from the beta-carotene in the grass. It&apos;s rare, and Kathy started
              her own herd to bring it to members. The herd is small, so when the Guernsey runs out, we substitute Jersey.
            </p>
            <h2>What does A2/A2 mean?</h2>
            <p>
              Milk has two main types of a protein called beta-casein, known as A1 and A2. A cow with two copies of the A2 gene, written
              A2/A2, gives milk with only the A2 type. Our Jersey and Guernsey milks are A2/A2.
            </p>
            <h2>What we make from it</h2>
            <p>
              Butter, cream, buttermilk, whey, kefir, yogurt, Greek yogurt, cottage cheese, ricotta, sour cream, cream cheese, rice pudding,
              egg custard and ice cream. Then there are Maryam&apos;s raw Guernsey cheeses, about twenty of them.
            </p>
            <h2>Keeping it fresh</h2>
            <ul>
              <li>Get it into the fridge fast, and keep it at the back where it&apos;s coldest.</li>
              <li>Glass keeps milk colder than plastic.</li>
              <li>The cream rises to the top. Shake the bottle before pouring, or skim the cream off for your coffee.</li>
            </ul>
            <p>
              <Link href="/category/cow-dairy">Shop Jersey dairy</Link> ·{' '}
              <Link href="/products/product_lists/gurnsey-dairy">Shop Guernsey dairy</Link> ·{' '}
              <Link href="/category/raw-cheese-cow-goat-sheep">Shop raw cheese</Link>
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
