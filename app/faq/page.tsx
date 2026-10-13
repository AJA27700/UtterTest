import type { Metadata } from 'next'
import Faq from '@/components/content/faq'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers about membership, ordering, delivery, payment, returns and our products.',
}

export default function Page() {
  return (
    <>
      <Faq />
    </>
  )
}
