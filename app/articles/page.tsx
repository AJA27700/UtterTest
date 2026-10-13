import type { Metadata } from 'next'
import Articles from '@/components/content/articles'

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Notes from the creamery: how we make cultured butter, and guides to cow, goat, sheep and buffalo milk.',
}

export default function Page() {
  return (
    <>
      <Articles />
    </>
  )
}
