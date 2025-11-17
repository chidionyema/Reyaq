'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthSession } from '@/app/hooks/useAuthSession'
import GlobalHeader from '@/app/components/GlobalHeader'

type MoodData = {
  slug: string
  name: string
  color: string
  emoji: string
}

// Static placeholder mood data - same as landing page
const moods: MoodData[] = [
  { slug: 'tender', name: 'Tender', color: '#F9D6E9', emoji: '🌸' },
  { slug: 'curious', name: 'Curious', color: '#D1F2FF', emoji: '🌀' },
  { slug: 'lost', name: 'Lost', color: '#DED9FF', emoji: '🌑' },
  { slug: 'anxious', name: 'Anxious', color: '#FFDADA', emoji: '⚡' },
  { slug: 'calm', name: 'Calm', color: '#E7FFDE', emoji: '🌿' },
  { slug: 'playful', name: 'Playful', color: '#FFF6D2', emoji: '✨' },
]

type Intensity = 'low' | 'medium' | 'high' | null

const intensityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const getIntensityPhrase = (moodName: string, intensity: Intensity): string => {
  if (!intensity) return moodName
  const intensityMap: Record<string, string> = {
    low: 'slightly',
    medium: '',
    high: 'deeply',
  }
  const prefix = intensityMap[intensity]
  const baseName = moodName.toLowerCase()
  return prefix ? `${prefix} ${baseName}` : baseName
}

export default function MoodSelectPage() {
  const router = useRouter()
  const session = useAuthSession()
  const [selectedMood, setSelectedMood] = useState<MoodData | null>(null)
  const [intensity, setIntensity] = useState<Intensity>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!session?.access_token) {
      router.push('/login?redirectTo=/mood-select')
    }
  }, [session, router])

  if (!session?.access_token) {
    return null
  }

  const handleMoodSelect = (mood: MoodData) => {
    setSelectedMood(mood)
    // Reset intensity when changing mood
    setIntensity(null)
  }

  const handleConnect = () => {
    if (selectedMood && intensity) {
      router.push(`/match/${selectedMood.slug}`)
    }
  }

  const handleExplore = () => {
    if (selectedMood) {
      router.push(`/mood/${selectedMood.slug}`)
    }
  }

  const canConnect = selectedMood !== null && intensity !== null

  return (
    <div className="min-h-screen bg-mist-white text-ink-shadow">
      <GlobalHeader />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12 text-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-ink-shadow/60">
            Choose your wavelength.
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-ink-shadow">
            What mood are you bringing in?
          </h1>
          <p className="mt-3 text-base text-ink-shadow/70">
            Pick how you feel. We&apos;ll find someone who feels it, too.
          </p>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {moods.map((mood) => {
            const isSelected = selectedMood?.slug === mood.slug
            return (
              <button
                key={mood.slug}
                onClick={() => handleMoodSelect(mood)}
                className={`group relative rounded-3xl bg-white/90 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 ${
                  isSelected
                    ? 'border-ink-shadow/30 ring-2 ring-offset-2 ring-ink-shadow/20 scale-[1.03]'
                    : 'border-ink-shadow/5 hover:border-ink-shadow/10'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className="rounded-full mb-4 transition-all duration-300 flex items-center justify-center text-4xl"
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: mood.color,
                      opacity: isSelected ? 1 : 0.8,
                      boxShadow: isSelected ? `0 0 30px ${mood.color}60` : 'none',
                      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <span className="drop-shadow-sm">{mood.emoji}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-ink-shadow">
                    {mood.name}
                  </h2>
                  {isSelected && (
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink-shadow/50">
                      Selected
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Intensity Slider (shown after mood selection) */}
        {selectedMood && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="space-y-4">
              <label className="block text-base font-medium text-ink-shadow">
                How strong is this feeling right now?
              </label>
              <div className="flex gap-4 justify-center">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                      intensity === level
                        ? 'border-ink-shadow bg-ink-shadow text-white'
                        : 'border-ink-shadow/20 bg-white/50 text-ink-shadow/70 hover:border-ink-shadow/40 hover:text-ink-shadow'
                    }`}
                  >
                    {intensityLabels[level]}
                  </button>
                ))}
              </div>
              {intensity && (
                <p className="text-lg text-ink-shadow/60 italic mt-4">
                  {getIntensityPhrase(selectedMood.name, intensity)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons (shown after mood and intensity selection) */}
        {selectedMood && intensity && (
          <div className="mt-8 space-y-4">
            <button
              onClick={handleConnect}
              className="w-full px-8 py-4 rounded-2xl text-base font-semibold bg-gradient-violet-ember text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              Connect with someone in this mood
            </button>
            <button
              onClick={handleExplore}
              className="w-full px-8 py-4 rounded-2xl text-base font-semibold border-2 border-ink-shadow/20 bg-white/50 text-ink-shadow hover:border-ink-shadow/40 hover:bg-white/70 transition-all duration-200"
            >
              Explore this mood space instead
            </button>
          </div>
        )}

        {/* Back to landing link */}
        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-ink-shadow/50 hover:text-ink-shadow/70 transition-colors underline"
          >
            Just explore the spaces instead
          </Link>
        </div>
      </div>
    </div>
  )
}
