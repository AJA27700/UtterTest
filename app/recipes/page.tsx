import type { Metadata } from 'next'
import Recipes from '@/components/content/recipes'

export const metadata: Metadata = {
  title: 'Recipes',
  description: 'Simple recipes for raw cream, buttermilk, yogurt and more, straight from the dairy case.',
}

export default function Page() {
  return (
    <>
      <Recipes />
    </>
  )
}
