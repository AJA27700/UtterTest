import type { Metadata } from 'next'
import Videos from '@/components/content/videos'

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Life on the farm, on film.',
}

export default function Page() {
  return (
    <>
      <Videos />
    </>
  )
}
