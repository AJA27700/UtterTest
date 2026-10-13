// Translate Udder Milk's API data (test.uddermilk.com/api/v1) into this site's shapes (lib/types.ts).
// Pure functions only: no fetching, no server-only imports, so they can be tested anywhere.
import type { Address, CartItem, Catalog, Category, Member, Order, OrderStatus, PickupLocation, Product, Variant, Zone } from '../types'

/* ---------- raw shapes (only the fields we use) ---------- */
export type ApiCategory = {
  id: number; slug: string; categoryname: string; categoryimage?: string | null; parent_cat_id?: number
  display_order?: number; front_show?: number; status?: string
  child_categories?: ApiCategory[]; lavel_one?: ApiCategory[]
}
export type ApiPackage = {
  id: number; productid?: number; price: string | number | null; unitname?: string | null; pkg_slug?: string
  available?: string; toshow?: string; track?: string; max_qty_oder?: number | string | null; displaypos?: number; status?: number
  inventory?: { currentstock?: number | null } | null
  product?: ApiProduct
}
export type ApiProduct = {
  id: number; productname: string; product_slug: string; productdesc?: string | null; category_id?: string | null
  product_image?: string | null; product_img_one?: string | null; product_img_two?: string | null; product_img_three?: string | null
  product_img_four?: string | null; product_img_five?: string | null
  is_active?: string; status?: string; available?: string; product_display_order?: number
  packages?: ApiPackage[]
}

/* ---------- text clean-up ---------- */
// Some of their text was saved with the wrong encoding: "Maryamâ€™s" should be "Maryam’s", "ðŸ¥š" is 🥚.
const CP1252: Record<number, number> = { 0x20ac: 0x80, 0x201a: 0x82, 0x192: 0x83, 0x201e: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x2c6: 0x88, 0x2030: 0x89, 0x160: 0x8a, 0x2039: 0x8b, 0x152: 0x8c, 0x17d: 0x8e, 0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x2dc: 0x98, 0x2122: 0x99, 0x161: 0x9a, 0x203a: 0x9b, 0x153: 0x9c, 0x17e: 0x9e, 0x178: 0x9f }
export function fixMojibake(s: string) {
  if (!/[ÂÃâð][\u0080-\u00bf\u0152-\u2122]/.test(s)) return s
  // repair each run of mis-decoded characters separately, so good text around it is untouched
  return s.replace(/[\u0080-\u00ff\u0152-\u2122]{2,}/g, (run) => {
    const bytes: number[] = []
    for (const ch of run) {
      const c = ch.codePointAt(0)!
      const b = c < 0x100 ? c : CP1252[c]
      if (b == null) return run
      bytes.push(b)
    }
    try { return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes)) } catch { return run }
  })
}
// '"""" Organic Sofiya Unwashed Egg' -> 'Organic Sofiya Unwashed Egg'; '~~ (RAW) Goat Butter' -> '(RAW) Goat Butter';
// ':Raw Colostrum' -> 'Raw Colostrum' (they put symbols in front of names to sort them)
export function cleanName(s: string | null | undefined) {
  return fixMojibake(String(s ?? ''))
    .replace(/^[\s"'“”‘’\-–—*.:;=~#>|+_,]+|[\s"'“”‘’\-–—*:;=~]+$/g, '')
    .replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
// '(Dozen)' -> 'Dozen'; '- 1/2 pint ( Jersy Milk )' -> '1/2 pint (Jersy Milk)'
export function cleanUnit(s: string | null | undefined) {
  let t = cleanName(s)
  if (/^\(.*\)$/.test(t) && !t.slice(1, -1).includes('(')) t = t.slice(1, -1).trim()
  return t || 'Each'
}
const ENT: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  deg: '°', frac12: '½', frac14: '¼', frac34: '¾', hellip: '…', bull: '•', middot: '·', trade: '™', reg: '®', copy: '©', times: '×',
  eacute: 'é', egrave: 'è', agrave: 'à', aacute: 'á', ccedil: 'ç', ntilde: 'ñ', uuml: 'ü', ouml: 'ö', auml: 'ä', iuml: 'ï', ecirc: 'ê', ocirc: 'ô',
  rarr: '→', larr: '←', check: '✓', hearts: '♥', star: '☆', laquo: '«', raquo: '»', cent: '¢', pound: '£', euro: '€', shy: '',
}
export function htmlToText(html: string | null | undefined) {
  return fixMojibake(String(html ?? ''))
    .replace(/<\s*(br|\/p|\/div|\/li|\/h\d)\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e: string) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENT[e.toLowerCase()] ?? m)
    .replace(/[ \t ]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim()
    .replace(/^description\s*:\s*/i, '')
}
export function slugify(s: string) {
  return String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item'
}

/* ---------- catalogue ---------- */
export const imageUrl = (base: string, folder: 'products_image' | 'categories_image', file?: string | null) =>
  file && String(file).trim() ? `${base}/${folder}/${encodeURIComponent(String(file).trim())}` : null

export function packageOut(p: ApiPackage) {
  const stock = p.inventory?.currentstock ?? 0
  if (p.available && p.available !== 'Y') return true
  if (String(p.track) === '1' && stock <= 0) return true
  return false
}

export function mapVariants(pkgs: ApiPackage[] = []): Variant[] {
  return pkgs
    .filter((p) => (p.toshow ?? 'Y') === 'Y' && (p.status ?? 1) == 1)
    .sort((a, b) => (a.displaypos ?? 0) - (b.displaypos ?? 0))
    .map((p) => {
      const price = p.price == null || p.price === '' ? null : Number(p.price)
      return { label: cleanUnit(p.unitname), price: price != null && !Number.isNaN(price) && price > 0 ? price : null, out: packageOut(p), pkg: String(p.id) }
    })
}

// What we keep from this site's own data for a product the API also has: icon, tags, long description.
export type Local = { products: Map<string, Product>; categories: Map<string, Category> }
const norm = (s: string) => slugify(cleanName(s))

export function mapProduct(p: ApiProduct, cat: { icon: string }, imgBase: string, local?: Local): Product | null {
  if ((p.is_active ?? '1') !== '1' || (p.status ?? '1') !== '1') return null
  const name = cleanName(p.productname)
  const mine = local?.products.get(norm(name))
  const variants = mapVariants(p.packages)
  if (!variants.length) return null
  const buyable = variants.filter((v) => !v.out && v.price != null).map((v) => v.price as number)
  const priced = variants.filter((v) => v.price != null).map((v) => v.price as number)
  const gallery = [p.product_img_one, p.product_img_two, p.product_img_three, p.product_img_four, p.product_img_five]
    .map((f) => imageUrl(imgBase, 'products_image', f)).filter((x): x is string => !!x)
  const desc = htmlToText(p.productdesc)
  return {
    id: mine?.id ?? slugify(p.product_slug || name),
    name,
    tags: mine?.tags ?? [],
    desc: desc || mine?.desc || '',
    long: mine?.long ?? [],
    icon: mine?.icon ?? cat.icon,
    photo: imageUrl(imgBase, 'products_image', p.product_image) ?? mine?.photo ?? null,
    gallery,
    allout: variants.every((v) => v.out || v.price == null),
    fromPrice: (buyable.length ? Math.min(...buyable) : priced.length ? Math.min(...priced) : null),
    variants,
  }
}

export function summarize(c: Category): Category {
  const n = c.products.length
  const instock = c.products.filter((p) => !p.allout).length
  const prices = c.products.filter((p) => !p.allout && p.fromPrice != null).map((p) => p.fromPrice as number)
  return { ...c, count: n, instock, allout: n > 0 && instock === 0, fromPrice: prices.length ? Math.min(...prices) : null, photos: c.photos.length ? c.photos : c.products.map((p) => p.photo).filter((x): x is string => !!x).slice(0, 3) }
}

// Build the whole catalogue. productsBySlug: the API's POST /products { slugName } answers, per category slug.
export function buildCatalog(
  cats: ApiCategory[],
  productsBySlug: Record<string, { data?: ApiProduct[]; relatedCats?: ApiCategory[] }>,
  imgBase: string,
  localCatalog?: Catalog,
): Catalog {
  const local: Local = { products: new Map(), categories: new Map() }
  for (const c of Object.values(localCatalog?.categories ?? {})) {
    local.categories.set(c.slug, c)
    for (const p of c.products) if (!local.products.has(norm(p.name))) local.products.set(norm(p.name), p)
  }
  const categories: Record<string, Category> = {}
  const products: Record<string, { cat: string; id: string }> = {}
  const top = cats.filter((c) => (c.front_show ?? 1) == 1 && (c.status ?? '1') == '1' && !c.parent_cat_id)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))

  const add = (c: ApiCategory, parent: Category | null) => {
    const mine = local.categories.get(c.slug)
    const base: Category = {
      slug: c.slug,
      path: mine?.path ?? (parent ? `sub-category/${c.slug}` : `category/${c.slug}`),
      title: cleanName(c.categoryname),
      note: mine?.note ?? '',
      icon: mine?.icon ?? parent?.icon ?? 'basket',
      tint: mine?.tint ?? parent?.tint ?? '#E1ECD2',
      parent: parent?.slug ?? null,
      children: [],
      count: 0, instock: 0, fromPrice: null, allout: false,
      photos: [],
      products: [],
      apiId: String(c.id),
      related: (productsBySlug[c.slug]?.relatedCats ?? []).map((r) => r.slug),
    }
    const seen = new Set<string>()
    for (const ap of productsBySlug[c.slug]?.data ?? []) {
      const p = mapProduct(ap, base, imgBase, local)
      if (!p) continue
      while (seen.has(p.id)) p.id += '-2' // same name twice in one category
      seen.add(p.id)
      base.products.push(p)
      if (!products[String(ap.id)]) products[String(ap.id)] = { cat: c.slug, id: p.id }
    }
    const kids = (c.child_categories?.length ? c.child_categories : c.lavel_one) ?? []
    for (const k of kids.filter((k) => (k.front_show ?? 1) == 1).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))) {
      base.children.push(k.slug)
      add(k, base)
    }
    categories[c.slug] = summarize(base)
  }
  for (const c of top) add(c, null)
  // a parent with no products of its own still shows its children's totals
  for (const c of Object.values(categories)) {
    if (!c.products.length && c.children.length) {
      const kids = c.children.map((s) => categories[s]).filter(Boolean)
      const prices = kids.map((k) => k.fromPrice).filter((x): x is number => x != null)
      categories[c.slug] = { ...c, count: kids.reduce((s, k) => s + k.count, 0), instock: kids.reduce((s, k) => s + k.instock, 0), fromPrice: prices.length ? Math.min(...prices) : null, allout: kids.every((k) => k.allout), photos: kids.flatMap((k) => k.photos).slice(0, 3) }
    }
  }
  return { order: top.map((c) => c.slug), categories, products }
}

/* ---------- "newly added" / "back in stock" lists ---------- */
export type MiniItem = { id: string; name: string; variant: string; href: string; photo: string | null; icon: string; price: number | null; from: boolean; catTitle: string }

export function mapMiniItems(pkgs: ApiPackage[], catalog: Catalog, imgBase: string): MiniItem[] {
  const out: MiniItem[] = []
  for (const k of pkgs) {
    const ap = k.product
    if (!ap || (k.toshow ?? 'Y') !== 'Y') continue
    const where = catalog.products?.[String(ap.id)]
    const cat = where ? catalog.categories[where.cat] : undefined
    const prod = cat?.products.find((p) => p.id === where!.id)
    const price = Number(k.price)
    out.push({
      id: `${ap.id}-${k.id}`,
      name: prod?.name ?? cleanName(ap.productname),
      variant: cleanUnit(k.unitname),
      href: cat && prod ? `/${cat.path}#${prod.id}` : `/search?q=${encodeURIComponent(cleanName(ap.productname))}`,
      photo: imageUrl(imgBase, 'products_image', ap.product_image) ?? prod?.photo ?? null,
      icon: prod?.icon ?? cat?.icon ?? 'basket',
      price: Number.isNaN(price) || price <= 0 ? null : price,
      from: false,
      catTitle: cat?.title ?? '',
    })
  }
  return out
}

/* ---------- members ---------- */
type ApiZone = { zonename?: string | number; cut_off_days?: string; delivery_days?: string | string[]; deliveryfee?: string | number | null; minimumtotal?: string | number | null }
const days = (d: unknown) => (Array.isArray(d) ? d : String(d ?? '').split(/[,/]| and /)).map((x) => String(x).trim()).filter(Boolean)
const money = (v: unknown) => { const n = Number(v); return Number.isNaN(n) ? 0 : n }

export function mapZone(z: ApiZone | null | undefined, userFee?: unknown): Zone | null {
  if (!z) return null
  const fee = money(userFee) || money(z.deliveryfee)
  return { name: String(z.zonename ?? ''), cutOffDay: String(z.cut_off_days ?? ''), deliveryDays: days(z.delivery_days), deliveryFee: fee, minimumTotal: money(z.minimumtotal) }
}

// The user object from /auth/login or /auth/validate. Field names vary a little, so try the likely ones.
export function mapMember(u: Record<string, unknown> | null | undefined): Member | null {
  if (!u || typeof u !== 'object') return null
  const nested = (u.address && typeof u.address === 'object' ? u.address : u.default_address && typeof u.default_address === 'object' ? u.default_address : {}) as Record<string, unknown>
  const s = (...keys: string[]) => { for (const k of keys) { const v = u[k] ?? nested[k]; if (v != null && v !== '' && typeof v !== 'object') return String(v) } return '' }
  const name = s('name')
  const [first, ...rest] = name.split(/\s+/)
  const address: Address = {
    streetNo: s('streetNo', 'street_no', 'streetno'),
    street: s('street_address', 'street', 'address_line', typeof u.address === 'string' ? 'address' : '_'),
    apt: s('appartmentName', 'apartment', 'appartment_name'),
    city: s('city'), state: s('state'), zip: s('zip', 'zipcode', 'postal_code'), country: s('country') || 'USA',
  }
  const hasAddress = !!(address.streetNo || address.street || address.zip)
  const zone = mapZone(u.zone as ApiZone, u.delivery_fee)
  return {
    id: s('id', 'user_id', 'email'),
    firstName: s('firstName', 'firstname', 'first_name') || first || '',
    lastName: s('lastName', 'lastname', 'last_name') || rest.join(' '),
    email: s('email'),
    phone: s('primaryPhone', 'phone', 'mobile'),
    phone2: s('secondaryPhone', 'phone2', 'secondary_phone'),
    address: hasAddress ? address : null,
    zone,
    deliveryDay: s('deliveryDay', 'delivery_day') || zone?.deliveryDays[0] || '',
  }
}

/* ---------- checkout conditions ---------- */
export function mapConditions(r: { zone?: ApiZone; user?: { delivery_fee?: unknown }; pickupLocations?: { id: unknown; title?: string }[] }) {
  const zone = mapZone(r.zone, r.user?.delivery_fee)
  const pickupLocations: PickupLocation[] = (r.pickupLocations ?? []).map((p) => ({ id: String(p.id), title: cleanName(p.title ?? '') }))
  return { zone, pickupLocations, deliveryFee: zone?.deliveryFee ?? 0 }
}

/* ---------- orders ---------- */
// Their status numbers (from the new site's dashboard): 1 Open, 2 Confirmed, 3 Delivered, 4 Cancelled, 5 Out for delivery
export const STATUS_CODE: Record<string, OrderStatus> = { 1: 'open', 2: 'confirmed', 3: 'delivered', 4: 'canceled', 5: 'out' }
const status = (v: unknown): OrderStatus => STATUS_CODE[String(v)] ?? 'open'
const recurring = (v: unknown) => v === true || v === 1 || v === '1'
const dateOf = (v: unknown) => {
  const n = Number(v)
  const d = !Number.isNaN(n) && n > 0 ? new Date(n < 1e12 ? n * 1000 : n) : new Date(String(v))
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

type ApiOrderRow = Record<string, unknown>
export function mapOrderRow(o: ApiOrderRow): Order {
  const st = status(o.orderstatus)
  const rec = recurring(o.isrecurringorder)
  const total = Number(o.totalamount ?? o.total_amount ?? o.total)
  return {
    id: String(o.id ?? o.orderno), number: String(o.orderno ?? o.id), status: st, placed: dateOf(o.orderdate ?? o.created_at),
    method: o.deliverySettings === 'pick_location' || o.delivery_settings === 'pick_location' ? 'pickup' : 'delivery',
    deliveryDay: (o.deliveryDay ?? o.delivery_day ?? undefined) as string | undefined,
    recurring: rec, deliveryFee: Number(o.delivery_fee ?? o.deliveryFee ?? 0) || 0,
    items: [], itemCount: Number(o.totalitems ?? 0) || 0, total: Number.isNaN(total) ? undefined : total,
    note: String(o.additionalInstructions ?? o.additional_instructions ?? ''),
    editable: st === 'open' || (rec && st !== 'canceled'),
  }
}

type ApiDetailLine = { id: unknown; quantity?: unknown; price?: unknown; package?: ApiPackage; product?: ApiProduct }
export function mapOrderDetail(data: Record<string, unknown>, catalog: Catalog, imgBase: string, pickup: PickupLocation[] = []): Order {
  const head = (data.order as ApiOrderRow) ?? data
  const o = mapOrderRow({ ...data, ...head })
  const lines = (data.order_detail as ApiDetailLine[]) ?? []
  o.items = lines.map((l) => {
    const pkg = l.package
    const ap = l.product ?? pkg?.product
    const where = ap ? catalog.products?.[String(ap.id)] : undefined
    const cat = where ? catalog.categories[where.cat] : undefined
    const prod = cat?.products.find((p) => p.id === where!.id)
    const variant = prod?.variants.find((v) => v.pkg === String(pkg?.id))
    const item: CartItem = {
      key: prod && variant ? `${prod.id}|${variant.label}` : `pkg:${pkg?.id}`,
      name: prod?.name ?? cleanName(ap?.productname),
      variant: variant?.label ?? cleanUnit(pkg?.unitname),
      price: Number(pkg?.price ?? l.price ?? 0) || 0,
      qty: Math.max(1, Number(l.quantity ?? 1) || 1),
      url: cat && prod ? `/${cat.path}#${prod.id}` : '/shop',
      img: imageUrl(imgBase, 'products_image', ap?.product_image) ?? prod?.photo ?? null,
      icon: prod?.icon ?? 'basket',
    }
    item.line = String(l.id)
    item.pkg = pkg?.id != null ? String(pkg.id) : undefined
    return item
  })
  o.itemCount = o.items.reduce((s, i) => s + i.qty, 0)
  const pickId = String(head.pickupLocation ?? head.pickup_location ?? '')
  if (o.method === 'pickup' || pickId) {
    const loc = pickup.find((p) => p.id === pickId)
    if (pickId) { o.method = 'pickup'; o.pickupLocation = loc ?? { id: pickId, title: 'Pickup location' } }
  }
  if (head.recurringOrder != null) o.recurring = recurring(head.recurringOrder)
  return o
}
