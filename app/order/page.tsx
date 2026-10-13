import type { Metadata } from 'next'
import { RequireLogin } from '@/components/auth'
import { Suspense } from 'react'
import OrderView from './OrderView'
export const metadata: Metadata = { title: 'Your order', robots: { index: false } }
// OrderView reads ?id= from the address, so it renders in the browser behind this boundary.
export default function Page() {
  return (
    <RequireLogin what="see your order">
      <Suspense fallback={<div className="om" style={{ minHeight: '60vh' }} />}>
        <OrderView />
      </Suspense>
    </RequireLogin>
  )
}
