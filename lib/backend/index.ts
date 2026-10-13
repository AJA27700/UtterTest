import 'server-only'
import { live as isLive } from '../udder/client'
import { live } from './live'
import { mock } from './mock'

// One switch: with UDDERMILK_API_URL set, the site runs on Udder Milk's real API; without it, on the stand-in.
export const backend = isLive ? live : mock
export * from './types'
