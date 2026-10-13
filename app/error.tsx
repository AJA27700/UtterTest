'use client'
import Link from 'next/link'

// Shown if a page crashes (for example, the backend is down). "Try again" re-renders the page.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="page-hero">
      <div className="page-hero__inner">
        <h1>Something went <em>sideways.</em></h1>
        <p className="lede">This page couldn&apos;t load just now. Try again, or call or text 973-413-9585 if it keeps happening.</p>
        <div className="btn-row">
          <button className="btn" type="button" onClick={reset}>Try again</button>
          <Link className="btn btn--ghost" href="/">Back to the homepage</Link>
        </div>
      </div>
    </section>
  )
}
