'use client'
// Change password (new site: /change-password). Live: POST /user/update-password { password, npassword, cpassword }
import { useState } from 'react'
import { postJson } from '@/components/account'
import { Check } from '@/components/icons'

export default function PasswordView() {
  const [f, setF] = useState({ current: '', next: '', confirm: '' })
  const [note, setNote] = useState<{ ok?: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const field = (k: keyof typeof f) => ({ value: f[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: e.target.value }); setNote(null) } })
  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (f.next.length < 6) { setNote({ text: 'Use at least 6 characters for your new password.' }); return }
    if (f.next !== f.confirm) { setNote({ text: "The two new passwords don't match." }); return }
    setBusy(true)
    try { await postJson('/api/account/password', f); setF({ current: '', next: '', confirm: '' }); setNote({ ok: true, text: 'Done. Use your new password next time you log in.' }) }
    catch (err) { setNote({ text: (err as Error).message }) } finally { setBusy(false) }
  }
  return (
    <>
      <header className="acct__head"><h1>Change <em>password.</em></h1></header>
      <form className="om__card form acct__form" onSubmit={save} noValidate>
        <div className="field"><label htmlFor="pw-cur">Current password</label><input id="pw-cur" type="password" autoComplete="current-password" {...field('current')} /></div>
        <div className="form__row">
          <div className="field"><label htmlFor="pw-new">New password</label><input id="pw-new" type="password" autoComplete="new-password" {...field('next')} /><span className="field__hint">At least 6 characters.</span></div>
          <div className="field"><label htmlFor="pw-new2">Confirm new password</label><input id="pw-new2" type="password" autoComplete="new-password" {...field('confirm')} /></div>
        </div>
        {note && <p className={`form__note${note.ok ? ' is-ok' : ''}`} role="status">{note.text}</p>}
        <div><button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : <>Change password <Check /></>}</button></div>
      </form>
    </>
  )
}
