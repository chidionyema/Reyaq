import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/core/auth/auth.service'
import { getPseudonym } from '@/core/pseudonyms/pseudonyms.service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { profile } = await authenticateRequest()
    const pseudonym = await getPseudonym(profile.userId)
    return NextResponse.json({ pseudonym })
  } catch (error) {
    console.error('Get pseudonym error', error)
    const status =
      (error as Error).message === 'Invalid session' ? 401 : 500
    return NextResponse.json(
      { error: (error as Error).message },
      { status }
    )
  }
}

