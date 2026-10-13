import 'server-only'
import { cookies } from 'next/headers'
import { backend } from './backend'

// Who's logged in. The session token (ours in the stand-in, the API's Bearer token when live) lives in an
// httpOnly cookie: page scripts can't read it, so a bad script on the page can't steal it.
export const SESSION_COOKIE = 'um_session'

export async function sessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value
}

// The member's chosen delivery day, when their zone has more than one. Their API has no endpoint for
// this, so it's kept in a cookie and applied here (checkout starts on it; the order carries the day).
export const DAY_COOKIE = 'um_day'

export async function currentSession() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  const member = await backend.me(token)
  if (!member) return null
  const day = jar.get(DAY_COOKIE)?.value
  if (day && member.zone?.deliveryDays.includes(day)) member.deliveryDay = day
  return { token, member: { ...member } }
}

export async function currentMember() {
  return (await currentSession())?.member ?? null
}

// remember = "Remember me": stay logged in for 30 days. Otherwise the cookie ends when the browser closes.
export async function setSession(token: string, remember = false) {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}) })
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE)
}

// For route handlers: the session, or a 401 answer.
export async function requireSession() {
  const s = await currentSession()
  return s ?? Response.json({ error: 'Please log in.' }, { status: 401 })
}
