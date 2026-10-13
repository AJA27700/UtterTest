import type { Metadata } from 'next'
import CategoryPage from '@/components/CategoryPage'
import { getCategory, getCategorySlugs } from '@/lib/api'

// Every category under /category/ is built ahead of time, and rebuilt when the catalogue changes.
// Unknown addresses wait for the full render, so notFound() sends a real 404 status.
export const ensureStatic = 'navigation'

export async function generateStaticParams() {
  return (await getCategorySlugs('category')).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/category/[slug]'>): Promise<Metadata> {
  const c = await getCategory((await params).slug)
  return c ? { title: c.title, description: (c.note || `${c.title} from Udder Milk Creamery.`).slice(0, 158) } : {}
}

// Await the slug before rendering so an unknown address gets a real 404 status (not a streamed one).
export default async function Page({ params }: PageProps<'/category/[slug]'>) {
  const { slug } = await params
  return <CategoryPage slug={slug} prefix="category" />
}
