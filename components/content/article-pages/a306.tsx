// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Article306() {
  return (
    <>
      <article>
        <header className="article-hero">
          <div className="container narrow">
            <ol className="crumbs" aria-label="Breadcrumb">
              <li>
                <Link href="/articles">Articles</Link>
              </li>
              <li aria-current="page">Sheep milk: the creamiest milk we carry</li>
            </ol>
            <div className="article-art">
              <img src="/assets/icons/ewe.webp" alt="" width="180" height="180" />
            </div>
            <h1>Sheep milk: the creamiest milk we carry</h1>
            <p className="lede">
              Naturally homogenized, sweeter than cow&apos;s milk, and so rich its yogurt sets like Greek. Here&apos;s how to buy it.
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
              If you&apos;ve never tried sheep milk, start here. It&apos;s creamier and sweeter than cow&apos;s milk, and it&apos;s
              naturally homogenized, so the cream stays mixed in instead of rising to the top.
            </p>
            <h2>Fresh or frozen, glass or plastic</h2>
            <p>We sell raw sheep milk fresh and frozen. Frozen is handy if you want to stock up. Thaw it slowly in the fridge.</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Fresh</th>
                    <th>Fresh, glass</th>
                    <th>Frozen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Pint</td>
                    <td>$8.00</td>
                    <td>$9.00</td>
                    <td>$7.50</td>
                  </tr>
                  <tr>
                    <td>Quart</td>
                    <td>$13.00</td>
                    <td>$14.00</td>
                    <td>$12.00</td>
                  </tr>
                  <tr>
                    <td>Half gallon</td>
                    <td>$22.00</td>
                    <td>$26.00</td>
                    <td>$20.00</td>
                  </tr>
                  <tr>
                    <td>Gallon</td>
                    <td>$40.00</td>
                    <td>$45.00</td>
                    <td>sold out</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2>Yogurt that sets itself thick</h2>
            <p>
              Sheep milk has so much fat that its yogurt sets up thick, like Greek yogurt, without any straining. It&apos;s naturally sweet
              too. $12.50 a pint, $20 a quart.
            </p>
            <h2>Cheese, butter and ice cream</h2>
            <ul>
              <li>Aged raw cheeses: cheddar, colby, feta and a sheep cheese called Luscious Lamb.</li>
              <li>Raw sheep butter and cream, naturally sweeter than cow&apos;s.</li>
              <li>Sheep milk ice cream, made with honey, eggs and vanilla, in maple and strawberry.</li>
            </ul>
            <h2>Where to buy sheep milk</h2>
            <p>
              Right here. Sign up as a member, order before your cut-off, and we&apos;ll bring it to your door with the rest of your order,
              cold, on your delivery day.
            </p>
            <p>
              <Link href="/category/sheep-dairy">Shop sheep dairy</Link> · <Link href="/signup">Become a member</Link>
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
