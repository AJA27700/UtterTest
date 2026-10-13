'use client'
// Who's logged in, for the browser side. The session itself is an httpOnly cookie the browser can't
// read, so this asks the server (GET /api/auth/me) and keeps the answer in React state.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Member } from '@/lib/types'
import { iconUrl } from '@/lib/format'
import { Arrow } from './icons'

type Auth = { member: Member | null; ready: boolean; refresh: () => Promise<Member | null>; logout: () => Promise<void> }
const Ctx = createContext<Auth>({ member: null, ready: false, refresh: async () => null, logout: async () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null)
  const [ready, setReady] = useState(false)
  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/auth/me', { cache: 'no-store' })
      const { member } = (await r.json()) as { member: Member | null }
      setMember(member)
      return member
    } catch { return null } finally { setReady(true) }
  }, [])
  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setMember(null)
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- asks the server once, on load
  useEffect(() => { refresh() }, [refresh])
  return <Ctx.Provider value={{ member, ready, refresh, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)

// Wrap member-only pages (orders, checkout). Logged out: a log-in card instead of the page.
export function RequireLogin({ children, what = 'see your orders' }: { children: React.ReactNode; what?: string }) {
  const { member, ready } = useAuth()
  const path = usePathname()
  if (!ready) return <div className="om"><p className="muted" style={{ padding: 40 }}>Loading…</p></div>
  if (member) return <>{children}</>
  const next = encodeURIComponent(path + (typeof window !== 'undefined' ? window.location.search : ''))
  return (
    <div className="om">
      <div className="om__card om__gate">
        <div className="om__empty">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconUrl('bust-in-silhouette')} alt="" width={110} height={110} />
          <h2>Log in to {what}.</h2>
          <p className="muted">Udder Milk is a private members&apos; association, so ordering is for members. It takes a minute to join.</p>
          <div className="btn-row">
            <Link className="btn" href={`/login?next=${next}`}>Log in <Arrow /></Link>
            <Link className="btn btn--ghost" href={`/signup?next=${next}`}>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
