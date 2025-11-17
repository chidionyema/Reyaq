import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/core/auth/auth.service'
import { createWhisper } from '@/core/whispers/whispers.service'
import { z } from 'zod'

const createWhisperSchema = z.object({
  fragmentId: z.string().uuid(),
  content: z.string().min(1).max(1000),
})

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { profile } = await authenticateRequest()
    const body = await request.json()
    const { fragmentId, content } = createWhisperSchema.parse(body)

    const whisper = await createWhisper({
      fragmentId,
      senderId: profile.userId,
      content,
    })

    return NextResponse.json({ whisper })
  } catch (error) {
    console.error('Create whisper error', error)
    const status =
      (error as Error).message === 'Invalid session' ? 401 : 400
    return NextResponse.json(
      { error: (error as Error).message },
      { status }
    )
  }
}

