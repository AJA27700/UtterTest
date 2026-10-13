import type { Metadata } from 'next'
import Login from '@/components/content/login'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Members log in here to order raw dairy, grass-fed meat and farm food for their next delivery day.',
  robots: { index: false },
}

export default function Page() {
  return (
    <>
      <Login />
    </>
  )
}
