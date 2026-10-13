import type { Metadata } from 'next'
import { RequireLogin } from '@/components/auth'
import { Suspense } from 'react'
import EditView from './EditView'
export const metadata: Metadata = { title: 'View & edit order', robots: { index: false } }
export default function Page() {
  return (
    <RequireLogin what="change your order">
      <Suspense fallback={<div className="om" style={{ minHeight: '60vh' }} />}>
        <EditView />
      </Suspense>
    </RequireLogin>
  )
}
