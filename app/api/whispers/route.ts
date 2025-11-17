import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/core/auth/auth.service'
import { listWhispersForUser } from '@/core/whispers/whispers.service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { profile } = await authenticateRequest()
    const whispers = await listWhispersForUser(profile.userId)
    return NextResponse.json({ whispers })
  } catch (error) {
    console.error('List whispers error', error)
    const status =
      (error as Error).message === 'Invalid session' ? 401 : 500
    return NextResponse.json(
      { error: (error as Error).message },
      { status }
    )
  }
}

