import type { MoodOption } from '@/utils/types'

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'calm', label: 'Calm', emoji: '🌊', color: 'from-sky-500 to-indigo-500' },
  { id: 'curious', label: 'Curious', emoji: '🧠', color: 'from-amber-500 to-rose-500' },
  { id: 'restless', label: 'Restless', emoji: '⚡️', color: 'from-fuchsia-500 to-purple-600' },
  { id: 'tender', label: 'Tender', emoji: '💗', color: 'from-rose-400 to-pink-500' },
  { id: 'bold', label: 'Bold', emoji: '🔥', color: 'from-orange-500 to-red-500' },
]

export const isValidMood = (moodId: string) =>
  MOOD_OPTIONS.some((mood) => mood.id === moodId)



