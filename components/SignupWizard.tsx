'use client'
// Sign up in four steps, like the new site (front.uddermilk.com/register):
// 1 Personal info · 2 Address · 3 Password · 4 Sign the agreement.
// Field names match the backend's register form (firstName, primaryPhone, streetNo, appartmentName,
// signatureImage ...), so connecting it is a straight pass-through.
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from './auth'
import { Arrow, Check } from './icons'

type Data = {
  firstName: string; lastName: string; primaryPhone: string; secondaryPhone: string; email: string
  streetNo: string; appartmentName: string; street_address: string; city: string; state: string; zip: string; mapConfirmed: boolean
  password: string; confirmPassword: string
  agreeTermsPolicy: boolean; agreeAgreement: boolean; smsConsent: boolean; signatureImage: string
}
const EMPTY: Data = {
  firstName: '', lastName: '', primaryPhone: '', secondaryPhone: '', email: '',
  streetNo: '', appartmentName: '', street_address: '', city: '', state: '', zip: '', mapConfirmed: false,
  password: '', confirmPassword: '',
  agreeTermsPolicy: false, agreeAgreement: false, smsConsent: false, signatureImage: '',
}
const STEPS = ['Personal info', 'Address', 'Password', 'Sign the agreement']
const digits = (s: string) => s.replace(/\D/g, '')

function validate(step: number, d: Data) {
  const e: Partial<Record<keyof Data, string>> = {}
  if (step === 1) {
    if (!d.firstName.trim()) e.firstName = 'First name is required.'
    if (!d.lastName.trim()) e.lastName = 'Last name is required.'
    if (!d.primaryPhone.trim()) e.primaryPhone = 'Primary phone is required.'
    else if (digits(d.primaryPhone).length !== 10) e.primaryPhone = 'Enter a valid phone number (10 digits, e.g. (555) 123-4567).'
    if (d.secondaryPhone.trim() && digits(d.secondaryPhone).length !== 10) e.secondaryPhone = 'Enter a valid phone number (10 digits).'
    if (!d.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = 'Enter a valid email address.'
  }
  if (step === 2) {
    if (!d.streetNo.trim()) e.streetNo = 'Street number is required.'
    if (!d.street_address.trim()) e.street_address = 'Street is required.'
    if (!d.city.trim()) e.city = 'City is required.'
    if (!/^[A-Za-z]{2}$/.test(d.state.trim())) e.state = 'Use the 2-letter state, e.g. NY.'
    if (!/^\d{5}(-\d{4})?$/.test(d.zip.trim())) e.zip = 'Enter a 5-digit ZIP code.'
    if (!d.mapConfirmed) e.mapConfirmed = 'Please check the map and tick the box.'
  }
  if (step === 3) {
    if (!d.password) e.password = 'Password is required.'
    else if (d.password.length < 6) e.password = 'Use at least 6 characters.'
    if (!d.confirmPassword) e.confirmPassword = 'Please confirm your password.'
    else if (d.password !== d.confirmPassword) e.confirmPassword = "The two passwords don't match."
  }
  if (step === 4) {
    if (!d.agreeTermsPolicy) e.agreeTermsPolicy = 'Please agree to the terms and privacy policy.'
    if (!d.agreeAgreement) e.agreeAgreement = 'Please agree to the membership agreement.'
    if (!d.signatureImage) e.signatureImage = 'Please sign in the box.'
  }
  return e
}

// A box to sign in with a finger or mouse. Hands back the signature as a PNG data URL.
function SignaturePad({ value, onChange }: { value: string; onChange: (dataUrl: string) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const drawn = useRef(false)
  const report = useRef(onChange) // latest callback, without re-running the setup (which would wipe the drawing)
  const initial = useRef(value) // coming back to this step: show the signature already drawn
  useEffect(() => { report.current = onChange }, [onChange])
  useEffect(() => {
    const c = ref.current!
    const ratio = window.devicePixelRatio || 1
    const fit = () => {
      const r = c.getBoundingClientRect()
      c.width = r.width * ratio; c.height = r.height * ratio
      const ctx = c.getContext('2d')!
      ctx.scale(ratio, ratio); ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1F2E22'
    }
    fit()
    if (initial.current) {
      const img = new Image()
      img.onload = () => { const r = c.getBoundingClientRect(); c.getContext('2d')!.drawImage(img, 0, 0, r.width, r.height); drawn.current = true }
      img.src = initial.current
    }
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
    const down = (e: PointerEvent) => { drawing.current = true; c.setPointerCapture(e.pointerId); const [x, y] = pos(e); const ctx = c.getContext('2d')!; ctx.beginPath(); ctx.moveTo(x, y) }
    const move = (e: PointerEvent) => { if (!drawing.current) return; const [x, y] = pos(e); const ctx = c.getContext('2d')!; ctx.lineTo(x, y); ctx.stroke(); drawn.current = true }
    const up = () => { if (!drawing.current) return; drawing.current = false; if (drawn.current) report.current(c.toDataURL('image/png')) }
    c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move); c.addEventListener('pointerup', up); c.addEventListener('pointerleave', up)
    return () => { c.removeEventListener('pointerdown', down); c.removeEventListener('pointermove', move); c.removeEventListener('pointerup', up); c.removeEventListener('pointerleave', up) }
  }, [])
  const clear = () => {
    const c = ref.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height); drawn.current = false; report.current('')
  }
  return (
    <div className="sigpad">
      <canvas ref={ref} aria-label="Signature box: sign with your finger or mouse" />
      <div className="sigpad__bar"><span>Sign above</span><button type="button" onClick={clear}>Clear</button></div>
    </div>
  )
}

export default function SignupWizard() {
  const [step, setStep] = useState(1)
  const [d, setD] = useState<Data>(EMPTY)
  const [err, setErr] = useState<Partial<Record<keyof Data, string>>>({})
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState('')
  const top = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { refresh } = useAuth()

  const set = <K extends keyof Data>(k: K, v: Data[K]) => { setD((x) => ({ ...x, [k]: v })); setErr((x) => ({ ...x, [k]: undefined })); setNote('') }
  const text = (k: keyof Data) => ({ value: d[k] as string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value as never), 'aria-invalid': !!err[k] || undefined })
  const errOf = (k: keyof Data) => (err[k] ? <span className="field__err" role="alert">{err[k]}</span> : null)

  function go(n: number) {
    setStep(n)
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  function next() {
    const e = validate(step, d)
    setErr(e)
    if (Object.keys(e).length === 0) go(step + 1)
  }
  function openMap() {
    const q = `${d.streetNo} ${d.street_address}, ${d.city} ${d.state} ${d.zip}`.replace(/^[\s,]+|[\s,]+$/g, '')
    if (!q) { setErr((x) => ({ ...x, street_address: 'Type your address first.' })); return }
    window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q), '_blank', 'noopener')
  }
  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    if (step < 4) { next(); return }
    for (const s of [1, 2, 3, 4]) {
      const e = validate(s, d)
      if (Object.keys(e).length) { setErr(e); go(s); return }
    }
    setBusy(true); setNote('')
    try {
      const r = await fetch('/api/auth/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(d) })
      const data = await r.json().catch(() => ({}))
      if (!r.ok) { setNote(data.error || 'Registration failed. Please try again.'); return }
      if (data.pending) { setDone(data.message); return }
      await refresh()
      const nxt = new URLSearchParams(window.location.search).get('next')
      router.push(nxt && nxt.startsWith('/') && !nxt.startsWith('//') ? nxt : '/shop')
    } catch {
      setNote("Couldn't reach the server. Check your connection and try again.")
    } finally { setBusy(false) }
  }

  if (done) {
    return (
      <div className="form__note is-ok wizard__done" role="status">
        <b>Registration successful.</b> {done} <Link href="/login">Go to log in</Link>
      </div>
    )
  }
  return (
    <form className="form account__form wizard" noValidate onSubmit={submit} aria-busy={busy}>
      <div ref={top} className="wizard__top" />
      <ol className="om__steps wizard__steps" aria-label="Sign-up steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i + 1 === step ? 'is-on' : i + 1 < step ? 'is-done' : ''} aria-current={i + 1 === step ? 'step' : undefined}>
            <span>{i + 1 < step ? <Check /> : i + 1}</span>{s}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <fieldset>
          <legend>Personal info</legend>
          <div className="form__row">
            <div className="field"><label htmlFor="su-first">First name</label><input id="su-first" autoComplete="given-name" {...text('firstName')} />{errOf('firstName')}</div>
            <div className="field"><label htmlFor="su-last">Last name</label><input id="su-last" autoComplete="family-name" {...text('lastName')} />{errOf('lastName')}</div>
          </div>
          <div className="form__row">
            <div className="field"><label htmlFor="su-phone">Primary phone</label><input id="su-phone" type="tel" autoComplete="tel" placeholder="(555) 123-4567" {...text('primaryPhone')} />{errOf('primaryPhone')}</div>
            <div className="field"><label htmlFor="su-phone2">Secondary phone <span className="opt">optional</span></label><input id="su-phone2" type="tel" autoComplete="tel" {...text('secondaryPhone')} />{errOf('secondaryPhone')}</div>
          </div>
          <div className="field"><label htmlFor="su-email">Email address</label><input id="su-email" type="email" autoComplete="email" {...text('email')} />{errOf('email')}</div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend>Where we deliver to you</legend>
          <div className="form__row form__row--addr">
            <div className="field"><label htmlFor="su-number">Street number</label><input id="su-number" placeholder="e.g. 705" {...text('streetNo')} /><span className="field__hint">If your address is 705 Smith St, Clifton, just put 705.</span>{errOf('streetNo')}</div>
            <div className="field"><label htmlFor="su-apt">Apartment <span className="opt">optional</span></label><input id="su-apt" autoComplete="address-line2" placeholder="Apt 4B" {...text('appartmentName')} /></div>
          </div>
          <div className="field"><label htmlFor="su-address">Street</label><input id="su-address" autoComplete="address-line1" placeholder="Smith St" {...text('street_address')} />{errOf('street_address')}</div>
          <div className="form__row form__row--3">
            <div className="field"><label htmlFor="su-city">City</label><input id="su-city" autoComplete="address-level2" {...text('city')} />{errOf('city')}</div>
            <div className="field"><label htmlFor="su-state">State</label><input id="su-state" autoComplete="address-level1" maxLength={2} placeholder="NY" {...text('state')} />{errOf('state')}</div>
            <div className="field"><label htmlFor="su-zip">ZIP</label><input id="su-zip" autoComplete="postal-code" inputMode="numeric" maxLength={10} {...text('zip')} />{errOf('zip')}</div>
          </div>
          <div className="mapcheck">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/round-pushpin.webp" alt="" width="34" height="34" />
            <p>Check that the map shows your door, so the driver can find you, even late at night.</p>
            <button className="btn btn--ghost btn--sm" type="button" onClick={openMap}>Check on Google Maps</button>
          </div>
          <label className="check"><input type="checkbox" checked={d.mapConfirmed} onChange={(e) => set('mapConfirmed', e.target.checked)} /><span>I checked the map, and it shows my delivery location correctly.</span></label>
          {errOf('mapConfirmed')}
        </fieldset>
      )}

      {step === 3 && (
        <fieldset>
          <legend>Choose a password</legend>
          <div className="form__row">
            <div className="field"><label htmlFor="su-pass">Password</label><input id="su-pass" type="password" autoComplete="new-password" {...text('password')} /><span className="field__hint">At least 6 characters.</span>{errOf('password')}</div>
            <div className="field"><label htmlFor="su-pass2">Confirm password</label><input id="su-pass2" type="password" autoComplete="new-password" {...text('confirmPassword')} />{errOf('confirmPassword')}</div>
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <fieldset>
          <legend>Sign the agreement</legend>
          <label className="check"><input type="checkbox" checked={d.agreeTermsPolicy} onChange={(e) => set('agreeTermsPolicy', e.target.checked)} /><span>I agree to the <Link href="/terms-services" target="_blank">Terms of Service</Link> and <Link href="/privacy-policy" target="_blank">Privacy Policy</Link>.</span></label>
          {errOf('agreeTermsPolicy')}
          <label className="check"><input type="checkbox" checked={d.agreeAgreement} onChange={(e) => set('agreeAgreement', e.target.checked)} /><span>I agree to the Udder Milk Creamery Association membership agreement.</span></label>
          {errOf('agreeAgreement')}
          <label className="check"><input type="checkbox" checked={d.smsConsent} onChange={(e) => set('smsConsent', e.target.checked)} /><span>Text me promotional messages from UDDERMILK.COM. <span className="opt">optional</span></span></label>
          <div className="field">
            <span className="field__label">Your signature</span>
            <SignaturePad value={d.signatureImage} onChange={(v) => set('signatureImage', v)} />
            {errOf('signatureImage')}
          </div>
        </fieldset>
      )}

      {note && <p className="form__note" role="status">{note}</p>}
      <div className="wizard__nav">
        {step > 1 && <button className="btn btn--ghost" type="button" onClick={() => go(step - 1)}>Back</button>}
        <button className={`btn${step === 4 ? ' btn--butter' : ''}`} type="submit" disabled={busy}>
          {step < 4 ? <>Next <Arrow /></> : busy ? 'Creating your account…' : <>Create my account <Arrow /></>}
        </button>
      </div>
    </form>
  )
}
