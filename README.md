# Udder Milk: Next.js site

The Udder Milk site on **Next.js** (React). It looks the same as the static site and runs on Udder Milk's real API (`test.uddermilk.com/api/v1`), or on a built-in stand-in when no API is set.

## Run it

You need Node.js 20 or newer (https://nodejs.org).

```bash
npm install        # once
npm run dev        # http://localhost:3000, reloads as you edit
```

Production build:

```bash
npm run build
npm start
```

Deploy: push to a **private** GitHub repo and import it on Vercel (free tier is fine). GitHub Pages **can't** run this version because it has a server part (`app/api/*`).

## Two modes, one setting

| | Preview (stand-in) | Live |
|---|---|---|
| Setting in `.env.local` | `UDDERMILK_API_URL=` (empty) | `UDDERMILK_API_URL=https://test.uddermilk.com/api/v1` |
| Products, prices, stock | `data/catalog.json` (export of the old site) | Their API, refreshed every few minutes |
| Accounts, zones, orders | Kept in memory, reset on restart | Their API |
| Log in with | `demo@uddermilk.test` / `udder-demo`, or sign up | A real account on their system |

In preview, the delivery zone follows the ZIP code (sample zones only): `112xx` Brooklyn → zone 12, Wednesday or Saturday; `07xxx` North Jersey → zone 50, Wednesday; `100xx-104xx` → zone 14; `15xxx-19xxx` → zone 3; other ZIPs → "we don't deliver there yet".

No page changes between modes. `lib/backend/index.ts` picks `mock.ts` or `live.ts`.

## What's on the site

| Area | What's there |
|---|---|
| Homepage | All 12 sections, plus **What's new** (tabs: Just added / Back in stock), which updates from the API on its own |
| Shop | `/shop` and every category page at the old addresses. Sidebar: search, categories, related categories, newly added items |
| Search | Across all products (`/search`), and inside a category |
| Content | About Us (copied from the new site), Videos, Where We Deliver (map, areas, delivery day, pickup; `/pickup-delivery` redirects here), Contact. Articles, Recipes, News and FAQ are linked from the footer. Privacy, Terms, 404 |
| Log in / sign up | Log in (photo + Remember me), 4-step Sign up (personal info, address, password, signed agreement), Forgot password. No driver login (`/driver-login` redirects to `/login`) |
| **My account** | Side menu like the new site: **Order dashboard** (zone, cut-off day, your delivery day, active and recurring orders), **Order history** (paginated), **My profile** (name, email, phones), **My address & delivery** (address; zone, cut-off and delivery day follow from it; choose the day when the zone has more than one), **Change password**, Log out |
| Ordering | Cart (open to everyone). Members: Checkout (delivery day from the zone, recurring, delivery or pickup location, zone minimum, delivery fee), Order page, Edit order, Cancel |
| SEO | `/sitemap.xml`, `/robots.txt`, structured data, real 404s, member pages not indexed |
| Old addresses | 18 old uddermilk.com links redirect to their new pages (`next.config.ts`) |

## How the pieces talk

```
Browser  ──►  this site's server (app/api/*)  ──►  their API (test.uddermilk.com/api/v1)
```

- The browser only calls this site's own `/api/...` routes.
- The login token is kept in an **httpOnly cookie** (`um_session`), so page scripts can't read it. The server sends it to their API as `Authorization: Bearer <token>`.
- **Prices are never taken from the browser.** The browser sends only item keys, quantities and choices. The server prices the order from the catalogue and checks the zone, day and minimum (`lib/backend/settle.ts`) before calling their API.

## Their API → this site

| What | Their endpoint | This site |
|---|---|---|
| Categories | `GET /categories` | `getCatalog()` (`lib/udder/catalog.ts`) |
| Products + related categories | `POST /products {slugName}` → `data[]` with `packages[]`, `relatedCats[]` | `getCatalog()`, shop sidebar |
| Just added | `GET /products/lated-added-items` (their spelling) | What's new, sidebar |
| Back in stock | `GET /products/lated-updated-items` | What's new |
| Log in / who's logged in / log out | `POST /auth/login`, `GET /auth/validate`, `POST /auth/logout` | `/api/auth/*` |
| Sign up | `POST /user/sign-up` | `/api/auth/signup` (shows "Registration successful" if the account can't log in straight away) |
| Forgot password | `POST /auth/send-password-to-email` | `/api/auth/forgot` |
| Profile / address / password | `POST /user/update-profile`, `/user/update-address`, `/user/update-password` | `/api/account/*` |
| Zone, days, fee, minimum, pickup spots | `GET /order/pre-checkout/conditions` | `/api/order/conditions`, dashboard, checkout |
| Place order | `POST /order/place-order` | `POST /api/orders` |
| Order history / one order | `GET /order/history?page=n`, `GET /order/details/:id` | `GET /api/orders`, `GET /api/orders/:id` |
| Edit / cancel | `POST /order/update-order/:id`, `POST /order/cancel-order` | `PATCH /api/orders/:id` |
| Images | `https://test.uddermilk.com/assets/images/products_image/<file>` | product cards |

- Their order status numbers: 1 Open, 2 Confirmed, 3 Delivered, 4 Cancelled, 5 Out for delivery. An order can be edited while it's Open, or if it's recurring and not cancelled.
- Product names in their data have sorting symbols at the start (colons, tildes, runs of quote marks) and some broken characters (`Maryamâ€™s` instead of `Maryam's`). `lib/udder/map.ts` cleans both.
- Icons, colours and long descriptions from `data/catalog.json` are kept and matched to their products by name.

## How it was checked

- **Catalogue on the real API:** 80 categories and 821 products loaded from `test.uddermilk.com`, with prices, stock and cleaned names.
- **Accounts and orders:** 22 checks against a copy of their API built from its code (log in, dashboard zone, profile, address → zone change, password, checkout days and pickup, place order, edit, cancel, search, log out). The tests also checked what is sent: package ids, catalogue prices, Bearer token.
- **Preview mode:** 50 checks covering the same flows plus sign-up, the pager and What's new.
- **Still to confirm with a real test login:** the exact reply shapes of `/auth/validate`, `/order/history` (pagination) and `/order/details`. The code accepts the usual variations, but a test account is needed to be sure.

## To raise with the backend developer

1. **Prices from the browser.** Their `place-order` accepts `total`, `deliveryFee` and `totalAmount` from the browser. Their server must recalculate them from its own prices, or anyone can change them. This site sends server-calculated prices, but their API shouldn't trust any caller.
2. **Sign-up map pin.** Their sign-up form also sends a map location (lat/lng from Google Maps). This site sends the typed address only. Ask if the location is required, or if they can look it up from the address.
3. **No endpoint to save a member's delivery day.** When a zone delivers on more than one day, this site remembers the chosen day in a cookie (`um_day`) and uses it at checkout. If they add an endpoint, it goes in `lib/backend/live.ts`.
4. **Clean the product names** in the database (the sorting symbols and broken characters above). This site strips them, but other places that use the data won't.
5. **Contact form.** This site forwards it to `POST {API}/contact`. Their API may not have that. Ask where contact messages should go.

## Settings (`.env.local`)

Copy `.env.example` to `.env.local` and fill it in. Never commit `.env.local`.

```
UDDERMILK_API_URL=https://test.uddermilk.com/api/v1   # empty = preview mode
REVALIDATE_SECRET=some-long-random-string
```

The shop refreshes from the API every few minutes. To refresh right away: `POST /api/revalidate` with the header `x-revalidate-secret: <REVALIDATE_SECRET>`.

## Where things are

```
app/                       pages (folder = web address)
  layout.tsx               header, footer, cart, login state; wraps every page
  page.tsx                 homepage (What's new is fetched here)
  category/[slug]/         category pages (also sub-category/, products/product_lists/)
  login/ signup/ forgot-password/
  account/                 dashboard, profile/, address/, password/
  order-history/           paginated order list
  shop-cart/ checkout/ order/ edit-order/
  search/                  search results
  api/                     the server side: auth, account, orders, order/conditions, search, contact, revalidate
components/
  account.tsx              account side menu, zone cards, orders table, pager
  WhatsNew.tsx             homepage "What's new"
  content/                 page text, ported from the static site
  auth.tsx                 login state in the browser; RequireLogin for member pages
  ShopNav, ProductCard, cart, orders, OrderPreferences, SignupWizard...
lib/
  backend/                 index.ts picks the backend; live.ts (their API), mock.ts (stand-in), settle.ts (pricing + checks)
  udder/                   client.ts (calls their API), catalog.ts (builds the catalogue), map.ts (their data → this site's shapes)
  api.ts                   catalogue functions the pages use
  session.ts               login and delivery-day cookies
  types.ts                 data shapes
data/catalog.json          product data from the old site (preview mode + icons/descriptions)
content/announcements.md   homepage announcements under the cow: edit or upload on GitHub, Vercel updates in ~1 min (notes inside the file)
public/assets/             fonts, icons, images, video
app/globals.css            stylesheet
```

## Next steps

1. Get a **test login** on `test.uddermilk.com`, set `UDDERMILK_API_URL`, and click through: log in, dashboard, address, checkout, an order, edit, cancel.
2. Settle the 5 points above with the backend developer.
3. Deploy on Vercel from a private repo, then point uddermilk.com at it once the owners sign off.
