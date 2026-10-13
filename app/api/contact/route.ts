// POST /api/contact  { name, email, topic?, zone?, message }
// With UDDERMILK_API_URL set, the message goes to the backend's POST /contact (which emails the farm).
// Without it (preview), it's checked and logged on the server, and nothing is sent.
const API = process.env.UDDERMILK_API_URL

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, string | undefined>
  const name = b.name?.trim(), email = b.email?.trim(), message = b.message?.trim()
  if (!name || !email || !message) return Response.json({ error: 'Please add your name, email and a message.' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'That email address doesn\'t look right.' }, { status: 400 })
  if (message.length > 5000) return Response.json({ error: 'That message is too long. Please keep it under 5,000 characters.' }, { status: 400 })
  const payload = { name, email, topic: b.topic?.trim() ?? '', zone: b.zone?.trim() ?? '', message }
  if (!API) {
    console.log('[contact form, preview: not sent]', payload)
    return Response.json({ ok: true, preview: true })
  }
  const r = await fetch(`${API}/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
  if (!r.ok) return Response.json({ error: 'The message didn\'t go through. Please call or text 973-413-9585.' }, { status: 502 })
  return Response.json({ ok: true })
}
