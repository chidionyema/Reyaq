'use client'

export default function SynclightPulse() {
  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-3xl border border-white/20 bg-white/10 px-6 py-5 text-left">
      <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        Synclight
      </div>
      <p className="text-lg text-white">
        Someone chose the same mood within seconds. Feel that? Stay close.
      </p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-full animate-synclight bg-gradient-to-r from-white/60 via-white to-white/60" />
      </div>
    </div>
  )
}



