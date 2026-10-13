// The shapes the backend API should return. Agree these with the backend developer first.

export type Variant = { label: string; price: number | null; out: boolean; pkg?: string } // pkg: their package id (live API)

export type LongBlock =
  | { k: 'h' | 'p' | 'note'; t: string }
  | { k: 'ul' | 'check'; items: string[] }

export type Product = {
  id: string
  name: string
  tags: { text: string; cls: string | null }[]
  desc: string
  long: LongBlock[]
  icon: string
  photo: string | null
  gallery: string[]
  allout: boolean
  fromPrice: number | null
  variants: Variant[]
}

export type Category = {
  slug: string
  path: string // e.g. "category/eggs" (the old site's address, kept)
  title: string
  note: string
  icon: string
  tint: string
  parent: string | null
  children: string[]
  count: number
  instock: number
  fromPrice: number | null
  allout: boolean
  photos: string[]
  products: Product[]
  apiId?: string // their category id (live API)
  related?: string[] // related category slugs (live API: relatedCats)
}

export type Catalog = {
  order: string[]
  categories: Record<string, Category>
  products?: Record<string, { cat: string; id: string }> // live API: their product id -> where it lives here
}

export type CartItem = {
  key: string // productId|variant label
  name: string
  variant: string
  price: number
  qty: number
  url: string
  img: string | null
  icon: string
  line?: string // live API: this line's id inside a placed order (order_detail id)
  pkg?: string // live API: package id
}

export type OrderStatus = 'open' | 'closed' | 'confirmed' | 'out' | 'delivered' | 'canceled'

// The member's delivery zone. From the backend: zone.zonename, zone.cut_off_days, zone.delivery_days,
// zone.deliveryfee, zone.minimumtotal (see GET /order/pre-checkout/conditions on test.uddermilk.com).
export type Zone = {
  name: string
  cutOffDay: string // e.g. "Monday"
  deliveryDays: string[] // e.g. ["Wednesday"]
  deliveryFee: number // dollars; 0 = free
  minimumTotal: number // dollars; 0 = no minimum
}

export type PickupLocation = { id: string; title: string }

// What checkout needs to know before an order is placed (GET /api/order/conditions).
export type CheckoutConditions = { zone: Zone | null; pickupLocations: PickupLocation[]; deliveryFee: number }

export type Order = {
  id: string
  status: OrderStatus
  placed: string // YYYY-MM-DD
  method: 'delivery' | 'pickup'
  deliveryDay?: string // "Wednesday" (delivery)
  pickupLocation?: PickupLocation // (pickup)
  recurring: boolean // repeats every delivery day until changed
  deliveryFee: number
  items: CartItem[]
  note: string
  sample?: boolean
  number?: string // their order number, shown to members (live API)
  itemCount?: number // when the list doesn't include line items (live API order history)
  total?: number // total incl. delivery fee, when known without items
  editable?: boolean
}

// What the browser sends to place an order. No prices or totals: the server works those out.
export type NewOrder = {
  items: { key: string; qty: number }[]
  method: 'delivery' | 'pickup'
  deliveryDay?: string
  pickupLocationId?: string
  recurring: boolean
  note: string
}

export type Address = { streetNo: string; street: string; apt: string; city: string; state: string; zip: string; country: string }

export type Member = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  phone2: string
  address: Address | null
  zone: Zone | null // follows from the address
  deliveryDay: string // the day this member's orders come (one of zone.deliveryDays)
}
