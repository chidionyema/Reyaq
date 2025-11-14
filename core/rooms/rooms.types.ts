import type { Message, Moment, Profile, Room } from '@prisma/client'

export type RoomWithRelations = Room & {
  userA: Profile
  userB: Profile
  messages: Message[]
  moments: Moment[]
}


