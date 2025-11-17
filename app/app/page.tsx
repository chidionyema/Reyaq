import { listMoods } from '@/core/moods/moods.service'
import MoodSelector from '@/app/components/MoodSelector'

export default function MoodPage() {
  const moods = listMoods()

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


