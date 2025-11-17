'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthSession } from '@/app/hooks/useAuthSession'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function GlobalHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const session = useAuthSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    setIsLoggingOut(false)
  }

  const isLandingPage = pathname === '/'
  const isMoodSelect = pathname === '/mood-select'

  return (
    <header className="border-b border-ink-shadow/5 bg-white/60 backdrop-blur-md sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.4em] text-ink-shadow hover:opacity-80 transition-opacity"
          >
            REYAQ
          </Link>
          <div className="flex items-center gap-4">
            {session?.access_token ? (
              <>
                <Link
                  href="/"
                  className="text-sm text-ink-shadow/70 hover:text-ink-shadow hover:opacity-100 opacity-80 transition-opacity duration-200"
                >
                  Explore
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-sm text-ink-shadow/70 hover:text-ink-shadow hover:opacity-100 opacity-80 transition-opacity duration-200 disabled:opacity-50"
                >
                  {isLoggingOut ? 'Signing out...' : 'Log out'}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm text-ink-shadow/70 hover:text-ink-shadow hover:opacity-100 opacity-80 transition-opacity duration-200"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

