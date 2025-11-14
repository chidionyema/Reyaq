import type { RitualDefinition, RitualExecutionContext } from '@/utils/types'
import { RITUALS, RitualId } from './ritual-definitions'

export const getRitual = (ritualId: RitualId = 'finishMyThought'): RitualDefinition => {
  const ritual = RITUALS[ritualId]
  if (!ritual) {
    throw new Error(`Unknown ritual: ${ritualId}`)
  }
  return ritual
}

export const createRitualContext = (params: {
  ritualId?: RitualId
  momentId: string
  userAId: string
  userBId: string
}): RitualExecutionContext => {
  const ritual = getRitual(params.ritualId)
  return {
    ...ritual,
    momentId: params.momentId,
    userAId: params.userAId,
    userBId: params.userBId,
  }
}


