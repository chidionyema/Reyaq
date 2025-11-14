import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/core/auth/auth.service'
import { getOrCreateRoom } from '@/core/rooms/rooms.service'
import { roomCreateSchema } from '@/utils/validators'

export async function POST(request: Request) {
  try {
    const { profile } = await authenticateRequest()
    const body = await request.json()
    const { partnerId } = roomCreateSchema.parse(body)

    const room = await getOrCreateRoom(profile.userId, partnerId)
    return NextResponse.json({ room })
  } catch (error) {
    console.error('Room create error', error)
    const status =
      (error as Error).message === 'Invalid session' ? 401 : 400
    return NextResponse.json(
      { error: (error as Error).message },
      { status }
    )
  }
}


