export type UUID = string

export type MoodOption = {
  id: string
  slug: string
  label: string
  emoji: string
  color: string
}

export type MatchQueued = {
  status: 'queued'
  moodId: string
}

export type MatchMade = {
  status: 'matched'
  momentId: UUID
  roomId: UUID
  partnerId: UUID
  moodId: string
  synclight: boolean
}

export type MatchResult = MatchQueued | MatchMade

export type RitualStep = {
  id: string
  prompt: string
}

export type RitualDefinition = {
  id: string
  prompt: string
  responseType: 'text'
  steps: number
  reveal: 'immediate' | 'delayed'
}

export type RitualExecutionContext = {
  momentId: UUID
  userAId: UUID
  userBId: UUID
} & RitualDefinition


