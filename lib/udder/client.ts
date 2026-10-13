import 'server-only'

// Calls to Udder Milk's API (UDDERMILK_API_URL, e.g. https://test.uddermilk.com/api/v1).
export const API = (process.env.UDDERMILK_API_URL ?? '').replace(/\/$/, '')
export const live = !!API
// Product and category images live next to the API: https://test.uddermilk.com/assets/images/...
export const IMG = API ? API.replace(/\/api\/v\d+$/, '') + '/assets/images' : ''

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) { super(message) }
}

// Pull a readable message out of their error answers ({ message }, { error }, { errors: {...} | [...] }).
export function messageOf(body: unknown, fallback: string) {
  const b = body as Record<string, unknown> | null
  if (!b || typeof b !== 'object') return fallback
  const errs = b.errors
  if (Array.isArray(errs) && errs.length) return String(errs[0])
  if (errs && typeof errs === 'object') { const first = Object.values(errs)[0]; return String(Array.isArray(first) ? first[0] : first) }
  return String(b.message ?? b.error ?? fallback)
}

export async function call<T = Record<string, unknown>>(path: string, opts: { method?: string; body?: unknown; token?: string; query?: Record<string, string | number> } = {}): Promise<T> {
  const url = new URL(API + path)
  for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, String(v))
  const res = await fetch(url, {
    method: opts.method ?? (opts.body ? 'POST' : 'GET'),
    headers: { accept: 'application/json', ...(opts.body ? { 'content-type': 'application/json' } : {}), ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  })
  const text = await res.text()
  let body: unknown = null
  try { body = text ? JSON.parse(text) : null } catch { body = text }
  // some answers come back 200 with { status: false } or { status_code: 422 }
  const b = body as Record<string, unknown> | null
  const soft = b && typeof b === 'object' && (b.status === false || b.status === 'error' || Number(b.status_code ?? b.statusCode) >= 400)
  if (!res.ok || soft) throw new ApiError(res.ok ? Number(b?.status_code ?? b?.statusCode ?? 400) : res.status, messageOf(body, `Request failed (${res.status})`), body)
  return body as T
}

export const dataOf = <T>(r: unknown): T => ((r as { data?: T })?.data ?? r) as T
