import type { Metadata } from 'next'
import News from '@/components/content/news'

export const metadata: Metadata = {
  title: 'News',
  description: "What's in season, what's back in stock, and what's new at Udder Milk.",
}

export default function Page() {
  return (
    <>
      <News />
    </>
  )
}
