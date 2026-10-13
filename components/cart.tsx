'use client'
// The cart, shared by every page without reloading (this is the single-page-app part).
// Kept in the browser for now; with real log-in it can be saved to the member's account via the API.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CartItem } from '@/lib/types'

type Toast = { text: string; id: number } | null
type Cart = {
  items: CartItem[]
  ready: boolean
  add: (items: CartItem[]) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  toast: Toast
  editing: string | null
  setEditing: (id: string | null) => void
}

const Ctx = createContext<Cart | null>(null)
const KEY = 'um_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [editing, setEditingState] = useState<string | null>(null)

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read browser storage only after hydration
      setItems(JSON.parse(localStorage.getItem(KEY) || '[]'))
      setEditingState(localStorage.getItem('um_editing'))
    } catch {}
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {}
  }, [items, ready])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const add = useCallback((add: CartItem[]) => {
    setItems((cur) => {
      const next = cur.map((x) => ({ ...x }))
      for (const it of add) {
        const hit = next.find((x) => x.key === it.key)
        if (hit) hit.qty = Math.min(99, hit.qty + it.qty)
        else next.push({ ...it })
      }
      return next
    })
    if (add.length === 1) setToast({ text: `${add[0].name} · ${add[0].variant} × ${add[0].qty} added`, id: Date.now() })
  }, [])
  const setQty = useCallback((key: string, qty: number) => setItems((cur) => cur.map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(99, qty)) } : x))), [])
  const remove = useCallback((key: string) => setItems((cur) => cur.filter((x) => x.key !== key)), [])
  const clear = useCallback(() => setItems([]), [])
  const setEditing = useCallback((id: string | null) => {
    setEditingState(id)
    try { if (id) localStorage.setItem('um_editing', id); else localStorage.removeItem('um_editing') } catch {}
  }, [])

  const value = useMemo(() => ({ items, ready, add, setQty, remove, clear, toast, editing, setEditing }), [items, ready, add, setQty, remove, clear, toast, editing, setEditing])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used inside <CartProvider>')
  return c
}
