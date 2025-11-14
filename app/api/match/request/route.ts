import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/core/auth/auth.service'
import { requestMatch } from '@/core/matching/matching.service'
import { matchRequestSchema } from '@/utils/validators'

export async function POST(request: Request) {
  try {
    const { profile } = await authenticateRequest()
    const body = await request.json()
    const { moodId } = matchRequestSchema.parse(body)

    const result = await requestMatch(profile.userId, moodId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Match request error', error)
    const status =
      (error as Error).message === 'Invalid session' ? 401 : 400
    return NextResponse.json(
      { error: (error as Error).message },
      { status }
    )
  }
}


