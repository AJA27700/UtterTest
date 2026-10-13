// Udder Milk's real API (https://test.uddermilk.com/api/v1). Endpoints and field names come from the
// new site's code (front.uddermilk.com). Used when UDDERMILK_API_URL is set.
import 'server-only'
import { getCatalog } from '../api'
import { call, dataOf, ApiError, IMG } from '../udder/client'
import { mapConditions, mapMember, mapOrderDetail, mapOrderRow } from '../udder/map'
import type { CheckoutConditions, Member, Order } from '../types'
import { formatAddress } from '../format'
import type { Backend, Fail } from './types'
import { failed } from './types'
import { settle } from './settle'

const fail = (e: unknown, fallback: string): Fail =>
  e instanceof ApiError ? { error: e.message || fallback, status: e.status === 401 ? 401 : e.status >= 500 ? 502 : 400 } : { error: fallback, status: 502 }

// GET /auth/validate on every request would be slow; remember each token's member for 30 seconds.
const seen = new Map<string, { at: number; member: Member | null }>()
const forget = (token: string) => seen.delete(token)

async function conditions(token: string): Promise<CheckoutConditions> {
  const r = await call<Record<string, unknown>>('/order/pre-checkout/conditions', { token })
  return mapConditions((r.zone ? r : dataOf(r)) as Parameters<typeof mapConditions>[0])
}

const userOf = (r: Record<string, unknown>) => (r.user ?? (r.data as Record<string, unknown>)?.user ?? r.data ?? r) as Record<string, unknown>
const tokenOf = (r: Record<string, unknown>) => (r.token ?? (r.data as Record<string, unknown>)?.token ?? r.accessToken ?? r.access_token) as string | undefined

export const live: Backend = {
  name: 'live',

  async login(email, password) {
    try {
      const r = await call('/auth/login', { body: { email: email.trim(), password } })
      const token = tokenOf(r)
      if (!token) return { error: 'Login failed. Please check your email and password.' }
      forget(token) // always fresh details on log in
      const member = (await live.me(token)) ?? mapMember(userOf(r))
      if (!member) return { error: 'Login failed. Please try again.' }
      return { token, member }
    } catch (e) { return fail(e, "That email and password don't match an account.") }
  },

  async signup(i) {
    try {
      await call('/user/sign-up', {
        body: {
          firstName: i.firstName, lastName: i.lastName, primaryPhone: i.primaryPhone, secondaryPhone: i.secondaryPhone ?? '', email: i.email,
          streetNo: i.streetNo, appartmentName: i.appartmentName ?? '', street_address: i.street_address, city: i.city, state: i.state, zip: i.zip,
          deliveryMapAddress: formatAddress({ streetNo: i.streetNo, street: i.street_address, city: i.city, state: i.state, zip: i.zip }),
          password: i.password, agreeTermsPolicy: i.agreeTermsPolicy, agreeAgreement: i.agreeAgreement, signatureImage: i.signatureImage, smsConsent: !!i.smsConsent,
        },
      })
    } catch (e) { return fail(e, 'Registration failed. Please check your details and try again.') }
    const r = await live.login(i.email, i.password)
    if (!failed(r)) return r
    return { pending: true, message: 'Your account is created. Once it is approved you can log in and order.' }
  },

  async me(token) {
    const hit = seen.get(token)
    if (hit && Date.now() - hit.at < 30_000) return hit.member
    let member: Member | null = null
    try {
      member = mapMember(userOf(await call('/auth/validate', { token })))
      if (member && !member.zone) {
        try { const c = await conditions(token); member.zone = c.zone; member.deliveryDay ||= c.zone?.deliveryDays[0] ?? '' } catch {}
      }
    } catch (e) { if (!(e instanceof ApiError && e.status === 401)) throw e }
    seen.set(token, { at: Date.now(), member })
    return member
  },

  async logout(token) { forget(token); try { await call('/auth/logout', { method: 'POST', token }) } catch {} },

  async forgotPassword(email) { try { await call('/auth/send-password-to-email', { body: { email } }) } catch {} },

  async updateProfile(token, p) {
    try {
      await call('/user/update-profile', { token, body: { firstName: p.firstName, lastName: p.lastName, phone: p.phone, phone2: p.phone2, email: p.email } })
      forget(token)
      return (await live.me(token)) ?? { error: 'Saved, but please log in again.', status: 401 }
    } catch (e) { return fail(e, "Your details didn't save. Please try again.") }
  },

  async updateAddress(token, a) {
    try {
      await call('/user/update-address', { token, body: { streetNo: a.streetNo, appartmentName: a.apt, street_address: a.street, city: a.city, state: a.state, zip: a.zip, country: a.country || 'USA', deliveryMapAddress: formatAddress(a) } })
      forget(token)
      return (await live.me(token)) ?? { error: 'Saved, but please log in again.', status: 401 }
    } catch (e) { return fail(e, "Your address didn't save. Please try again.") }
  },

  async updatePassword(token, current, next) {
    try {
      await call('/user/update-password', { token, body: { password: current, npassword: next, cpassword: next } })
      return { ok: true }
    } catch (e) { return fail(e, "Your password didn't change. Check your current password and try again.") }
  },


  async conditions(token) {
    try { return await conditions(token) } catch (e) { return fail(e, "Couldn't load your delivery options.") }
  },

  async listOrders(token, page) {
    try {
      const b = await call<Record<string, unknown>>('/order/history', { token, query: { page } })
      const inner = b.data as Record<string, unknown> | unknown[]
      const rows = (Array.isArray(inner) ? inner : (inner as Record<string, unknown>)?.data ?? []) as Record<string, unknown>[]
      const meta = (Array.isArray(inner) ? b : inner) as Record<string, unknown>
      const pick = (k: string) => Number(meta?.[k] ?? (b.meta as Record<string, unknown>)?.[k] ?? (b.pagination as Record<string, unknown>)?.[k] ?? NaN)
      const total = Number.isNaN(pick('total')) ? rows.length : pick('total')
      const pages = Number.isNaN(pick('last_page')) ? Math.max(1, Math.ceil(total / 10)) : pick('last_page')
      return { orders: rows.map(mapOrderRow), total, page, pages }
    } catch (e) { return fail(e, "Couldn't load your orders.") }
  },

  async getOrder(token, id) {
    try {
      const [b, catalog, c] = await Promise.all([call('/order/details/' + encodeURIComponent(id), { token }), getCatalog(), conditions(token).catch(() => null)])
      const data = dataOf<Record<string, unknown>>(b)
      return data ? mapOrderDetail(data, catalog, IMG, c?.pickupLocations) : null
    } catch { return null }
  },

  async placeOrder(token, input) {
    try {
      const c = await conditions(token)
      const s = await settle(c, input)
      if ('error' in s) return { error: s.error }
      const r = await call<Record<string, unknown>>('/order/place-order', {
        token,
        body: {
          recurringOrder: !!input.recurring,
          deliverySettings: input.method === 'pickup' ? 'pick_location' : 'delivery',
          deliveryDay: s.deliveryDay ?? '',
          pickupLocation: s.pickupLocation?.id ?? '',
          additionalInstructions: input.note ?? '',
          cartItems: s.items.map((i) => ({ id: Number(i.pkg) || i.pkg, price: i.price, quantity: i.qty, productName: i.name, unitname: i.variant, ProductImage: i.img?.split('/').pop() ?? '' })),
          total: s.subtotal, quantity: s.items.reduce((n, i) => n + i.qty, 0), deliveryFee: s.deliveryFee, totalAmount: s.subtotal + s.deliveryFee,
        },
      })
      const d = dataOf<Record<string, unknown>>(r) ?? {}
      let id = String(d.id ?? (d.order as Record<string, unknown>)?.id ?? d.order_id ?? r.order_id ?? '')
      if (!id) { try { const l = dataOf<Record<string, unknown>[] | Record<string, unknown>>(await call('/order/latest', { token })); const first = Array.isArray(l) ? l[0] : l; id = String(first?.id ?? '') } catch {} }
      const placed = id ? await live.getOrder(token, id) : null
      return placed ?? ({ id: id || 'new', status: 'open', placed: new Date().toISOString().slice(0, 10), method: input.method, deliveryDay: s.deliveryDay, pickupLocation: s.pickupLocation, recurring: !!input.recurring, deliveryFee: s.deliveryFee, items: s.items, note: input.note ?? '', editable: true } satisfies Order)
    } catch (e) { return fail(e, "Your order didn't go through. Please try again, or call 973-413-9585.") }
  },

  async updateOrder(token, id, patch) {
    try {
      if (patch.status === 'canceled') {
        await call('/order/cancel-order', { token, body: { orderId: id, cancellationReason: '' } })
        return (await live.getOrder(token, id)) ?? { error: 'Canceled. Reload to see it.' }
      }
      const cur = await live.getOrder(token, id)
      if (!cur) return { error: 'Not found', status: 404 }
      if (!cur.editable) return { error: 'This order is locked and can no longer be changed online.', status: 409 }
      const c = await conditions(token)
      const method = patch.method ?? cur.method
      const s = await settle(c, {
        items: patch.items ?? cur.items.map((i) => ({ key: i.key, qty: i.qty })),
        method, deliveryDay: patch.deliveryDay ?? cur.deliveryDay, pickupLocationId: patch.pickupLocationId ?? cur.pickupLocation?.id,
      })
      if ('error' in s) return { error: s.error, status: 400 }
      const byPkg = new Map(cur.items.map((i) => [i.pkg, i]))
      const lines = s.items.map((i) => { const old = byPkg.get(i.pkg); return { orderDetailId: old?.line ?? '', packageId: i.pkg, quantity: i.qty, price: i.price, originalQuantity: old?.qty ?? i.qty } })
      const kept = new Set(s.items.map((i) => i.pkg))
      await call('/order/update-order/' + encodeURIComponent(id), {
        token,
        body: {
          recurringOrder: patch.recurring ?? cur.recurring,
          deliverySettings: method === 'pickup' ? 'pick_location' : 'delivery',
          deliveryDay: s.deliveryDay ?? '', pickupLocation: s.pickupLocation?.id ?? '', additionalInstructions: patch.note ?? cur.note,
          deliveryFee: s.deliveryFee, total: s.subtotal, totalAmount: s.subtotal + s.deliveryFee, quantity: s.items.reduce((n, i) => n + i.qty, 0),
          lines, removedOrderDetailIds: cur.items.filter((i) => !kept.has(i.pkg)).map((i) => i.line).filter(Boolean),
        },
      })
      return (await live.getOrder(token, id)) ?? { error: 'Saved. Reload to see it.' }
    } catch (e) { return fail(e, "Your changes didn't save. Please try again.") }
  },
}
