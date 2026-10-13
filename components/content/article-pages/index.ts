// Article pages kept from the old site (same addresses). The others redirect: see next.config.ts.
import type { ComponentType } from 'react'
import Article301 from './a301'
import Article304 from './a304'
import Article305 from './a305'
import Article306 from './a306'
import Article307 from './a307'
import Article308 from './a308'

export const ARTICLES: Record<string, { title: string; description: string; jsonLd: unknown[]; Body: ComponentType }> = {
  '301': {
    title: 'How we make Guernsey cultured butter',
    description: "Twenty-four hours of culture, a long ice bath, then the churn. Here's how our cultured butter gets its tang.",
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'How we make Guernsey cultured butter',
        description: "Twenty-four hours of culture, a long ice bath, then the churn. Here's how our cultured butter gets its tang.",
        datePublished: '2021-01-11',
        author: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
        publisher: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
      },
    ],
    Body: Article301,
  },
  '304': {
    title: 'Cow milk: Jersey, Guernsey and the European herd',
    description: 'What the percentages mean, what A2/A2 means, and how to choose between our three cow milks.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Cow milk: Jersey, Guernsey and the European herd',
        description: 'What the percentages mean, what A2/A2 means, and how to choose between our three cow milks.',
        datePublished: '2026-08-11',
        author: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
        publisher: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
      },
    ],
    Body: Article304,
  },
  '305': {
    title: 'Goat milk: mild, sweet and grass-fed',
    description: 'How our goats are fed, what the milk tastes like, and the cheeses, kefir and ice cream we make from it.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Goat milk: mild, sweet and grass-fed',
        description: 'How our goats are fed, what the milk tastes like, and the cheeses, kefir and ice cream we make from it.',
        datePublished: '2026-08-11',
        author: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
        publisher: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
      },
    ],
    Body: Article305,
  },
  '306': {
    title: 'Sheep milk: the creamiest milk we carry',
    description: "Naturally homogenized, sweeter than cow's milk, and so rich its yogurt sets like Greek. Here's how to buy it.",
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Sheep milk: the creamiest milk we carry',
        description: "Naturally homogenized, sweeter than cow's milk, and so rich its yogurt sets like Greek. Here's how to buy it.",
        datePublished: '2026-08-11',
        author: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
        publisher: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
      },
    ],
    Body: Article306,
  },
  '307': {
    title: 'Buffalo milk: thick, snow-white and rare',
    description: "Water buffalo milk has about twice the butterfat of cow's milk. It's what real mozzarella is made from.",
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Buffalo milk: thick, snow-white and rare',
        description: "Water buffalo milk has about twice the butterfat of cow's milk. It's what real mozzarella is made from.",
        datePublished: '2026-08-11',
        author: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
        publisher: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
      },
    ],
    Body: Article307,
  },
  '308': {
    title: 'Raw milk in NYC: what to know before you buy',
    description: 'What raw milk is, how we keep it fresh from the farm to your door, and who should skip it.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Raw milk in NYC: what to know before you buy',
        description: 'What raw milk is, how we keep it fresh from the farm to your door, and who should skip it.',
        datePublished: '2026-08-20',
        author: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
        publisher: { '@type': 'Organization', name: 'Udder Milk Creamery Association' },
      },
    ],
    Body: Article308,
  },
}
