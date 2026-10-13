import type { Metadata } from 'next'
import ContactUs from '@/components/content/contact-us'

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Call or text 973-413-9585, text 973-968-1391, or email info@uddermilk.com.',
}

export default function Page() {
  return (
    <>
      <ContactUs />
    </>
  )
}
