import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/core/auth/auth.service'
import { getRoomById } from '@/core/rooms/rooms.service'

type Params = {
  params: { id: string }
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { profile } = await authenticateRequest()
    const room = await getRoomById(params.id, profile.userId)
    return NextResponse.json({ room })
  } catch (error) {
    console.error('Room fetch error', error)
    const status =
      (error as Error).message === 'Invalid session' ? 401 : 400
    return NextResponse.json(
      { error: (error as Error).message },
      { status }
    )
  }
}


