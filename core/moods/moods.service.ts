import { eventBus } from '../events/event-bus'
import { MOOD_OPTIONS, isValidMood } from './moods.constants'

export const listMoods = () => MOOD_OPTIONS

export const selectMood = (userId: string, moodId: string) => {
  if (!isValidMood(moodId)) {
    throw new Error('Invalid mood')
  }

  eventBus.emit('mood_selected', { userId, moodId })
  return MOOD_OPTIONS.find((mood) => mood.id === moodId)!
}



