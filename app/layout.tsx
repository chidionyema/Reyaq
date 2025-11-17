import type { Metadata } from 'next'
import './globals.css'
import PostLoginRedirect from '@/app/components/PostLoginRedirect'

export const metadata: Metadata = {
  title: 'Reyaq - Emotional Weather',
  description: 'See how people are feeling right now. No profiles. No feeds. Just feelings.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-mist-white text-ink-shadow">
        <PostLoginRedirect />
        {children}
      </body>
    </html>
  )
}

