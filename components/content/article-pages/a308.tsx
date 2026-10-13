// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Article308() {
  return (
    <>
      <article>
        <header className="article-hero">
          <div className="container narrow">
            <ol className="crumbs" aria-label="Breadcrumb">
              <li>
                <Link href="/articles">Articles</Link>
              </li>
              <li aria-current="page">Raw milk in NYC: what to know before you buy</li>
            </ol>
            <div className="article-art">
              <img src="/assets/icons/glass-of-milk.webp" alt="" width="180" height="180" />
            </div>
            <h1>Raw milk in NYC: what to know before you buy</h1>
            <p className="lede">What raw milk is, how we keep it fresh from the farm to your door, and who should skip it.</p>
            <div className="byline" style={{ marginTop: '18px' }}>
              <span>By Udder Milk</span>
              <span>·</span>
              <time dateTime="2026-08-20">August 20, 2026</time>
              <span>·</span>
              <span>4 min read</span>
            </div>
          </div>
        </header>
        <div className="section section--tight" style={{ paddingTop: '18px' }}>
          <div className="container narrow prose">
            <p>
              Raw milk is milk that hasn&apos;t been pasteurized or homogenized. It comes to you the way it comes from the animal.
              Here&apos;s how we handle it, what we carry, and what to know before you buy.
            </p>
            <h2>How we keep it fresh</h2>
            <p>
              Our milk comes from small farms in Pennsylvania. We try to deliver it 12 to 24 hours after milking, which is why some members
              get their order late in the evening. Leave a cooler with ice out on your delivery day, and get the milk into the fridge as
              soon as you can.
            </p>
            <h2>The kinds we carry</h2>
            <ul>
              <li>
                <b>Cow</b>: Jersey, Kathy&apos;s Guernsey, and a mixed European herd.
              </li>
              <li>
                <b>Goat</b>, mild and slightly sweet.
              </li>
              <li>
                <b>Sheep</b>, the creamiest of all, fresh or frozen.
              </li>
              <li>
                <b>Water buffalo</b>, thick and snow-white.
              </li>
              <li>
                <b>Camel</b>, frozen, plus <b>donkey</b> milk when we can get it.
              </li>
            </ul>
            <h2>Keep it cold</h2>
            <ul>
              <li>Keep your fridge at 40°F or colder, and store milk at the back, not in the door.</li>
              <li>Don&apos;t leave it out on the counter.</li>
              <li>Use it while it&apos;s fresh. Trust your nose.</li>
            </ul>
            <h2>Who should skip raw milk</h2>
            <p>
              Because raw milk isn&apos;t pasteurized, it can carry bacteria that make people sick. The CDC and FDA advise that pregnant
              women, babies and young children, older adults, and anyone with a weakened immune system avoid raw milk and raw-milk products.
              If you&apos;re not sure, talk with your doctor first.
            </p>
            <h2>Know your local rules</h2>
            <p>
              Raw milk rules are different from state to state. Udder Milk is a private members&apos; association, and we recommend checking
              the rules where you live before you buy.
            </p>
            <h2>How to order from us</h2>
            <ol>
              <li>
                <Link href="/signup">Sign up as a member</Link>.
              </li>
              <li>Order online before your cut-off date.</li>
              <li>Leave a cooler with ice and your cash out on your delivery day.</li>
            </ol>
            <p>
              <Link href="/where-we-deliver#delivery-day">How delivery works</Link> · <Link href="/faq">Read the FAQ</Link>
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
