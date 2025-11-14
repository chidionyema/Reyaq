export type MomentWithRelations = {
  id: string
  prompt: string
  userAId: string
  userBId: string
  mood: string
  userAResponse: string | null
  userBResponse: string | null
  synclight: boolean
  roomId?: string | null
  userA: {
    userId: string
    email: string
  }
  userB: {
    userId: string
    email: string
  }
  room?: {
    id: string
  } | null
}

export type MomentResponseInput = {
  momentId: string
  userId: string
  response: string
}


