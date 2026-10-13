import type { Metadata } from 'next'
import { RequireLogin } from '@/components/auth'
import { AccountShell } from '@/components/account'
import HistoryView from './HistoryView'

export const metadata: Metadata = { title: 'Order history', robots: { index: false } }
export default function Page() { return <RequireLogin what="see your orders"><AccountShell><HistoryView /></AccountShell></RequireLogin> }
