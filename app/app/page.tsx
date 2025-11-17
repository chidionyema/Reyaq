import { listMoods } from '@/core/moods/moods.service'
import MoodSelector from '@/app/components/MoodSelector'
import type { MoodOption } from '@/utils/types'

export const dynamic = 'force-dynamic'

// Map Mood to MoodOption format
const moodToOption = (mood: { id: string; name: string; slug: string; colorTheme: string }): MoodOption => {
  // Map colorTheme to actual color values
  const colorMap: Record<string, string> = {
    rose: 'from-pink-400/80 to-rose-500/80',
    violet: 'from-violet-400/80 to-purple-500/80',
    pink: 'from-pink-300/80 to-fuchsia-500/80',
    orange: 'from-orange-400/80 to-amber-500/80',
    ember: 'from-amber-400/80 to-orange-500/80',
  }

  // Map mood names to emojis
  const emojiMap: Record<string, string> = {
    Tender: '🌸',
    Curious: '🌀',
    Lost: '🌑',
    Anxious: '⚡',
    Calm: '🌿',
    Playful: '✨',
  }

  return {
    id: mood.id,
    label: mood.name,
    emoji: emojiMap[mood.name] || '💫',
    color: colorMap[mood.colorTheme] || 'from-gray-400/80 to-gray-500/80',
  }
}

export default async function MoodPage() {
  const moodsData = await listMoods()
  const moods: MoodOption[] = moodsData.map(moodToOption)

  return (
    <div className="min-h-screen bg-mist-white text-ink-shadow">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12 text-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-ink-shadow/60">
            Choose your wavelength
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-ink-shadow">
            What mood are you bringing in?
          </h1>
          <p className="mt-3 text-base text-ink-shadow/70">
            Pick how you feel. We&apos;ll find someone who feels it, too.
          </p>
        </div>
        <MoodSelector moods={moods} />
      </div>
    </div>
  )
}


