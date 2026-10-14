# Udder Milk: static site (GitHub Pages)

Plain HTML, CSS and JavaScript. No Node, nothing to install. GitHub Pages publishes this folder as it is.

## Things you can change on GitHub

- **Homepage announcements** (the box under the cow): edit `announcements.md` in this folder. Each announcement starts with `## Headline`, then the text. Optional lines right under the headline: `Date: Oct 13` and `Link: /shop | Shop now`. Delete every `##` section and the box goes away.
- **Delivery maps** (Where We Deliver page): the images are in `assets/img/maps/`. To update one, upload a new image with the same file name (for example `new-jersey.webp`).

GitHub Pages updates the site a minute or two after you commit.

## Preview accounts

This version has no server, so log in, sign up, the account pages, checkout and orders are a **preview that saves in your own browser only** (nothing reaches Udder Milk). Test login: `demo@uddermilk.test` / `udder-demo`, or sign up with any details. Delivery zones are sample ones, picked by ZIP code (112xx Brooklyn, 07xxx North Jersey, ...).

The real member system (login, orders, live prices) is in the Next.js version of the site, which runs on Vercel.

## Where things are

- `index.html` and one folder per page (`about-us/`, `where-we-deliver/`, `shop/`, `category/...`, `account/`, ...)
- `assets/css/site.css`: all the styles
- `assets/js/site.js`: page effects + the cow video (don't change the video part)
- `assets/js/members.js`: preview log in, sign up, account pages
- `assets/js/shop.js`: cart, checkout, order pages
- `assets/js/search.js`: shop search, results page, homepage tabs + announcements, delivery map
- `assets/js/products.js`: product list used by the search (only loads when someone searches)
