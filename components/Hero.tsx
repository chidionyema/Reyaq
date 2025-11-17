'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-reyaq-violet/20 via-mist-white to-reyaq-ember/20">
      {/* Animated orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-violet-ember rounded-full opacity-30 blur-3xl animate-drift" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-violet-pink rounded-full opacity-30 blur-3xl animate-drift" style={{ animationDelay: '10s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-6 text-ink-shadow animate-fade-in-up">
          Create the moment.
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-ink-shadow/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          A mood-based emotional platform with public Shared Emotional Spaces. 
          No profiles. No feeds. Just anonymous expression and real connection.
        </p>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-ink-shadow px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:opacity-80"
          >
            Enter Reyaq
          </Link>
        </div>
      </div>
    </section>
  )
}

