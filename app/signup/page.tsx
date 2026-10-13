import type { Metadata } from 'next'
import Signup from '@/components/content/signup'

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Become a member of Udder Milk Creamery Association and get raw, grass-fed farm food delivered.',
}

export default function Page() {
  return (
    <>
      <Signup />
    </>
  )
}
