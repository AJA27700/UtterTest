import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/components/cart'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'
import Effects from '@/components/Effects'
import { AuthProvider } from '@/components/auth'

export const metadata: Metadata = {
  metadataBase: new URL('https://uddermilk.com'),
  title: { default: 'Welcome to Udder Milk Creamery Co-op', template: '%s · Udder Milk' },
  description: 'Raw A2/A2 dairy, 100% grass-fed meat and pastured eggs from small Pennsylvania farms, delivered 12–24 hours after milking.',
  icons: { icon: '/assets/img/favicon-32.png', apple: '/assets/img/apple-touch-icon.png' },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Before anything paints: lets the CSS hide scroll-reveal content until the page script shows it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <AuthProvider>
        <CartProvider>
          <a className="skip" href="#main">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Toast />
          <Effects />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
