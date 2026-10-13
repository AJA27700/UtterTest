import type { Metadata } from 'next'
import PrivacyPolicy from '@/components/content/privacy-policy'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Udder Milk Creamery Association collects and uses member information.',
}

export default function Page() {
  return (
    <>
      <PrivacyPolicy />
    </>
  )
}
