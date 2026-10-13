import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import WhereWeDeliver from '@/components/content/where-we-deliver'

export const metadata: Metadata = {
  title: 'Where we deliver · Pickup & delivery',
  description: 'The Udder Milk delivery map and areas, how delivery day works (11am–midnight, coolers, cash on delivery), order changes, returns and pickup.',
}

// The delivery map. Save it as public/assets/img/where-we-deliver.png to serve it from this site;
// until then it loads from the new site, where the farm keeps the current map.
const LOCAL_MAP = '/assets/img/where-we-deliver.png'
const REMOTE_MAP = 'https://front.uddermilk.com/assets/imgs/page/where_we_deliver.png'

export default function Page() {
  const local = fs.existsSync(path.join(process.cwd(), 'public', LOCAL_MAP))
  return <WhereWeDeliver mapSrc={local ? LOCAL_MAP : REMOTE_MAP} />
}
