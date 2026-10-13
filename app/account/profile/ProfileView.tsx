'use client'
// My personal details (new site: /edit-profile). Live: POST /user/update-profile
import { useState } from 'react'
import { useAuth } from '@/components/auth'
import { postJson } from '@/components/account'
import { Check } from '@/components/icons'

export default function ProfileView() {
  const { member, refresh } = useAuth()
  const [f, setF] = useState(() => ({ firstName: member?.firstName ?? '', lastName: member?.lastName ?? '', phone: member?.phone ?? '', phone2: member?.phone2 ?? '', email: member?.email ?? '' }))
  const [note, setNote] = useState<{ ok?: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const field = (k: keyof typeof f) => ({ value: f[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: e.target.value }); setNote(null) } })
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true)
    try { await postJson('/api/account/profile', f); await refresh(); setNote({ ok: true, text: 'Saved. Your details are updated.' }) }
    catch (err) { setNote({ text: (err as Error).message }) } finally { setBusy(false) }
  }
  return (
    <>
      <header className="acct__head"><h1>My personal <em>details.</em></h1></header>
      <form className="om__card form acct__form" onSubmit={save} noValidate>
        <div className="form__row">
          <div className="field"><label htmlFor="pf-first">First name</label><input id="pf-first" autoComplete="given-name" {...field('firstName')} /></div>
          <div className="field"><label htmlFor="pf-last">Last name</label><input id="pf-last" autoComplete="family-name" {...field('lastName')} /></div>
        </div>
        <div className="form__row">
          <div className="field"><label htmlFor="pf-phone">Primary phone</label><input id="pf-phone" type="tel" autoComplete="tel" placeholder="(555) 123-4567" {...field('phone')} /></div>
          <div className="field"><label htmlFor="pf-phone2">Secondary phone <span className="opt">optional</span></label><input id="pf-phone2" type="tel" {...field('phone2')} /></div>
        </div>
        <div className="field"><label htmlFor="pf-email">Email address</label><input id="pf-email" type="email" autoComplete="email" {...field('email')} /></div>
        {note && <p className={`form__note${note.ok ? ' is-ok' : ''}`} role="status">{note.text}</p>}
        <div><button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : <>Save changes <Check /></>}</button></div>
      </form>
    </>
  )
}
