'use client'

import { useState, FormEvent } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thanks! We\'ll be in touch soon.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-6 py-4 rounded-full border-2 border-reyaq-violet/20 bg-white/80 backdrop-blur-sm text-ink-shadow placeholder:text-ink-shadow/50 focus:outline-none focus:border-reyaq-violet focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-8 py-4 rounded-full bg-gradient-violet-ember text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? 'Joining...' : 'Join Early Access'}
        </button>
      </form>
      
      {message && (
        <p className={`mt-4 text-sm text-center ${
          status === 'success' ? 'text-reyaq-violet' : 'text-pulse-pink'
        }`}>
          {message}
        </p>
      )}
      
      <p className="mt-6 text-xs text-ink-shadow/60 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  )
}

