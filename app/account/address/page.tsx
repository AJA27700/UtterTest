import type { Metadata } from 'next'
import { RequireLogin } from '@/components/auth'
import { AccountShell } from '@/components/account'
import AddressView from './AddressView'

export const metadata: Metadata = { title: 'My address', robots: { index: false } }
export default function Page() { return <RequireLogin what="see your address"><AccountShell><AddressView /></AccountShell></RequireLogin> }
