import { eventBus } from '../events/event-bus'
import { isSynclightWindow } from './synclight.logic'

export const evaluateSynclight = (joinedAtA: Date, joinedAtB: Date) =>
  isSynclightWindow(joinedAtA, joinedAtB)

export const emitSynclight = (payload: {
  userAId: string
  userBId: string
  momentId: string
  moodId: string
}) => {
  eventBus.emit('synclight_triggered', payload)
}


