'use client'
// Contact form: posts to /api/contact (see app/api/contact/route.ts).
import { useState } from 'react'

export default function ContactForm({ className, children }: { className?: string; children: React.ReactNode }) {
  const [note, setNote] = useState<{ text: string; ok?: boolean } | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    if (!f.checkValidity()) { f.reportValidity(); return }
    const body = Object.fromEntries([...new FormData(f).entries()].map(([k, v]) => [k, String(v)]))
    setBusy(true); setNote(null)
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const data = await r.json().catch(() => ({}))
      if (!r.ok) { setNote({ text: data.error || 'Something went wrong. Please call or text 973-413-9585.' }); return }
      f.reset()
      setNote({ ok: true, text: data.preview ? `Thanks, ${body.name}. (Preview: the message was checked but not sent. Once the backend is connected, it goes straight to info@uddermilk.com.)` : `Thanks, ${body.name}. Your message is on its way, and we'll write back soon.` })
    } catch {
      setNote({ text: "Couldn't reach the server. Email info@uddermilk.com instead." })
    } finally { setBusy(false) }
  }

  return (
    <form className={className} noValidate onSubmit={submit} aria-busy={busy} data-reveal="">
      {children}
      {note && <p className={`form__note${note.ok ? ' is-ok' : ''}`} role="status">{note.text}</p>}
    </form>
  )
}
