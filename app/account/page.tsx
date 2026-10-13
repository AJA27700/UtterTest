import type { Metadata } from 'next'
import { RequireLogin } from '@/components/auth'
import { AccountShell } from '@/components/account'
import DashboardView from './DashboardView'

export const metadata: Metadata = { title: 'My account', robots: { index: false } }
export default function Page() { return <RequireLogin what="see your account"><AccountShell><DashboardView /></AccountShell></RequireLogin> }
