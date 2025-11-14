import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/core/auth/auth.service'
import { sendMessage } from '@/core/chat/chat.service'
import { roomMessageSchema } from '@/utils/validators'

type Params = {
  params: { id: string }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { profile } = await authenticateRequest()
    const body = await request.json()
    const { content } = roomMessageSchema.parse(body)

    const message = await sendMessage(params.id, profile.userId, content)
    return NextResponse.json({ message })
  } catch (error) {
    console.error('Message send error', error)
    const status =
      (error as Error).message === 'Invalid session' ? 401 : 400
    return NextResponse.json(
      { error: (error as Error).message },
      { status }
    )
  }
}


