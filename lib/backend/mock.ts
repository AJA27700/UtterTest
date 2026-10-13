// The stand-in backend: members, sessions, zones and orders in memory, so every page works without
// the real API. It resets when the server restarts. Used when UDDERMILK_API_URL is not set.
import 'server-only'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { Address, CartItem, Member, Order, PickupLocation, Zone } from '../types'
import type { Backend, OrderPatch } from './types'
import { settle } from './settle'

/* ---------- sample zones, looked up by ZIP code. The real zones come from the backend. ---------- */
type ZoneRule = { test: (zip: string, state: string) => boolean; zone: Zone }
const ZONES: ZoneRule[] = [
  { test: (z) => /^11[2]/.test(z), zone: { name: '12', cutOffDay: 'Monday', deliveryDays: ['Wednesday', 'Saturday'], deliveryFee: 5, minimumTotal: 40 } }, // Brooklyn
  { test: (z) => /^10[0-4]/.test(z), zone: { name: '14', cutOffDay: 'Sunday', deliveryDays: ['Tuesday'], deliveryFee: 5, minimumTotal: 50 } }, // Manhattan, Bronx
  { test: (z) => /^11[013-6]/.test(z), zone: { name: '20', cutOffDay: 'Tuesday', deliveryDays: ['Thursday'], deliveryFee: 7, minimumTotal: 50 } }, // Queens, Long Island
  { test: (z, s) => /^07/.test(z) || s === 'NJ' && /^07/.test(z), zone: { name: '50', cutOffDay: 'Monday', deliveryDays: ['Wednesday'], deliveryFee: 5, minimumTotal: 40 } }, // North Jersey
  { test: (z) => /^08/.test(z), zone: { name: '52', cutOffDay: 'Wednesday', deliveryDays: ['Friday'], deliveryFee: 7, minimumTotal: 50 } }, // South Jersey
  { test: (z) => /^1[5-9]/.test(z), zone: { name: '3', cutOffDay: 'Thursday', deliveryDays: ['Saturday'], deliveryFee: 0, minimumTotal: 30 } }, // Pennsylvania
]
export const zoneFor = (a: Address | null): Zone | null => {
  if (!a) return null
  const zip = a.zip.replace(/\D/g, '').slice(0, 5)
  return ZONES.find((r) => r.test(zip, a.state.trim().toUpperCase()))?.zone ?? null
}
const PICKUP: PickupLocation[] = [
  { id: 'p1', title: 'Sample pickup location 1' },
  { id: 'p2', title: 'Sample pickup location 2' },
]

/* ---------- members and sessions ---------- */
type Stored = Member & { hash: string }
const members = new Map<string, Stored>() // email -> member
const sessions = new Map<string, string>() // token -> email

const hash = (pw: string) => { const salt = randomBytes(16).toString('hex'); return salt + ':' + scryptSync(pw, salt, 32).toString('hex') }
const verify = (pw: string, stored: string) => { const [salt, h] = stored.split(':'); return timingSafeEqual(Buffer.from(h, 'hex'), scryptSync(pw, salt, 32)) }
const pub = (m: Stored): Member => { const { hash: _h, ...rest } = m; void _h; return rest }
const withZone = (m: Stored) => {
  m.zone = zoneFor(m.address)
  if (!m.zone) m.deliveryDay = ''
  else if (!m.zone.deliveryDays.includes(m.deliveryDay)) m.deliveryDay = m.zone.deliveryDays[0]
  return m
}

export const DEMO = { email: 'demo@uddermilk.test', password: 'udder-demo' }
function seed() {
  if (members.size) return
  members.set(DEMO.email, withZone({
    id: 'm-demo', firstName: 'Demo', lastName: 'Member', email: DEMO.email, phone: '(973) 555-0100', phone2: '',
    address: { streetNo: '210', street: 'Grand St', apt: '', city: 'Brooklyn', state: 'NY', zip: '11211', country: 'USA' },
    zone: null, deliveryDay: 'Wednesday', hash: hash(DEMO.password),
  }))
}
const newToken = (email: string) => { const t = randomBytes(24).toString('hex'); sessions.set(t, email); return t }
const byToken = (token: string) => { seed(); const e = sessions.get(token); return e ? members.get(e) ?? null : null }

/* ---------- orders ---------- */
const db = new Map<string, Order[]>() // member id -> orders, newest first
const today = () => new Date().toISOString().slice(0, 10)
function samples(): Order[] {
  const milk: CartItem = { key: 'raw-cow-milk|Jersey 6.3% A2/A2 · gallon', name: 'Raw Cow Milk', variant: 'Jersey 6.3% A2/A2 · gallon', price: 11, qty: 2, url: '/category/cow-dairy#raw-cow-milk', img: null, icon: 'glass-of-milk' }
  const eggs: CartItem = { key: 'heritage-eggs|Dozen', name: 'Heritage Eggs', variant: 'Dozen', price: 9, qty: 1, url: '/category/eggs#heritage-eggs', img: null, icon: 'egg' }
  const butter: CartItem = { key: 'raw-grass-fed-butter|Guernsey unsalted · pint', name: 'Raw Grass-Fed Butter', variant: 'Guernsey unsalted · pint', price: 22, qty: 1, url: '/category/cow-dairy#raw-grass-fed-butter', img: null, icon: 'butter' }
  const base = { method: 'delivery' as const, deliveryDay: 'Wednesday', deliveryFee: 5, note: '', sample: true }
  return [
    { ...base, id: 'UM-20417', status: 'delivered', placed: '2026-09-29', recurring: true, items: [milk, eggs, butter], note: 'Cooler on the back porch.' },
    { ...base, id: 'UM-20288', status: 'delivered', placed: '2026-09-15', recurring: false, items: [eggs, butter] },
    { ...base, id: 'UM-20101', status: 'canceled', placed: '2026-09-01', recurring: false, items: [milk] },
  ]
}
const ordersOf = (id: string) => { if (!db.has(id)) db.set(id, id === 'm-demo' ? samples() : []); return db.get(id)! }
const editable = (o: Order) => !o.sample && (o.status === 'open' || (o.recurring && o.status !== 'canceled' && o.status !== 'delivered'))
const conditionsFor = (m: Member) => ({ zone: m.zone, pickupLocations: PICKUP, deliveryFee: m.zone?.deliveryFee ?? 0 })

export const mock: Backend = {
  name: 'stand-in',

  async login(email, password) {
    seed()
    const m = members.get(email.trim().toLowerCase())
    if (!m || !verify(password, m.hash)) return { error: "That email and password don't match an account." }
    return { token: newToken(m.email), member: pub(m) }
  },

  async signup(i) {
    seed()
    const email = i.email.trim().toLowerCase()
    if (members.has(email)) return { error: "There's already an account with that email. Try logging in." }
    const m = withZone({
      id: 'm-' + randomBytes(6).toString('hex'), firstName: i.firstName.trim(), lastName: i.lastName.trim(), email,
      phone: i.primaryPhone.trim(), phone2: (i.secondaryPhone ?? '').trim(),
      address: { streetNo: i.streetNo.trim(), street: i.street_address.trim(), apt: (i.appartmentName ?? '').trim(), city: i.city.trim(), state: i.state.trim().toUpperCase(), zip: i.zip.trim(), country: 'USA' },
      zone: null, deliveryDay: '', hash: hash(i.password),
    })
    members.set(email, m)
    return { token: newToken(email), member: pub(m) }
  },

  async me(token) { const m = byToken(token); return m ? pub(m) : null },
  async logout(token) { sessions.delete(token) },
  async forgotPassword() { /* the real backend emails a reset link; same answer whether or not the account exists */ },

  async updateProfile(token, p) {
    const m = byToken(token)
    if (!m) return { error: 'Please log in again.', status: 401 }
    const email = p.email.trim().toLowerCase()
    if (email !== m.email) {
      if (members.has(email)) return { error: 'Another account already uses that email.' }
      const old = m.email
      members.delete(old); m.email = email; members.set(email, m)
      for (const [t, e] of sessions) if (e === old) sessions.set(t, email)
    }
    Object.assign(m, { firstName: p.firstName.trim(), lastName: p.lastName.trim(), phone: p.phone.trim(), phone2: p.phone2.trim() })
    return pub(m)
  },

  async updateAddress(token, a) {
    const m = byToken(token)
    if (!m) return { error: 'Please log in again.', status: 401 }
    m.address = { ...a, state: a.state.trim().toUpperCase(), country: a.country || 'USA' }
    return pub(withZone(m))
  },

  async updatePassword(token, current, next) {
    const m = byToken(token)
    if (!m) return { error: 'Please log in again.', status: 401 }
    if (!verify(current, m.hash)) return { error: 'Your current password is not right.' }
    m.hash = hash(next)
    return { ok: true }
  },


  async conditions(token) {
    const m = byToken(token)
    return m ? conditionsFor(m) : { error: 'Please log in again.', status: 401 }
  },

  async listOrders(token, page) {
    const m = byToken(token)
    if (!m) return { error: 'Please log in again.', status: 401 }
    const all = ordersOf(m.id).map((o) => ({ ...o, editable: editable(o) }))
    const per = 10, pages = Math.max(1, Math.ceil(all.length / per)), p = Math.min(Math.max(1, page), pages)
    return { orders: all.slice((p - 1) * per, p * per), total: all.length, page: p, pages }
  },

  async getOrder(token, id) {
    const m = byToken(token)
    const o = m ? ordersOf(m.id).find((x) => x.id === id) : undefined
    return o ? { ...o, editable: editable(o) } : null
  },

  async placeOrder(token, input) {
    const m = byToken(token)
    if (!m) return { error: 'Please log in again.', status: 401 }
    const s = await settle(conditionsFor(m), input)
    if ('error' in s) return { error: s.error }
    const all = ordersOf(m.id)
    let id = ''
    do id = 'UM-' + (20500 + Math.floor(Math.random() * 9000))
    while (all.some((o) => o.id === id))
    const order: Order = { id, status: 'open', placed: today(), method: input.method === 'pickup' ? 'pickup' : 'delivery', recurring: !!input.recurring, note: (input.note ?? '').slice(0, 1000), items: s.items, deliveryDay: s.deliveryDay, pickupLocation: s.pickupLocation, deliveryFee: s.deliveryFee }
    all.unshift(order)
    return { ...order, editable: true }
  },

  async updateOrder(token, id, patch: OrderPatch) {
    const m = byToken(token)
    if (!m) return { error: 'Please log in again.', status: 401 }
    const o = ordersOf(m.id).find((x) => x.id === id)
    if (!o) return { error: 'Not found', status: 404 }
    if (!editable(o)) return { error: 'This order is locked and can no longer be changed online.', status: 409 }
    if (patch.status === 'canceled' || (patch.items && patch.items.length === 0)) { o.status = 'canceled'; return { ...o, editable: false } }
    const next = {
      items: patch.items ?? o.items.map((i) => ({ key: i.key, qty: i.qty })),
      method: patch.method ?? o.method,
      deliveryDay: patch.deliveryDay ?? o.deliveryDay,
      pickupLocationId: patch.pickupLocationId ?? o.pickupLocation?.id,
    }
    const s = await settle(conditionsFor(m), next)
    if ('error' in s) return { error: s.error, status: 400 }
    Object.assign(o, { items: s.items, deliveryDay: s.deliveryDay, pickupLocation: s.pickupLocation, deliveryFee: s.deliveryFee, method: next.method, recurring: patch.recurring ?? o.recurring, note: patch.note ?? o.note })
    if (next.method === 'pickup') delete o.deliveryDay
    else delete o.pickupLocation
    return { ...o, editable: editable(o) }
  },
}
