import type { Metadata } from 'next'
import { RequireLogin } from '@/components/auth'
import { AccountShell } from '@/components/account'
import PasswordView from './PasswordView'

export const metadata: Metadata = { title: 'Change password', robots: { index: false } }
export default function Page() { return <RequireLogin what="change your password"><AccountShell><PasswordView /></AccountShell></RequireLogin> }
