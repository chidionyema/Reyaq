export type RoomWithRelations = {
  id: string
  userAId: string
  userBId: string
  userA: {
    userId: string
    email: string
  }
  userB: {
    userId: string
    email: string
  }
  messages: {
    id: string
    roomId: string
    senderId: string
    content: string
    createdAt: Date
  }[]
  moments: {
    id: string
    prompt: string
    userAResponse: string | null
    userBResponse: string | null
    createdAt: Date
  }[]
}


