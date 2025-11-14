import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'REYAQ - What we make, makes us.',
  description: 'The first co-creation platform. No profiles. No feeds. Moments made by two.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-mist-white text-ink-shadow">{children}</body>
    </html>
  )
}

