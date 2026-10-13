// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function News() {
  return (
    <>
      <section className="page-hero" aria-labelledby="news-title">
        <div className="page-hero__inner">
          <span className="eyebrow">
            <img src="/assets/icons/newspaper.webp" alt="" width="20" height="20" />
            Farm news
          </span>
          <h1 id="news-title">
            Fresh from
            <br />
            <em>the farm.</em>
          </h1>
          <p className="lede">What&apos;s in season, what&apos;s back in stock, and what&apos;s new on the shelves.</p>
        </div>
        <div className="float hide-sm" data-speed=".12" style={{ '--x': '7%', '--y': '30%', '--s': '118px' } as React.CSSProperties}>
          <img src="/assets/icons/megaphone.webp" alt="" width="118" height="118" />
        </div>
        <div
          className="float hide-sm"
          data-speed=".08"
          style={{ '--x': '84%', '--y': '26%', '--s': '112px', '--delay': '-2s' } as React.CSSProperties}
        >
          <img src="/assets/icons/rabbit.webp" alt="" width="112" height="112" />
        </div>
      </section>
      <section className="section section--tight" style={{ paddingTop: '0' }} aria-labelledby="now-title">
        <div className="container">
          <h2 id="now-title" data-reveal="" style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '20px' }}>
            On the farm <em>now</em>
          </h2>
          <div className="cards3" data-stagger="">
            <Link className="card" href="/category/rabbit" style={{ '--tint': '#E1ECD2' } as React.CSSProperties} data-reveal="">
              {' '}
              <img className="card__img" src="/assets/icons/rabbit.webp" alt="" width="84" height="84" loading="lazy" />{' '}
              <span className="label">Back in stock</span>
              <h3>Grass-fed rabbit is back</h3>
              <p>Whole rabbits, halal, about 3½ lb each. They go quickly.</p>
              <span className="card__foot link-arrow">
                Take a look{' '}
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
            <Link
              className="card"
              href="/category/fresh-shrimp#monkfish-liver"
              style={{ '--tint': '#DCE7F6' } as React.CSSProperties}
              data-reveal=""
            >
              {' '}
              <img className="card__img" src="/assets/icons/fish.webp" alt="" width="84" height="84" loading="lazy" />{' '}
              <span className="label">In season</span>
              <h3>Monkfish liver is in season</h3>
              <p>The foie gras of the sea, sold by the half pound, alongside wild Alaskan king salmon.</p>
              <span className="card__foot link-arrow">
                Take a look{' '}
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
            <Link
              className="card"
              href="/sub-category/grass-fed-meats"
              style={{ '--tint': '#FBE1DC' } as React.CSSProperties}
              data-reveal=""
            >
              {' '}
              <img className="card__img" src="/assets/icons/cut-of-meat.webp" alt="" width="84" height="84" loading="lazy" />{' '}
              <span className="label">Just in</span>
              <h3>Fresh grass-fed meat is back</h3>
              <p>Roasts, steaks and ground beef from long-grazed cattle, frozen right after slaughter.</p>
              <span className="card__foot link-arrow">
                Take a look{' '}
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
            <Link
              className="card"
              href="/category/soup-and-stews#king-salmon-head-and-bone-soup"
              style={{ '--tint': '#F8DDC4' } as React.CSSProperties}
              data-reveal=""
            >
              {' '}
              <img className="card__img" src="/assets/icons/pot-of-food.webp" alt="" width="84" height="84" loading="lazy" />{' '}
              <span className="label">New</span>
              <h3>Start brothing: wild salmon soup</h3>
              <p>King salmon heads and bones simmered with vegetables, by the pint.</p>
              <span className="card__foot link-arrow">
                Take a look{' '}
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
            <Link
              className="card"
              href="/category/sheep-dairy#raw-sheep-kefir"
              style={{ '--tint': '#FBE1DC' } as React.CSSProperties}
              data-reveal=""
            >
              {' '}
              <img className="card__img" src="/assets/icons/strawberry.webp" alt="" width="84" height="84" loading="lazy" />{' '}
              <span className="label">New</span>
              <h3>Strawberry sheep&apos;s kefir</h3>
              <p>Tangy, pink and rich. Ask for it with your sheep dairy order.</p>
              <span className="card__foot link-arrow">
                Take a look{' '}
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
            <Link
              className="card"
              href="/category/bread-taboun-bread"
              style={{ '--tint': '#FBE8A6' } as React.CSSProperties}
              data-reveal=""
            >
              {' '}
              <img className="card__img" src="/assets/icons/bread.webp" alt="" width="84" height="84" loading="lazy" />{' '}
              <span className="label">On the shelf</span>
              <h3>Sprouted bread, rye and ancient grains</h3>
              <p>Einkorn sourdough, sprouted spelt loaves and more from Walnut Run.</p>
              <span className="card__foot link-arrow">
                Take a look{' '}
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
      <section className="section section--tight" aria-labelledby="archive-title">
        <div className="container narrow">
          <h2 id="archive-title" data-reveal="" style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '20px' }}>
            From the <em>archive</em>
          </h2>
          <div className="news-list" data-stagger="">
            <Link className="news-item post" href="/about-us" data-reveal="">
              {' '}
              <time className="when" dateTime="2014-02-06">
                February 6, 2014
              </time>{' '}
              <span className="post__img" style={{ '--tint': '#E1ECD2' } as React.CSSProperties}>
                <img src="/assets/icons/four-leaf-clover.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                <h3>We&apos;re 100% grass-fed, cow and sheep dairy alike</h3>
                <p>No grain, ever, for the cows and sheep that give us our milk, or for our beef.</p>
              </span>{' '}
            </Link>{' '}
            <Link className="news-item post" href="/where-we-deliver#delivery-day" data-reveal="">
              {' '}
              <time className="when" dateTime="2013-12-17">
                December 17, 2013
              </time>{' '}
              <span className="post__img" style={{ '--tint': '#DCE7F6' } as React.CSSProperties}>
                <img src="/assets/icons/alarm-clock.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                <h3>When will my food arrive?</h3>
                <p>Delivery runs from 11am to midnight on your delivery day. Here&apos;s how to find your window.</p>
              </span>{' '}
            </Link>{' '}
            <Link className="news-item post" href="/faq" data-reveal="">
              {' '}
              <time className="when" dateTime="2013-10-21">
                October 21, 2013
              </time>{' '}
              <span className="post__img" style={{ '--tint': '#FBE8A6' } as React.CSSProperties}>
                <img src="/assets/icons/admission-tickets.webp" alt="" width="72" height="72" loading="lazy" />
              </span>{' '}
              <span>
                <h3>How to get started, for every member</h3>
                <p>Join, find your delivery day, leave a cooler and pay on delivery.</p>
              </span>{' '}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
