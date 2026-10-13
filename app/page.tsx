import { getBackInStock, getCatalog, getNewArrivals } from '@/lib/api'
import { homeJsonLd } from '@/lib/home-jsonld'
import { getAnnouncements } from '@/lib/announcements'
import { Cta, Facts, Family, Fresh, Hero, HomeNews, Join, Marquee, Standards, Story } from '@/components/content/home'
import { Picks, Tiles } from '@/components/HomeData'
import WhatsNew from '@/components/WhatsNew'

// The homepage. Sections are ported from the static site (components/content/home.tsx), except
// "What's new" (newest and restocked products, from the backend), the featured picks and the category
// tiles, which read live prices and stock from the catalogue.
export default async function Home() {
  const [catalog, added, restocked] = await Promise.all([getCatalog(), getNewArrivals(8), getBackInStock(8)])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd).replace(/</g, '\\u003c') }} />
      <Hero announcements={getAnnouncements()} />
      <Facts />
      <Marquee />
      <WhatsNew added={added} restocked={restocked} />
      <Picks catalog={catalog} />
      <Fresh />
      <Join />
      <Tiles catalog={catalog} />
      <Story />
      <Family />
      <Standards />
      <HomeNews />
      <Cta />
    </>
  )
}
