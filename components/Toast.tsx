'use client'
import Link from 'next/link'
import { useCart } from './cart'
import { Check } from './icons'

export default function Toast() {
  const { toast } = useCart()
  return (
    <div className={`toast${toast ? ' is-on' : ''}`} role="status">
      {toast && <><span className="toast__ok"><Check /></span><span>{toast.text}</span><Link href="/shop-cart">View cart</Link></>}
    </div>
  )
}
