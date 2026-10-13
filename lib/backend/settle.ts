import 'server-only'
import { getCatalog } from '../api'
import type { CartItem, CheckoutConditions, NewOrder, PickupLocation } from '../types'

// Check an order the way the backend must: prices from the catalogue (never from the browser),
// a delivery day that belongs to the zone, a real pickup location, and the zone's minimum.
export type Settled = { items: CartItem[]; deliveryDay?: string; pickupLocation?: PickupLocation; deliveryFee: number; subtotal: number }

export async function settle(c: CheckoutConditions, input: Pick<NewOrder, 'items' | 'method' | 'deliveryDay' | 'pickupLocationId'>): Promise<Settled | { error: string }> {
  const catalog = await getCatalog()
  const byKey = new Map<string, CartItem>() // "product-id|size", or "pkg:<their package id>"

  for (const cat of Object.values(catalog.categories)) {
    for (const p of cat.products) {
      for (const v of p.variants) {
        if (v.price == null || v.out) continue
        const key = `${p.id}|${v.label}`
        const item = { key, name: p.name, variant: v.label, price: v.price, qty: 1, url: `/${cat.path}#${p.id}`, img: p.photo, icon: p.icon, pkg: v.pkg }
        if (!byKey.has(key)) byKey.set(key, item)
        if (v.pkg && !byKey.has(`pkg:${v.pkg}`)) byKey.set(`pkg:${v.pkg}`, item)
      }
    }
  }
  const items: CartItem[] = []
  for (const it of input.items ?? []) {
    const known = byKey.get(it.key)
    if (!known) return { error: 'One of the items is no longer available. Please check your cart.' }
    items.push({ ...known, qty: Math.max(1, Math.min(99, Math.floor(Number(it.qty) || 1))) })
  }
  if (!items.length) return { error: 'Your order is empty.' }
  const zone = c.zone
  let deliveryDay: string | undefined, pickupLocation: PickupLocation | undefined
  if (input.method === 'pickup') {
    pickupLocation = c.pickupLocations.find((p) => p.id === input.pickupLocationId)
    if (!pickupLocation) return { error: 'Please select a pick up location.' }
  } else {
    if (!zone) return { error: "We don't deliver to your address yet. Choose a pickup location, or update your address." }
    if (!input.deliveryDay) return { error: 'Please select a delivery day.' }
    if (!zone.deliveryDays.includes(input.deliveryDay)) return { error: `Your zone delivers on ${zone.deliveryDays.join(' and ')}.` }
    deliveryDay = input.deliveryDay
  }
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const min = zone?.minimumTotal ?? 0
  if (min > subtotal) return { error: `Minimum order price is $${min.toFixed(2)}. Add more items to your cart to meet the minimum.` }
  const deliveryFee = input.method === 'pickup' ? 0 : c.deliveryFee
  return { items, deliveryDay, pickupLocation, deliveryFee, subtotal }
}
