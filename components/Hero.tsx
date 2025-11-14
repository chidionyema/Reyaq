'use client'

import { useState } from 'react'
import Link from 'next/link'
import EmailCapture from './EmailCapture'
import SocialLoginButtons from './auth/SocialLoginButtons'

export default function Hero() {
  const [showLogin, setShowLogin] = useState(false)

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
          Reyaq is the first platform where every interaction is co-created. 
          No profiles. No feeds. Just two people making something real, together.
        </p>

        <div className="animate-fade-in-up space-y-4" style={{ animationDelay: '0.4s' }}>
          <EmailCapture />
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-ink-shadow px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:opacity-80"
            >
              Enter Reyaq
            </Link>
            <button
              onClick={() => setShowLogin((prev) => !prev)}
              className="text-xs uppercase tracking-[0.3em] text-ink-shadow/60 underline-offset-4 hover:underline"
            >
              {showLogin ? 'Hide inline login' : 'Quick login here'}
            </button>
          </div>
          {showLogin && (
            <div className="rounded-3xl border border-ink-shadow/10 bg-white/80 p-6 text-left shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-shadow/50">
                Sign in with
              </p>
              <p className="mt-2 text-base text-ink-shadow/70">
                Jump in instantly with Google—no passwords, just vibes.
              </p>
              <div className="mt-4">
                <SocialLoginButtons />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

