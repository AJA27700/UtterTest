// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import HeroVideo from '@/components/HeroVideo'
import Link from 'next/link'
import type { Announcement } from '@/lib/announcements'

// Announcements box under the cow (edit content/announcements.md)
function Announcements({ items }: { items: Announcement[] }) {
  if (!items.length) return null
  return (
    <section className="announce" aria-labelledby="announce-title" data-hero-fade="" style={{ '--f': '1' } as React.CSSProperties}>
      <h2 id="announce-title" className="announce__head">Announcements</h2>
      <ul>
        {items.map((a, i) => (
          <li key={i}>
            {a.date && <small>{a.date}</small>}
            <b>{a.title}</b>
            {a.text.map((t, j) => <p key={j}>{t}</p>)}
            {a.link && <Link href={a.link.href}>{a.link.label} →</Link>}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Hero({ announcements = [] }: { announcements?: Announcement[] }) {
  return (
    <section className="hero hero--photo" aria-labelledby="hero-title">
      <div className="hero__scene">
        <HeroVideo />
        <p className="sr-only">A brown cow grazes in a sunny pasture, then lifts its head and looks at you.</p>
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__lockup">
          {/* The Udder Milk logo (cow, name and "since 2005" ribbon) in place of the big text */}
          <h1 id="hero-title" className="lockup__brand" data-hero-fade="" style={{ '--f': '0' } as React.CSSProperties}>
            <img
              className="lockup__logo"
              src="/assets/img/logo-udder-milk-hq.webp"
              alt="Udder Milk, satisfying customers since 2005"
              width={1260}
              height={852}
              fetchPriority="high"
            />
          </h1>
        </div>
      </div>
      <div className="grass">
        <div className="grass__inner">
          <Announcements items={announcements} />
          <span className="eyebrow eyebrow--grass" data-hero-fade="" style={{ '--f': '2' } as React.CSSProperties}>
            <span className="dot" />
            Private members&apos; creamery
          </span>
          <p className="grass__tag" data-hero-fade="" style={{ '--f': '3' } as React.CSSProperties}>
            The land of{' '}
            <span className="annot">
              milk<sup>raw</sup>
            </span>{' '}
            <em>
              &amp;&nbsp;
              <span className="annot annot--r">
                honey<sup>local</sup>
              </span>
              .
            </em>
          </p>
          <p className="grass__sub" data-hero-fade="" style={{ '--f': '4' } as React.CSSProperties}>
            Raw A2/A2 dairy, 100% grass-fed meat and pastured eggs from small Pennsylvania farms. Delivered to your door 12–24 hours after
            milking.
          </p>
          <div className="btn-row" data-hero-fade="" style={{ '--f': '5' } as React.CSSProperties}>
            <Link className="btn btn--butter" href="/shop">
              Shop the farm{' '}
              <svg
                className="arrow"
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
            </Link>{' '}
            <Link className="btn btn--milk" href="/signup">
              Sign up
            </Link>{' '}
            <Link className="btn btn--line" href="/login">
              Log in
            </Link>
          </div>
          <div className="hero__meta" data-hero-fade="" style={{ '--f': '6' } as React.CSSProperties}>
            <span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
              No sprays, no GMO seed
            </span>{' '}
            <span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
              Cash on delivery
            </span>{' '}
            <span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
              At your door 11am to midnight
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Facts() {
  return (
    <section className="facts" aria-label="How it works, in short">
      <div className="container facts__grid" data-stagger="">
        <div className="fact" data-reveal="">
          <img src="/assets/icons/alarm-clock.webp" alt="" width="58" height="58" loading="lazy" />
          <div>
            <b>12–24 hours</b>
            <span>from milking to your door</span>
          </div>
        </div>
        <div className="fact" data-reveal="">
          <img src="/assets/icons/delivery-truck.webp" alt="" width="58" height="58" loading="lazy" />
          <div>
            <b>11am to midnight</b>
            <span>on your delivery day, so leave a cooler out</span>
          </div>
        </div>
        <div className="fact" data-reveal="">
          <img src="/assets/icons/dollar-banknote.webp" alt="" width="58" height="58" loading="lazy" />
          <div>
            <b>Cash on delivery</b>
            <span>leave it in the cooler, no card needed at checkout</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Marquee() {
  return (
    <div className="marquee-wrap">
      <div
        className="marquee"
        aria-label="Raw Guernsey milk, Pastured eggs, Cultured butter, Sheep's milk yogurt, Buffalo mozzarella, Einkorn sourdough, Wildflower honey, Grass-fed beef, Goat chèvre, Bone broth"
      >
        <div className="marquee__track">
          <div className="marquee__group">
            <span className="marquee__item">Raw Guernsey milk</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Pastured eggs</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Cultured butter</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Sheep&apos;s milk yogurt</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Buffalo mozzarella</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Einkorn sourdough</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Wildflower honey</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Grass-fed beef</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Goat chèvre</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Bone broth</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
          </div>
          <div className="marquee__group" aria-hidden="true">
            <span className="marquee__item">Raw Guernsey milk</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Pastured eggs</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Cultured butter</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Sheep&apos;s milk yogurt</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Buffalo mozzarella</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Einkorn sourdough</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Wildflower honey</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Grass-fed beef</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Goat chèvre</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
            <span className="marquee__item">Bone broth</span>
            <svg className="daisy" viewBox="0 0 40 40" aria-hidden="true">
              <g fill="#FFFDF8" stroke="#2D5A34" strokeWidth="1.6">
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(45 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(90 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(135 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(180 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(225 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(270 20 20)" />
                <ellipse cx="20" cy="9.5" rx="4.6" ry="8.2" transform="rotate(315 20 20)" />
              </g>
              <circle cx="20" cy="20" r="6" fill="#E9A93B" stroke="#2D5A34" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Fresh() {
  return (
    <section className="fresh section" aria-labelledby="fresh-title">
      <div className="container fresh__grid">
        <div>
          <span className="eyebrow" data-reveal="">
            <img src="/assets/icons/alarm-clock.webp" alt="" width="20" height="20" />
            Why so late at night?
          </span>
          <div className="bignum" data-reveal="" aria-hidden="true">
            12–24<small>hrs</small>
          </div>
          <h2 id="fresh-title" data-reveal="" style={{ fontSize: 'clamp(2.2rem,4.6vw,3.8rem)', marginTop: '14px' }}>
            Milked this morning,
            <br />
            <em>at your door tonight.</em>
          </h2>
          <p className="lede" data-reveal="" style={{ marginTop: '18px' }}>
            We try to get milk to you 12 to 24 hours after milking. That&apos;s why some members get their order after 10pm. It&apos;s the
            freshest way we know.
          </p>
          <div className="fresh__notes" data-stagger="">
            <div className="note" data-reveal="">
              <img src="/assets/icons/ice.webp" alt="" width="34" height="34" loading="lazy" />
              <span>Leave an 11-quart cooler with ice by the door if you&apos;ll be out. We don&apos;t give exact times.</span>
            </div>
            <div className="note" data-reveal="">
              <img src="/assets/icons/dollar-banknote.webp" alt="" width="34" height="34" loading="lazy" />
              <span>Tuck your cash inside. We don&apos;t take cards, so checkout won&apos;t ask for one.</span>
            </div>
          </div>
        </div>
        <div className="route" data-reveal="">
          <div className="route__map">
            <svg className="route__path" viewBox="0 0 600 240" aria-hidden="true">
              <path
                d="M100 150C160 40 240 40 300 150S440 260 500 150"
                fill="none"
                stroke="rgba(255,255,255,.35)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="2 14"
              />
              <path data-route="" d="M100 150C160 40 240 40 300 150S440 260 500 150" fill="none" stroke="none" />
              <path
                data-route-fill=""
                d="M100 150C160 40 240 40 300 150S440 260 500 150"
                fill="none"
                stroke="#F6D36B"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <div className="route__node" style={{ '--x': '16.667%', '--y': '62.5%' } as React.CSSProperties}>
              <span className="stop__icon">
                <img src="/assets/icons/brown-cow.webp" alt="" width="80" height="80" loading="lazy" />
              </span>
            </div>
            <div className="route__node" style={{ '--x': '50%', '--y': '62.5%' } as React.CSSProperties}>
              <span className="stop__icon">
                <img src="/assets/icons/glass-of-milk.webp" alt="" width="80" height="80" loading="lazy" />
              </span>
            </div>
            <div className="route__node" style={{ '--x': '83.333%', '--y': '62.5%' } as React.CSSProperties}>
              <span className="stop__icon">
                <img src="/assets/icons/house-with-garden.webp" alt="" width="80" height="80" loading="lazy" />
              </span>
            </div>
            <div className="route__truck" aria-hidden="true">
              <img src="/assets/icons/delivery-truck.webp" alt="" width="76" height="76" loading="lazy" />
            </div>
          </div>
          <div className="route__stops">
            <div className="stop">
              <b>Milked</b>
              <span>on small farms in Pennsylvania</span>
            </div>
            <div className="stop">
              <b>Bottled cold</b>
              <span>packed up and loaded on the truck</span>
            </div>
            <div className="stop">
              <b>At your door</b>
              <span>between 11am and midnight</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Join() {
  return (
    <section className="section" aria-labelledby="join-title">
      <div className="container">
        <div className="head head--center">
          <span className="eyebrow" data-reveal="">
            <img src="/assets/icons/admission-tickets.webp" alt="" width="20" height="20" />
            How membership works
          </span>
          <h2 id="join-title" data-reveal="">
            Three steps to
            <br />
            <em>a full cooler.</em>
          </h2>
        </div>
        <div className="stack">
          <article className="stack__card" style={{ '--i': '0', '--tint': '#FBE8A6' } as React.CSSProperties}>
            <div className="stack__num">1</div>
            <div>
              <h3>Sign up as a member.</h3>
              <p>
                Udder Milk is a private members&apos; association. Sign up online with your name, phone and delivery address, and
                you&apos;re in.
              </p>
              <Link className="link-arrow" href="/signup">
                Sign up{' '}
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
              </Link>
            </div>
            <div className="stack__img">
              <img src="/assets/icons/admission-tickets.webp" alt="" width="170" height="170" loading="lazy" />
            </div>
          </article>
          <article className="stack__card" style={{ '--i': '1', '--tint': '#E1ECD2' } as React.CSSProperties}>
            <div className="stack__num">2</div>
            <div>
              <h3>Order before cut-off.</h3>
              <p>
                Your delivery day and cut-off date are under the Delivery Day tab in your account. While an order says Open, you can still
                change it.
              </p>
              <Link className="link-arrow" href="/shop">
                Browse the shop{' '}
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
              </Link>
            </div>
            <div className="stack__img">
              <img src="/assets/icons/spiral-calendar.webp" alt="" width="170" height="170" loading="lazy" />
            </div>
          </article>
          <article className="stack__card" style={{ '--i': '2', '--tint': '#DCE7F6' } as React.CSSProperties}>
            <div className="stack__num">3</div>
            <div>
              <h3>Leave a cooler. Pay in cash.</h3>
              <p>
                We deliver from 11am to midnight. Put out an 11-quart cooler with ice and your cash, and we&apos;ll fill it. No card needed
                at checkout.
              </p>
              <Link className="link-arrow" href="/where-we-deliver#delivery-day">
                Delivery details{' '}
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
              </Link>
            </div>
            <div className="stack__img">
              <img src="/assets/icons/ice.webp" alt="" width="170" height="170" loading="lazy" />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export function Story() {
  return (
    <section className="section bg-cream2 curvy" aria-labelledby="story-title">
      <div className="container story">
        <div className="sunpic sunpic--photo" data-reveal="scale">
          <div className="sunpic__disc">
            <img
              className="sunpic__photo"
              src="/assets/img/cow-portrait-720.jpg"
              srcSet="/assets/img/cow-portrait-720.jpg 720w, /assets/img/cow-portrait-1200.jpg 1200w"
              sizes="(max-width: 900px) 84vw, 500px"
              width="720"
              height="720"
              alt="A brown and white cow looking up from the grass"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="sunpic__a">
            <img src="/assets/icons/glass-of-milk.webp" alt="" width="120" height="120" loading="lazy" />
          </div>
          <div className="sunpic__b">
            <img src="/assets/icons/butter.webp" alt="" width="100" height="100" loading="lazy" />
          </div>
        </div>
        <div>
          <span className="eyebrow" data-reveal="">
            <img src="/assets/icons/house-with-garden.webp" alt="" width="20" height="20" />
            Our story
          </span>
          <h2 id="story-title" data-reveal="" style={{ fontSize: 'clamp(2.8rem,6vw,5rem)', margin: '18px 0 22px' }}>
            Kathy&apos;s
            <br />
            <em>Guernseys.</em>
          </h2>
          <p className="pull" data-reveal="">
            Guernsey milk is rare. So Kathy started her own herd.
          </p>
          <p className="muted" data-reveal="">
            Guernsey milk is golden from beta-carotene, naturally A2/A2, and rich in protein and butterfat. It&apos;s the only farm like it
            we know of on the East Coast, apart from one in Vermont.
          </p>
          <p className="muted" data-reveal="">
            Everything else comes from small family farms, mostly non-Amish now, plus a few Amish families. They have room to rotate their
            pastures, and they farm without sprays.
          </p>
          <div className="btn-row" data-reveal="" style={{ marginTop: '28px' }}>
            <Link className="btn" href="/about-us">
              Read our story{' '}
              <svg
                className="arrow"
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
            </Link>{' '}
            <Link className="btn btn--ghost" href="/products/product_lists/gurnsey-dairy">
              Shop Guernsey dairy
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Family() {
  return (
    <section className="section" aria-labelledby="family-title">
      <div className="container family">
        <figure className="polaroid" data-reveal="scale">
          <span className="polaroid__tape" aria-hidden="true" />{' '}
          <img
            className="polaroid__photo"
            src="/assets/img/family-daughter.jpg"
            alt="Gina and Moaz's daughter, laughing in a red winter hat"
            width="788"
            height="1066"
            loading="lazy"
            decoding="async"
          />
          <figcaption>The next generation</figcaption>
          <img className="polaroid__sticker" src="/assets/icons/sunflower.webp" alt="" width="92" height="92" loading="lazy" />
        </figure>
        <div>
          <span className="eyebrow" data-reveal="">
            <img src="/assets/icons/red-heart.webp" alt="" width="20" height="20" />
            The family behind it
          </span>
          <h2 id="family-title" data-reveal="" style={{ fontSize: 'clamp(2.8rem,6vw,5rem)', margin: '18px 0 22px' }}>
            A family
            <br />
            <em>business.</em>
          </h2>
          <p className="pull" data-reveal="">
            Udder Milk is Kathy, her daughter Gina, Gina&apos;s husband Moaz, <em>and their little one.</em>
          </p>
          <p className="muted" data-reveal="">
            Kathy found the farms and started the herd. Gina and Moaz were brave enough to bring it all online, and they blazed a trail
            other small farmers have since followed. Every order you place supports a family, and the small family farms behind them.
          </p>
          <div className="btn-row" data-reveal="" style={{ marginTop: '28px' }}>
            <Link className="btn" href="/about-us">
              Meet the family{' '}
              <svg
                className="arrow"
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
            </Link>{' '}
            <Link className="btn btn--ghost" href="/shop">
              Shop the farm
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Standards() {
  return (
    <section className="section" aria-labelledby="std-title">
      <div className="container">
        <div className="head head--center">
          <span className="eyebrow" data-reveal="">
            <img src="/assets/icons/four-leaf-clover.webp" alt="" width="20" height="20" />
            Our standards
          </span>
          <h2 id="std-title" data-reveal="">
            What never
            <br />
            <em>goes in.</em>
          </h2>
          <p className="lede" data-reveal="">
            If a farmer&apos;s quality slips and they won&apos;t fix it, we find another farmer. That goes for the butter, too.
          </p>
        </div>
        <div className="nopes" data-stagger="">
          <span className="nope" data-reveal="">
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </i>
            Pesticides
          </span>{' '}
          <span className="nope" data-reveal="">
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </i>
            Herbicides
          </span>{' '}
          <span className="nope" data-reveal="">
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </i>
            Fungicides
          </span>{' '}
          <span className="nope" data-reveal="">
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </i>
            Insecticides
          </span>{' '}
          <span className="nope" data-reveal="">
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </i>
            GMO seed
          </span>{' '}
          <span className="nope" data-reveal="">
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </i>
            Irradiation
          </span>{' '}
          <span className="nope" data-reveal="">
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </i>
            Antibiotics
          </span>{' '}
          <span className="nope" data-reveal="">
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </i>
            Hormones
          </span>{' '}
          <span className="nope" data-reveal="">
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </i>
            Grain, for our dairy <span className="amp">&amp;</span> beef cows
          </span>{' '}
          <span className="nope nope--yes" data-reveal="">
            <i>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
            </i>
            Grass
          </span>{' '}
          <span className="nope nope--yes" data-reveal="">
            <i>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
            </i>
            Sunshine
          </span>{' '}
          <span className="nope nope--yes" data-reveal="">
            <i>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
            </i>
            Room to roam
          </span>
        </div>
      </div>
    </section>
  )
}

export function HomeNews() {
  return (
    <section className="section" style={{ paddingTop: '0' }} aria-labelledby="news-title">
      <div className="container">
        <div className="head head--row">
          <div className="head" style={{ margin: '0' }}>
            <span className="eyebrow" data-reveal="">
              <img src="/assets/icons/newspaper.webp" alt="" width="20" height="20" />
              Farm news
            </span>
            <h2 id="news-title" data-reveal="">
              Fresh from
              <br />
              <em>the farm.</em>
            </h2>
          </div>
          <Link className="link-arrow" href="/news" data-reveal="">
            All farm news{' '}
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
          </Link>
        </div>
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
          <Link className="card" href="/sub-category/grass-fed-meats" style={{ '--tint': '#FBE1DC' } as React.CSSProperties} data-reveal="">
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
          </Link>
        </div>
      </div>
    </section>
  )
}

export function Cta() {
  return (
    <section className="section section--tight" style={{ paddingTop: '0' }}>
      <div className="container">
        <div className="band" data-reveal="scale">
          <div className="band__spots">
            <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g fill="#FBF5E6">
                <path d="M78 64c38-30 104-22 118 22 14 46-30 70-70 78-44 8-86-16-88-50-1-20 18-38 40-50z" />
                <path d="M318 22c30-12 70 4 70 34s-34 44-62 40-46-26-40-46c4-14 16-22 32-28z" />
                <path d="M592 70c52-28 132-8 140 46 8 52-54 86-110 80-60-6-90-44-76-82 8-20 24-34 46-44z" />
                <path d="M168 286c26-22 76-16 86 16 10 34-22 58-60 60-38 2-62-20-56-44 3-14 14-24 30-32z" />
                <path d="M444 248c22-10 54 0 58 24 4 26-22 40-46 38-26-2-40-18-36-36 2-12 10-20 24-26z" />
                <path d="M688 300c30-14 72-2 76 30 4 30-30 50-62 46-32-4-48-26-40-46 4-14 12-24 26-30z" />
              </g>
            </svg>
          </div>
          <div>
            <h2>
              Not a member
              <br />
              <em>yet?</em>
            </h2>
            <p>Sign up, and get raw, grass-fed dairy and good farm food at your door, 12–24 hours after milking.</p>
            <div className="btn-row" style={{ marginTop: '28px' }}>
              <Link className="btn btn--butter" href="/signup">
                Sign up{' '}
                <svg
                  className="arrow"
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
              </Link>{' '}
              <Link className="btn btn--milk" href="/login">
                I&apos;m a member, log in
              </Link>
            </div>
          </div>
          <div className="band__img">
            <img src="/assets/icons/brown-cow-face.webp" alt="" width="180" height="180" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}
