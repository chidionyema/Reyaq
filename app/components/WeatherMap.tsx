'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useAuthSession } from '@/app/hooks/useAuthSession'
import GlobalHeader from '@/app/components/GlobalHeader'

type MoodData = {
  slug: string
  name: string
  color: string
  count: number
  emoji: string
  activityLabel: string
}

// Static placeholder mood data - always displayed
const moods: MoodData[] = [
  { slug: 'tender', name: 'Tender', color: '#F9D6E9', count: 42, emoji: '🌸', activityLabel: '42 emotions surfaced' },
  { slug: 'curious', name: 'Curious', color: '#D1F2FF', count: 31, emoji: '🌀', activityLabel: '31 fragments flowing' },
  { slug: 'lost', name: 'Lost', color: '#DED9FF', count: 19, emoji: '🌑', activityLabel: '19 voices drifting' },
  { slug: 'anxious', name: 'Anxious', color: '#FFDADA', count: 56, emoji: '⚡', activityLabel: '56 trembling thoughts' },
  { slug: 'calm', name: 'Calm', color: '#E7FFDE', count: 21, emoji: '🌿', activityLabel: '21 quiet reflections' },
  { slug: 'playful', name: 'Playful', color: '#FFF6D2', count: 84, emoji: '✨', activityLabel: '84 sparks shared' },
]

export default function WeatherMap() {
  const session = useAuthSession()

  // Generate floating dots positions deterministically to avoid hydration issues
  const floatingDots = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      // Use index as seed for deterministic randomness
      const seed = i * 0.618033988749 // Golden ratio for better distribution
      return {
        width: (Math.sin(seed) * 2 + 2).toFixed(1),
        height: (Math.cos(seed * 2) * 2 + 2).toFixed(1),
        left: ((Math.sin(seed * 3) * 0.5 + 0.5) * 100).toFixed(1),
        top: ((Math.cos(seed * 5) * 0.5 + 0.5) * 100).toFixed(1),
        delay: (Math.sin(seed * 7) * 5 + 5).toFixed(1),
        duration: (Math.sin(seed * 11) * 5 + 20).toFixed(1),
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-mist-white relative overflow-hidden">
      {/* Ambient background layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-drift-slow" 
          style={{ 
            background: 'radial-gradient(circle, rgba(196, 181, 253, 0.4) 0%, rgba(191, 219, 254, 0.3) 50%, rgba(221, 214, 254, 0.4) 100%)',
          }} 
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-drift-slow-reverse" 
          style={{ 
            background: 'radial-gradient(circle, rgba(233, 213, 255, 0.3) 0%, rgba(252, 231, 243, 0.4) 50%, rgba(255, 228, 230, 0.3) 100%)',
          }} 
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-drift-center" 
          style={{
            background: 'radial-gradient(circle, rgba(239, 246, 255, 0.2) 0%, transparent 70%)'
          }}
        />
        
        {/* Floating dots pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          {floatingDots.map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-ink-shadow animate-float"
              style={{
                width: `${dot.width}px`,
                height: `${dot.height}px`,
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                animationDelay: `${dot.delay}s`,
                animationDuration: `${dot.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        {/* Header */}
        <GlobalHeader />

        {/* Subtle CTA for logged-in users */}
        {session?.access_token && (
          <div className="mx-auto max-w-4xl px-6 pt-6">
            <Link
              href="/mood-select"
              className="inline-flex items-center gap-2 text-sm text-ink-shadow/60 hover:text-ink-shadow/80 transition-colors group"
            >
              <span>Continue where you left off</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        )}

        {/* Hero */}
        <section className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold mb-8 text-ink-shadow leading-tight">
              🌀 Emotional Weather
            </h1>
            <p className="text-xl sm:text-2xl text-ink-shadow/70 leading-relaxed mb-4">
              Feelings, not feeds. Explore how people are feeling right now.
            </p>
            <p className="text-sm sm:text-base text-ink-shadow/40 italic font-light">
              Every fragment you see here was written by someone who felt this way in real life.
            </p>
          </div>
        </section>

        {/* Mood Grid */}
        <section className="py-12 px-6 sm:px-8 lg:px-12 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {moods.map((mood) => {
                const activityIntensity = Math.min(mood.count / 100, 1)
                const bubbleSize = 120 + activityIntensity * 40 // 120-160px
                const opacity = 0.8 + activityIntensity * 0.2

                return (
                  <Link
                    key={mood.slug}
                    href={`/mood/${mood.slug}`}
                    className="group relative rounded-3xl bg-white/90 backdrop-blur-sm p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] border border-ink-shadow/5 hover:border-ink-shadow/10"
                  >
                    <div className="flex flex-col items-center text-center relative">
                      {/* Mood pulse indicator */}
                      <div
                        className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse opacity-60"
                        style={{ backgroundColor: mood.color }}
                      />
                      
                      <div
                        className="rounded-full mb-8 transition-all duration-500 group-hover:scale-110 animate-pulse-soft flex items-center justify-center text-5xl"
                        style={{
                          width: `${bubbleSize}px`,
                          height: `${bubbleSize}px`,
                          backgroundColor: mood.color,
                          opacity,
                          boxShadow: `0 0 40px ${mood.color}40`,
                        }}
                      >
                        <span className="drop-shadow-md">{mood.emoji}</span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-ink-shadow">
                        {mood.name}
                      </h2>
                      <p className="text-sm sm:text-base text-ink-shadow/60 font-medium">
                        {mood.activityLabel}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Narrative / Onboarding strip */}
        <section className="py-16 px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-shadow/70 mb-6">
              What is Reyaq?
            </h2>
            <p className="text-base sm:text-lg text-ink-shadow/50 leading-relaxed font-light">
              Reyaq is not a feed and not a social network. It is a public emotional field — made from the inner lives of real people. You don&apos;t follow accounts. You don&apos;t perform. You just feel, express, and explore.
            </p>
          </div>
        </section>

        {/* Footer CTA (logged out only) */}
        {!session?.access_token && (
          <footer className="py-12 px-6 sm:px-8 lg:px-12 border-t border-ink-shadow/5">
            <div className="mx-auto max-w-4xl text-center space-y-4">
              <p className="text-sm text-ink-shadow/50 font-light">
                Want to add a fragment to one of these spaces?
              </p>
              <Link
                href="/login"
                className="inline-block rounded-xl border border-ink-shadow/20 bg-white/50 px-6 py-2.5 text-sm font-medium text-ink-shadow/70 hover:border-ink-shadow/40 hover:text-ink-shadow hover:bg-white/70 transition-all duration-200"
              >
                Log in to contribute
              </Link>
            </div>
          </footer>
        )}

        {/* Minimal footer (always shown) */}
        <footer className="py-8 px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs text-ink-shadow/40 font-light">
              No profiles. No feeds. Just feelings.
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes pulse-soft {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse-soft {
          animation: pulse-soft 4s ease-in-out infinite;
        }
        
        @keyframes drift-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -40px) scale(1.05);
          }
          50% {
            transform: translate(-20px, 30px) scale(0.95);
          }
          75% {
            transform: translate(40px, 20px) scale(1.02);
          }
        }
        .animate-drift-slow {
          animation: drift-slow 90s ease-in-out infinite;
        }
        
        @keyframes drift-slow-reverse {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-30px, 40px) scale(0.95);
          }
          50% {
            transform: translate(20px, -30px) scale(1.05);
          }
          75% {
            transform: translate(-40px, -20px) scale(1.02);
          }
        }
        .animate-drift-slow-reverse {
          animation: drift-slow-reverse 120s ease-in-out infinite;
        }
        
        @keyframes drift-center {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        .animate-drift-center {
          animation: drift-center 100s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.03;
          }
          50% {
            transform: translate(20px, -30px);
            opacity: 0.06;
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

