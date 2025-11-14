import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/core/auth/auth.service'
import { recordMomentResponse } from '@/core/moments/moments.service'
import { momentResponseSchema } from '@/utils/validators'

export async function POST(request: Request) {
  try {
    const { profile } = await authenticateRequest()
    const body = await request.json()
    const { momentId, response } = momentResponseSchema.parse(body)

    const moment = await recordMomentResponse({
      momentId,
      response,
      userId: profile.userId,
    })

    return NextResponse.json({ moment })
  } catch (error) {
    console.error('Moment response error', error)
    const status =
      (error as Error).message === 'Invalid session' ? 401 : 400
    return NextResponse.json(
      { error: (error as Error).message },
      { status }
    )
  }
}


