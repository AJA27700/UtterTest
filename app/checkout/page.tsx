import type { Metadata } from 'next'
import { RequireLogin } from '@/components/auth'
import CheckoutView from './CheckoutView'
export const metadata: Metadata = { title: 'Check out', robots: { index: false } }
export default function Page() {
  return (
    <RequireLogin what="check out">
      <CheckoutView />
    </RequireLogin>
  )
}
