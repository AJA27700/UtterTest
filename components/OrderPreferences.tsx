'use client'
// "Order Preferences", as on the new site's checkout and edit-order pages:
// recurring order, delivery or pickup, delivery day (from the member's zone), pickup location, instructions.
// The choices come from GET /api/order/conditions (backend: /order/pre-checkout/conditions).
import type { CheckoutConditions } from '@/lib/types'
import { money } from '@/lib/format'

export type Prefs = { recurring: boolean; method: 'delivery' | 'pickup'; deliveryDay: string; pickupLocationId: string; note: string }
export type PrefErrors = { deliveryDay?: string; pickupLocationId?: string }

export function checkPrefs(p: Prefs): PrefErrors {
  const e: PrefErrors = {}
  if (p.method === 'delivery' && !p.deliveryDay) e.deliveryDay = 'Please select a delivery day'
  if (p.method === 'pickup' && !p.pickupLocationId) e.pickupLocationId = 'Please select a pick up location'
  return e
}

export default function OrderPreferences({ c, p, onChange, errors }: { c: CheckoutConditions | null; p: Prefs; onChange: (p: Prefs) => void; errors: PrefErrors }) {
  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => onChange({ ...p, [k]: v })
  const zone = c?.zone
  return (
    <div className="prefs">
      {zone && (
        <dl className="prefs__zone">
          <div><dt>My zone</dt><dd>{zone.name}</dd></div>
          <div><dt>Cut-off day</dt><dd>{zone.cutOffDay}</dd></div>
          <div><dt>Delivery day</dt><dd>{zone.deliveryDays.join(', ')}</dd></div>
        </dl>
      )}
      <label className="check prefs__rec">
        <input type="checkbox" checked={p.recurring} onChange={(e) => set('recurring', e.target.checked)} />
        <span><b>Make it a recurring order</b><small>The same order every delivery day, until you change or cancel it.</small></span>
      </label>
      <div className="field">
        <label htmlFor="pf-method">Delivery settings</label>
        <select id="pf-method" value={p.method} onChange={(e) => onChange({ ...p, method: e.target.value as Prefs['method'] })}>
          <option value="delivery">Delivery{c && c.deliveryFee ? ` (${money(c.deliveryFee)} fee)` : ''}</option>
          <option value="pickup">Pick up location</option>
        </select>
      </div>
      {p.method === 'delivery' ? (
        <div className="field">
          <label htmlFor="pf-day">Select delivery day</label>
          <select id="pf-day" value={p.deliveryDay} onChange={(e) => set('deliveryDay', e.target.value)} aria-invalid={!!errors.deliveryDay || undefined}>
            <option value="">Select day</option>
            {zone?.deliveryDays.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.deliveryDay && <span className="field__err" role="alert">{errors.deliveryDay}</span>}
          <span className="field__hint">We deliver 11am to midnight. Leave a cooler with ice if you won&apos;t be home.</span>
        </div>
      ) : (
        <div className="field">
          <label htmlFor="pf-loc">Pick up location</label>
          <select id="pf-loc" value={p.pickupLocationId} onChange={(e) => set('pickupLocationId', e.target.value)} aria-invalid={!!errors.pickupLocationId || undefined}>
            <option value="">Select location</option>
            {c?.pickupLocations.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
          </select>
          {errors.pickupLocationId && <span className="field__err" role="alert">{errors.pickupLocationId}</span>}
        </div>
      )}
      <div className="field">
        <label htmlFor="pf-note">Additional instructions <span className="opt">optional</span></label>
        <textarea id="pf-note" rows={3} value={p.note} onChange={(e) => set('note', e.target.value)} placeholder="Where's your cooler? Door code? Anything we should know?" />
      </div>
    </div>
  )
}
