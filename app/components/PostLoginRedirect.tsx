'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthSession } from '@/app/hooks/useAuthSession'

export default function PostLoginRedirect() {
  const router = useRouter()
  const pathname = usePathname()
  const session = useAuthSession()
  const hasRedirected = useRef(false)
  const previousSessionRef = useRef<boolean>(false)

  useEffect(() => {
    // Only redirect if:
    // 1. User just logged in (session changed from null to present)
    // 2. We have a redirect target in sessionStorage
    // 3. We haven't already redirected
    // 4. We're NOT on the landing page (landing page should NEVER auto-redirect)
    const justLoggedIn = !previousSessionRef.current && !!session?.access_token
    const isLandingPage = pathname === '/'
    
    // Never redirect from landing page - let users explore freely
    if (justLoggedIn && !isLandingPage && typeof window !== 'undefined' && !hasRedirected.current) {
      const redirectTo = sessionStorage.getItem('reyaq_redirect_to')
      // Only redirect if there's an explicit target (e.g., from a protected page)
      if (redirectTo && redirectTo !== '/') {
        hasRedirected.current = true
        sessionStorage.removeItem('reyaq_redirect_to')
        // Use replace to avoid adding to history
        router.replace(redirectTo)
      }
    }
    
    // Update previous session state
    previousSessionRef.current = !!session?.access_token
  }, [session, router, pathname])

  return null
}

