'use client'

const steps = [
  {
    number: '1',
    title: 'Pick your mood',
    description: 'Choose how you want to connect and what you want to create.',
    icon: '✨',
  },
  {
    number: '2',
    title: 'Get paired',
    description: 'We match you with someone who shares your moment.',
    icon: '🔗',
  },
  {
    number: '3',
    title: 'Co-create a spark',
    description: 'Build something together. No pressure, just presence.',
    icon: '💫',
  },
  {
    number: '4',
    title: 'Build your shared space',
    description: 'Your Reyaq Room grows with every moment you create.',
    icon: '🏠',
  },
]

export default function Features() {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-mist-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center mb-16 text-ink-shadow">
          How it works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-violet-ember flex items-center justify-center text-4xl animate-pulse-soft">
                  {step.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-reyaq-violet mb-3">
                {step.number}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-ink-shadow">
                {step.title}
              </h3>
              <p className="text-ink-shadow/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

