import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/core/auth/auth.service'
import { selectMood } from '@/core/moods/moods.service'
import { moodSelectSchema } from '@/utils/validators'

export async function POST(request: Request) {
  try {
    const { profile } = await authenticateRequest()
    const body = await request.json()
    const { moodId } = moodSelectSchema.parse(body)

    const mood = selectMood(profile.userId, moodId)
    return NextResponse.json({ mood })
  } catch (error) {
    console.error('Mood select error', error)
    const status =
      (error as Error).message === 'Invalid session' ? 401 : 400
    return NextResponse.json(
      { error: (error as Error).message },
      { status }
    )
  }
}


