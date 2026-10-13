'use client'
// Delivery address + delivery day (new site: /my-address, /edit-address). Live: POST /user/update-address
// The zone, cut-off day and delivery day all follow from the address: change the address and they update.
import { useState } from 'react'
import { useAuth } from '@/components/auth'
import { postJson, ZoneCards } from '@/components/account'
import { Check } from '@/components/icons'
import type { Address, Member } from '@/lib/types'

const EMPTY: Address = { streetNo: '', street: '', apt: '', city: '', state: '', zip: '', country: 'USA' }

export default function AddressView() {
  const { member, refresh } = useAuth()
  const [editing, setEditing] = useState(!member?.address)
  const [a, setA] = useState<Address>(member?.address ?? EMPTY)
  const [note, setNote] = useState<{ ok?: boolean; text: string } | null>(null)
  const [dayNote, setDayNote] = useState<{ ok?: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  if (!member) return null
  const field = (k: keyof Address) => ({ value: a[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setA({ ...a, [k]: e.target.value }); setNote(null) } })

  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true)
    try {
      const { member: m } = (await postJson('/api/account/address', a)) as { member: Member }
      await refresh(); setEditing(false)
      setNote({ ok: true, text: m.zone ? `Saved. Your zone is ${m.zone.name}: order by ${m.zone.cutOffDay}, delivered ${m.deliveryDay}.` : `Saved. We don't deliver to ${m.address?.zip} yet, but you can still order for pickup.` })
    } catch (err) { setNote({ text: (err as Error).message }) } finally { setBusy(false) }
  }
  async function pickDay(day: string) {
    setDayNote(null)
    try { await postJson('/api/account/delivery-day', { day }); await refresh(); setDayNote({ ok: true, text: `Your orders now come on ${day}.` }) }
    catch (err) { setDayNote({ text: (err as Error).message }) }
  }
  const addr = member.address
  const days = member.zone?.deliveryDays ?? []
  return (
    <>
      <header className="acct__head acct__head--row">
        <div><h1>Delivery <em>address.</em></h1><p className="muted">Used for orders and delivery. Your zone and delivery day come from it.</p></div>
        {!editing && <button className="btn btn--sm btn--ghost" type="button" onClick={() => { setA(addr ?? EMPTY); setEditing(true); setNote(null) }}>{addr ? 'Edit address' : 'Add address'}</button>}
      </header>

      {editing ? (
        <form className="om__card form acct__form" onSubmit={save} noValidate>
          <div className="form__row form__row--addr">
            <div className="field"><label htmlFor="ad-no">Street no.</label><input id="ad-no" placeholder="705" {...field('streetNo')} /></div>
            <div className="field"><label htmlFor="ad-street">Street</label><input id="ad-street" autoComplete="address-line1" placeholder="Smith St" {...field('street')} /></div>
          </div>
          <div className="field"><label htmlFor="ad-apt">Apartment <span className="opt">optional</span></label><input id="ad-apt" autoComplete="address-line2" placeholder="Apt 4B" {...field('apt')} /></div>
          <div className="form__row form__row--3">
            <div className="field"><label htmlFor="ad-city">City</label><input id="ad-city" autoComplete="address-level2" {...field('city')} /></div>
            <div className="field"><label htmlFor="ad-state">State</label><input id="ad-state" autoComplete="address-level1" maxLength={2} placeholder="NY" {...field('state')} /></div>
            <div className="field"><label htmlFor="ad-zip">ZIP</label><input id="ad-zip" autoComplete="postal-code" inputMode="numeric" maxLength={10} {...field('zip')} /></div>
          </div>
          {note && <p className={`form__note${note.ok ? ' is-ok' : ''}`} role="status">{note.text}</p>}
          <div className="btn-row">
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : <>Save address <Check /></>}</button>
            {addr && <button className="btn btn--ghost" type="button" onClick={() => { setEditing(false); setNote(null) }}>Cancel</button>}
          </div>
        </form>
      ) : addr && (
        <div className="om__card addrcard">
          <dl>
            <div><dt>Street</dt><dd>{addr.streetNo} {addr.street}</dd></div>
            {addr.apt && <div><dt>Apartment</dt><dd>{addr.apt}</dd></div>}
            <div><dt>City</dt><dd>{addr.city}</dd></div>
            <div><dt>State</dt><dd>{addr.state}</dd></div>
            <div><dt>ZIP</dt><dd>{addr.zip}</dd></div>
            <div><dt>Country</dt><dd>{addr.country || 'USA'}</dd></div>
          </dl>
          {note && <p className={`form__note${note.ok ? ' is-ok' : ''}`} role="status">{note.text}</p>}
        </div>
      )}

      <section className="acct__section" aria-labelledby="dd-title">
        <h2 id="dd-title">Your delivery</h2>
        <ZoneCards m={member} />
        {member.zone && (
          days.length > 1 ? (
            <div className="om__card daypick">
              <p><b>Your zone delivers on {days.join(' and ')}.</b> Choose the day your orders come:</p>
              <div className="choice choice--sm" role="radiogroup" aria-label="Delivery day">
                {days.map((d) => (
                  <label key={d} className="choice__opt">
                    <input type="radio" name="dday" checked={member.deliveryDay === d} onChange={() => pickDay(d)} />
                    <span><b>{d}</b><small>11am to midnight</small></span>
                  </label>
                ))}
              </div>
              {dayNote && <p className={`form__note${dayNote.ok ? ' is-ok' : ''}`} role="status">{dayNote.text}</p>}
            </div>
          ) : (
            <p className="muted acct__sub">Your zone delivers on {days[0]}, 11am to midnight. Orders need to be in by {member.zone.cutOffDay}. To change your day, change your address or call 973-413-9585.</p>
          )
        )}
      </section>
    </>
  )
}
