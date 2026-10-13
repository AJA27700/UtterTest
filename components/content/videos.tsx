// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Videos() {
  return (
    <>
      <section className="page-hero" aria-labelledby="vid-title">
        <div className="page-hero__inner">
          <span className="eyebrow">
            <img src="/assets/icons/movie-camera.webp" alt="" width="20" height="20" />
            Videos
          </span>
          <h1 id="vid-title">
            The farm,
            <br />
            <em>on film.</em>
          </h1>
          <p className="lede">A peek at the animals behind your order.</p>
        </div>
        <div className="float hide-sm" data-speed=".12" style={{ '--x': '8%', '--y': '34%', '--s': '118px' } as React.CSSProperties}>
          <img src="/assets/icons/clapper-board.webp" alt="" width="118" height="118" />
        </div>
        <div
          className="float hide-sm"
          data-speed=".08"
          style={{ '--x': '83%', '--y': '30%', '--s': '120px', '--delay': '-2s' } as React.CSSProperties}
        >
          <img src="/assets/icons/ewe.webp" alt="" width="120" height="120" />
        </div>
      </section>
      <section className="section section--tight" style={{ paddingTop: '0' }}>
        <div className="container narrow">
          <div className="video" data-reveal="scale">
            <div className="video__art">
              <svg viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 128C180 70 360 58 560 104s340 14 500-20 280-14 380 12V300H0Z" fill="#B9D69A" />
                <path d="M0 196c160-46 330-56 520-26 180 28 260 26 380 6 160-26 350-26 540 8V300H0Z" fill="#86B566" />
                <path d="M0 256c220-34 420-42 640-22s420 28 620 12c80-6 140-10 180-8V300H0Z" fill="#2D5A34" />
              </svg>
            </div>
            <button type="button" data-yt="xYpHYMm74K4" aria-label="Play: Our grass-fed lambs">
              {' '}
              <img className="video__sheep" src="/assets/icons/ewe.webp" alt="" width="220" height="220" />{' '}
              <span className="video__play">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
                </svg>
              </span>{' '}
              <span className="video__cap">Our grass-fed lambs</span>{' '}
            </button>
          </div>
          <div className="byline" data-reveal="" style={{ justifyContent: 'center', marginTop: '18px' }}>
            <span>January 10, 2021</span>
            <span>·</span>
            <span>Plays from YouTube</span>
          </div>
          <div className="callout" data-reveal="" style={{ marginTop: '36px' }}>
            <img src="/assets/icons/meat-on-bone.webp" alt="" width="48" height="48" loading="lazy" />
            <div>
              <b>Grass-fed lamb, spring through autumn</b>
              <p>
                These are the same flocks behind our lamb cuts, whole lambs and quarters.{' '}
                <Link href="/category/lamb">See what&apos;s in stock</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
