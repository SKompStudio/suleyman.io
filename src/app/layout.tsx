import { Analytics } from '@vercel/analytics/react'
import { Inter, JetBrains_Mono } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { CommandPaletteMount } from '@/components/terminal/CommandPaletteMount'

import '@/styles/tailwind.css'
import 'focus-visible'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata = {
  title: {
    template: '%s - Suleyman Kiani',
    default: 'Suleyman Kiani - Software Engineer & Equipment Finance',
  },
  description:
    'Equipment finance professional and software engineer. Production SaaS, ML, and event-driven systems.',
  metadataBase: new URL('https://www.suleyman.io'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Suleyman Kiani - Software Engineer & Equipment Finance',
    description: 'Equipment finance professional and software engineer. Production SaaS, ML, and event-driven systems.',
    url: 'https://www.suleyman.io',
    siteName: 'Suleyman Kiani',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

// The site is a dark-first command-center; it is locked to dark. (Light mode
// rendered the dark-surface tokens unreadable on white, and the aesthetic is
// fundamentally dark, so the theme toggle is removed and dark is forced.)
const modeScript = `document.documentElement.classList.add('dark')`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      className={`dark h-full antialiased ${inter.variable} ${jetbrainsMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.xml`}
        />
        <link
          rel="alternate"
          type="application/feed+json"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.json`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Suleyman Kiani",
              "url": "https://www.suleyman.io",
              "image": "https://www.suleyman.io/profile-image.jpg",
              "jobTitle": "Equipment Finance Professional & Software Engineer",
              "sameAs": [
                "https://linkedin.com/in/suleyman-kiani",
                "https://github.com/kianis4",
                "https://twitter.com/svley"
              ],
              "description": "Equipment finance professional and software engineer. Production SaaS, ML, and event-driven systems."
            })
          }}
        />
      </head>
      <body className="flex h-full flex-col bg-zinc-50 font-sans dark:bg-[#06080B]">
        {/* Uniform page background — one near-black surface, no centered "card"
            and no side bars. */}
        <div className="pointer-events-none fixed inset-0 dark:bg-[#06080B]" />
        <div className="relative">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <CommandPaletteMount />
        <Analytics />
      </body>
    </html>
  )
}
