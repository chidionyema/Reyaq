import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Let the app layout handle session checking with proper Supabase client
  // This prevents cookie name mismatches that cause redirect loops
  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*'],
}



