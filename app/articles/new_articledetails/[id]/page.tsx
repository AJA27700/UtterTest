import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ARTICLES } from '@/components/content/article-pages'

// Article pages, at the same addresses as the old site (/articles/new_articledetails/301 ...).
export const ensureStatic = 'navigation' // unknown ids get a real 404

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((id) => ({ id }))
}

export async function generateMetadata({ params }: PageProps<'/articles/new_articledetails/[id]'>): Promise<Metadata> {
  const a = ARTICLES[(await params).id]
  return a ? { title: a.title, description: a.description, openGraph: { type: 'article', title: a.title, description: a.description } } : {}
}

export default async function Page({ params }: PageProps<'/articles/new_articledetails/[id]'>) {
  const a = ARTICLES[(await params).id]
  if (!a) notFound()
  const { Body } = a
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(a.jsonLd.length === 1 ? a.jsonLd[0] : a.jsonLd).replace(/</g, '\\u003c') }} />
      <Body />
    </>
  )
}
