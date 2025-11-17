'use client'

import { useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

type Provider = 'google'

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: 'google', label: 'Continue with Google' },
]

const getRedirectUrl = () => {
  if (SITE_URL) {
    return `${SITE_URL}/auth/callback`
  }
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`
  }
  return null
}

type Props = {
  redirectTo?: string
}

export default function SocialLoginButtons({ redirectTo }: Props = {}) {
  const supabase = getSupabaseBrowserClient()
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (provider: Provider) => {
    setLoadingProvider(provider)
    setError(null)
    try {
      const callbackUrl = getRedirectUrl()
      if (!callbackUrl) {
        throw new Error('NEXT_PUBLIC_SITE_URL is not configured')
      }
      
      // Store redirectTo in sessionStorage to retrieve after OAuth
      if (redirectTo && typeof window !== 'undefined') {
        sessionStorage.setItem('reyaq_redirect_to', redirectTo)
      }

      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl,
        },
      })
    } catch (err) {
      setError((err as Error).message)
      setLoadingProvider(null)
    }
  }

  return (
    <div className="space-y-4">
      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          onClick={() => handleLogin(provider.id)}
          disabled={loadingProvider !== null}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-ink-shadow/10 bg-white px-5 py-3 text-base font-semibold text-ink-shadow transition hover:border-ink-shadow/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingProvider === provider.id ? 'Redirecting…' : provider.label}
        </button>
      ))}
      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}


