import SharedSpace from '@/app/components/SharedSpace'
import type { Mood } from '@/core/moods/moods.types'
import type { Fragment } from '@/core/fragments/fragments.service'

type Props = {
  params: { slug: string }
}

// Placeholder mood data matching the landing page
const PLACEHOLDER_MOODS: Record<string, Omit<Mood, 'id' | 'createdAt'>> = {
  tender: { name: 'Tender', slug: 'tender', colorTheme: 'rose', description: 'the soft, vulnerable layer' },
  curious: { name: 'Curious', slug: 'curious', colorTheme: 'violet', description: 'a space for wonder and exploration' },
  lost: { name: 'Lost', slug: 'lost', colorTheme: 'pink', description: 'a space for finding your way' },
  anxious: { name: 'Anxious', slug: 'anxious', colorTheme: 'orange', description: 'a space for restless energy' },
  calm: { name: 'Calm', slug: 'calm', colorTheme: 'ember', description: 'a peaceful, serene emotional space' },
  playful: { name: 'Playful', slug: 'playful', colorTheme: 'pink', description: 'a space for lighthearted expression' },
}

export const dynamic = 'force-dynamic'

export default function MoodPage({ params }: Props) {
  const placeholderMood = PLACEHOLDER_MOODS[params.slug]

  if (!placeholderMood) {
    // Return a basic 404-like page
    return (
      <div className="min-h-screen bg-mist-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-ink-shadow mb-2">Mood not found</h1>
          <a href="/" className="text-sm text-ink-shadow/60 hover:text-ink-shadow">
            ← Back to Emotional Weather
          </a>
        </div>
      </div>
    )
  }

  // Create a Mood object with required fields
  const mood: Mood = {
    id: `placeholder-${params.slug}`,
    ...placeholderMood,
    createdAt: new Date().toISOString(),
  }

  // Empty fragments array for now (will be populated when DB is ready)
  const fragments: Fragment[] = []

  return <SharedSpace mood={mood} initialFragments={fragments} />
}

