import type { Moment, Profile, Room } from '@prisma/client'

export type MomentWithRelations = Moment & {
  userA: Profile
  userB: Profile
  room?: Room | null
}

export type MomentResponseInput = {
  momentId: string
  userId: string
  response: string
}


