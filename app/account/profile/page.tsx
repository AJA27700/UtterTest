import type { Metadata } from 'next'
import { RequireLogin } from '@/components/auth'
import { AccountShell } from '@/components/account'
import ProfileView from './ProfileView'

export const metadata: Metadata = { title: 'My profile', robots: { index: false } }
export default function Page() { return <RequireLogin what="see your profile"><AccountShell><ProfileView /></AccountShell></RequireLogin> }
