// Where we deliver: the delivery map, the areas on it, and how to check an address.
// Content follows front.uddermilk.com/where-we-deliver (map updated November 12, 2024).
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import PickupDelivery from './pickup-delivery'

const AREAS: [string, string][] = [
  ['Mid-Atlantic & Northeast', 'Pittsburgh, Philadelphia, New York City, Newark, Baltimore, Washington D.C., Boston, Providence and the I-95 corridor'],
  ['New England', 'Massachusetts, Connecticut, Rhode Island, Vermont, New Hampshire and nearby states'],
  ['Midwest', 'St. Louis, Chicago, Detroit, Indianapolis, Columbus, Cleveland and the areas around them'],
  ['Southeast', 'Norfolk, and the inland routes that run back toward the Midwest'],
  ['Canada', 'Greater Toronto and Montréal, as shown on the map'],
]

const Arrow = () => (
  <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export default function WhereWeDeliver({ mapSrc }: { mapSrc: string }) {
  return (
    <>
      <section className="page-hero" aria-labelledby="where-title">
        <div className="page-hero__inner">
          <span className="eyebrow">
            <img src="/assets/icons/round-pushpin.webp" alt="" width="20" height="20" />
            Where we deliver · Pickup &amp; delivery
          </span>
          <h1 id="where-title">
            Is your door
            <br />
            <em>on our route?</em>
          </h1>
          <p className="lede">
            Our trucks run weekly routes across the area outlined on the map. If your address is inside the outline, you can most likely
            get home delivery. Below: how delivery day works, the delivery window, changes, returns and pickup.
          </p>
        </div>
        <div className="float hide-sm" data-speed=".14" style={{ '--x': '6%', '--y': '30%', '--s': '120px' } as React.CSSProperties}>
          <img src="/assets/icons/round-pushpin.webp" alt="" width="120" height="120" />
        </div>
        <div className="float hide-sm" data-speed=".1" style={{ '--x': '84%', '--y': '28%', '--s': '118px', '--delay': '-2s' } as React.CSSProperties}>
          <img src="/assets/icons/delivery-truck.webp" alt="" width="118" height="118" />
        </div>
      </section>

      <section className="section section--tight" style={{ paddingTop: '10px' }} aria-labelledby="map-title">
        <div className="container">
          <h2 id="map-title" className="sr-only">Delivery map</h2>
          <figure className="wmap" data-reveal="">
            <a href={mapSrc} target="_blank" rel="noopener" aria-label="Open the delivery map full size in a new tab">
              <img
                src={mapSrc}
                alt="Map of Udder Milk's home delivery area, outlined in black, covering parts of the Midwest, Northeast, Mid-Atlantic and Canada"
                loading="lazy"
              />
            </a>
            <figcaption>
              <span>
                <b>Updated November 12, 2024.</b> Zoom in to see if your town is inside the black outline. Routes can change.
              </span>
              <a href={mapSrc} target="_blank" rel="noopener">Open full size</a>
            </figcaption>
          </figure>
          <div className="status-row wcards" data-stagger="">
            <div className="status" data-reveal="">
              <img src="/assets/icons/round-pushpin.webp" alt="" width="40" height="40" loading="lazy" />
              <b>Inside the outline</b>
              <p>Addresses inside the shaded area on the map can usually get home delivery.</p>
            </div>
            <div className="status" data-reveal="">
              <img src="/assets/icons/spiral-calendar.webp" alt="" width="40" height="40" loading="lazy" />
              <b>Weekly routes</b>
              <p>Each zone has its own delivery day. Your account shows your day and the cut-off for ordering.</p>
            </div>
            <div className="status" data-reveal="">
              <img src="/assets/icons/house-with-garden.webp" alt="" width="40" height="40" loading="lazy" />
              <b>NYC pickup too</b>
              <p>Some New York City members pick up on Saturday or Sunday instead of getting home delivery.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="areas-title">
        <div className="container split split--top">
          <div>
            <h2 id="areas-title" data-reveal="" style={{ fontSize: 'clamp(2.2rem,4.6vw,3.6rem)', marginBottom: '22px' }}>
              Areas <em>we cover.</em>
            </h2>
            <dl className="areas" data-stagger="">
              {AREAS.map(([region, places]) => (
                <div key={region} data-reveal="">
                  <dt>{region}</dt>
                  <dd>{places}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 data-reveal="" style={{ fontSize: 'clamp(2.2rem,4.6vw,3.6rem)', marginBottom: '22px' }}>
              Check <em>your address.</em>
            </h2>
            <ol className="steps" data-stagger="">
              <li data-reveal="">
                <span>
                  <b>Sign up or log in</b>
                  <span>New members enter their delivery address when they sign up.</span>
                </span>
              </li>
              <li data-reveal="">
                <span>
                  <b>Your address sets your zone</b>
                  <span>Your zone decides your delivery day, cut-off day, delivery fee and order minimum.</span>
                </span>
              </li>
              <li data-reveal="">
                <span>
                  <b>See it on your dashboard</b>
                  <span>
                    Your zone, cut-off day and delivery day are on your <Link href="/account">order dashboard</Link>. Moved? Change it in{' '}
                    <Link href="/account/address">My address &amp; delivery</Link>.
                  </span>
                </span>
              </li>
            </ol>
            <div className="callout callout--butter" data-reveal="" style={{ marginTop: '14px' }}>
              <img src="/assets/icons/round-pushpin.webp" alt="" width="48" height="48" loading="lazy" />
              <div>
                <b>Not sure?</b>
                <p>
                  Email your full address to <a href="mailto:info@uddermilk.com">info@uddermilk.com</a> and we&apos;ll tell you if
                  we deliver there.
                </p>
              </div>
            </div>
            <div className="callout callout--clover" data-reveal="" style={{ marginTop: '14px' }}>
              <img src="/assets/icons/delivery-truck.webp" alt="" width="48" height="48" loading="lazy" />
              <div>
                <b>Outside the outline?</b>
                <p>We add routes from time to time, so check back. In New York City, you can also pick up your order on Saturday or Sunday.</p>
              </div>
            </div>
            <div className="btn-row" data-reveal="" style={{ marginTop: '18px' }}>
              <Link className="btn" href="/signup">
                Sign up <Arrow />
              </Link>{' '}
              <Link className="btn btn--ghost" href="/login">
                Log in to see your zone
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PickupDelivery />
    </>
  )
}
