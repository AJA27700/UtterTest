import type { Metadata } from 'next'
import ForgotPassword from '@/components/content/forgot-password'

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset the password for your Udder Milk member account.',
  robots: { index: false },
}

export default function Page() {
  return (
    <>
      <ForgotPassword />
    </>
  )
}
