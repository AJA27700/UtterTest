import type { Metadata } from 'next'
import TermsServices from '@/components/content/terms-services'

export const metadata: Metadata = {
  title: 'Terms of service',
  description: 'Membership, ordering, delivery and return terms for Udder Milk Creamery Association.',
}

export default function Page() {
  return (
    <>
      <TermsServices />
    </>
  )
}
