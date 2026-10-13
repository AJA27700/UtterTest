// Everything the site needs from a backend. Two implementations:
//   lib/backend/mock.ts  a stand-in that keeps everything in memory (no UDDERMILK_API_URL)
//   lib/backend/live.ts  Udder Milk's real API (UDDERMILK_API_URL=https://test.uddermilk.com/api/v1)
// Every page and route goes through this, so switching is one setting.
import type { Address, CheckoutConditions, Member, NewOrder, Order } from '../types'

export type Fail = { error: string; status?: number }
export type SignupInput = {
  firstName: string; lastName: string; primaryPhone: string; secondaryPhone?: string; email: string
  streetNo: string; appartmentName?: string; street_address: string; city: string; state: string; zip: string
  password: string; agreeTermsPolicy: boolean; agreeAgreement: boolean; signatureImage: string; smsConsent?: boolean
}
export type ProfileInput = { firstName: string; lastName: string; phone: string; phone2: string; email: string }
export type OrderPatch = Partial<NewOrder> & { status?: 'canceled' }
export type OrderPage = { orders: Order[]; total: number; page: number; pages: number }

export interface Backend {
  name: 'stand-in' | 'live'
  login(email: string, password: string): Promise<{ token: string; member: Member } | Fail>
  // pending: the account was created but can't log in yet (e.g. waiting for approval)
  signup(input: SignupInput): Promise<{ token: string; member: Member } | { pending: true; message: string } | Fail>
  me(token: string): Promise<Member | null>
  logout(token: string): Promise<void>
  forgotPassword(email: string): Promise<void>
  updateProfile(token: string, p: ProfileInput): Promise<Member | Fail>
  updateAddress(token: string, a: Address): Promise<Member | Fail>
  updatePassword(token: string, current: string, next: string): Promise<{ ok: true } | Fail>
  conditions(token: string): Promise<CheckoutConditions | Fail>
  listOrders(token: string, page: number): Promise<OrderPage | Fail>
  getOrder(token: string, id: string): Promise<Order | null>
  placeOrder(token: string, input: NewOrder): Promise<Order | Fail>
  updateOrder(token: string, id: string, patch: OrderPatch): Promise<Order | Fail>
}

export const failed = (x: unknown): x is Fail => !!x && typeof x === 'object' && 'error' in x
