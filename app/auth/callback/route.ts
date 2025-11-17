import { NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase/server'
import { syncProfileFromAuthUser } from '@/core/auth/auth.service'

export const runtime = 'nodejs'

const errorRedirect = (requestUrl: URL, message = 'auth') =>
  NextResponse.redirect(new URL(`/login?error=${message}`, requestUrl.origin))

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') ?? '/app'

  if (!code) {
    return errorRedirect(requestUrl, 'missing_code')
  }

  const supabase = createSupabaseRouteClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return errorRedirect(requestUrl, 'exchange_failed')
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return errorRedirect(requestUrl, 'auth')
  }

  try {
    await syncProfileFromAuthUser(session.user)
  } catch (error) {
    console.error('[auth/callback] Profile sync failed:', error)
    // Continue anyway - session is valid, profile sync can be retried
    // Don't block the user from accessing the app
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}

