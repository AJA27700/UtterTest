'use client'
// The log in and forgot-password forms. The fields are plain HTML (in components/content/*); this
// wraps them, checks them, and sends them to this app's /api/auth routes. Sign up has its own
// component (SignupWizard).
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from './auth'

type Kind = 'login' | 'forgot'
const ENDPOINT: Record<Kind, string> = { login: '/api/auth/login', forgot: '/api/auth/forgot' }
const REMEMBER = 'um_login_email' // "Remember me" keeps the email filled in, as on the new site

export default function AccountForm({ kind, className, children }: { kind: string; className?: string; children: React.ReactNode }) {
  const k = kind as Kind
  const ref = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const { refresh } = useAuth()
  const [note, setNote] = useState<{ text: string; ok?: boolean } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const f = ref.current
    if (!f) return
    const offs: (() => void)[] = []
    if (k === 'login') {
      try {
        const saved = localStorage.getItem(REMEMBER)
        const email = f.querySelector<HTMLInputElement>('[name="email"]'), box = f.querySelector<HTMLInputElement>('[name="remember"]')
        if (saved && email && !email.value) { email.value = saved; if (box) box.checked = true }
      } catch {}
    }
    // "confirm email" and "confirm password" must match
    const pair = (a: string, b: string, msg: string) => {
      const x = f.querySelector<HTMLInputElement>(`[name="${a}"]`), y = f.querySelector<HTMLInputElement>(`[name="${b}"]`)
      if (!x || !y) return
      const check = () => y.setCustomValidity(y.value && x.value !== y.value ? msg : '')
      x.addEventListener('input', check); y.addEventListener('input', check)
      offs.push(() => { x.removeEventListener('input', check); y.removeEventListener('input', check) })
    }
    pair('email', 'email_confirm', "The two email addresses don't match.")
    pair('password', 'password_confirm', "The two passwords don't match.")
    // "Check on Google Maps"
    const map = f.querySelector<HTMLButtonElement>('[data-mapcheck]')
    const openMap = () => {
      const num = f.querySelector<HTMLInputElement>('[name="street_number"]')?.value ?? ''
      const addr = f.querySelector<HTMLInputElement>('[name="address"]')
      const q = `${num} ${addr?.value ?? ''}`.trim()
      if (!q) { addr?.focus(); addr?.reportValidity(); return }
      window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q), '_blank', 'noopener')
    }
    map?.addEventListener('click', openMap)
    offs.push(() => map?.removeEventListener('click', openMap))
    return () => offs.forEach((off) => off())
  }, [k])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    if (!f.checkValidity()) { f.reportValidity(); return }
    const body: Record<string, string> = Object.fromEntries([...new FormData(f).entries()].map(([key, v]) => [key, String(v)]))
    setBusy(true); setNote(null)
    try {
      const r = await fetch(ENDPOINT[k], { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const data = await r.json().catch(() => ({}))
      if (!r.ok) { setNote({ text: data.error || 'Something went wrong. Please try again.' }); return }
      if (k === 'forgot') { setNote({ ok: true, text: "If there's an account with that email, a reset link is on its way. Check your inbox (and spam)." }); f.reset(); return }
      try { if (body.remember) localStorage.setItem(REMEMBER, body.email); else localStorage.removeItem(REMEMBER) } catch {}
      await refresh()
      const next = new URLSearchParams(window.location.search).get('next')
      router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : '/account')
    } catch {
      setNote({ text: "Couldn't reach the server. Check your connection and try again." })
    } finally { setBusy(false) }
  }

  return (
    <form ref={ref} className={className} method="post" noValidate onSubmit={submit} aria-busy={busy}>
      {children}
      {note && <p className={`form__note${note.ok ? ' is-ok' : ''}`} role="status">{note.text}</p>}
      {k === 'login' && (
        <p className="om__fine">Preview: log in with <b>demo@uddermilk.test</b> / <b>udder-demo</b>, or sign up for a new account.</p>
      )}
    </form>
  )
}
