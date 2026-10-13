export const money = (n: number | null | undefined) => (n == null ? '' : `$${n.toFixed(2)}`)
export const sum = (items: { price: number; qty: number }[]) => items.reduce((s, i) => s + i.price * i.qty, 0)
export const count = (items: { qty: number }[]) => items.reduce((s, i) => s + i.qty, 0)
export const fmtDate = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
export const iconUrl = (name: string) => `/assets/icons/${name}.webp`

export const formatAddress = (a: { streetNo: string; street: string; apt?: string; city: string; state: string; zip: string } | null | undefined) =>
  a ? [`${a.streetNo} ${a.street}`.trim() + (a.apt ? `, ${a.apt}` : ''), a.city, `${a.state} ${a.zip}`.trim()].filter(Boolean).join(', ') : ''
