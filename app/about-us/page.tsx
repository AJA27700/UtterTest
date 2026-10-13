import type { Metadata } from 'next'
import AboutUs from '@/components/content/about-us'

export const metadata: Metadata = {
  title: 'About us',
  description: 'Real milk, real farmers, and food brought to you fresh. Why Udder Milk exists, our farmers and practices, and the standards we keep.',
}

export default function Page() {
  return (
    <>
      <AboutUs />
    </>
  )
}
