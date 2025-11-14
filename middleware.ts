import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const hasSupabaseSession = (req: NextRequest) =>
  req.cookies.has('sb-access-token') || req.cookies.has('supabase-auth-token')

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.next()
  }

  if (!hasSupabaseSession(req)) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*'],
}



