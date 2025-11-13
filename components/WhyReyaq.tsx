'use client'

const features = [
  {
    title: 'Connection without performance',
    description: 'No curated feeds or perfect profiles. Just real moments between two people.',
    gradient: 'from-reyaq-violet to-reyaq-ember',
  },
  {
    title: 'Presence over profiles',
    description: 'Who you are emerges through what you create together, not what you post.',
    gradient: 'from-reyaq-violet to-pulse-pink',
  },
  {
    title: 'A space built between two people',
    description: 'Your Reyaq Room is a private world that grows with every shared moment.',
    gradient: 'from-reyaq-ember to-pulse-pink',
  },
  {
    title: 'A new kind of social network',
    description: 'Where connection happens through creation, not consumption.',
    gradient: 'from-reyaq-violet via-reyaq-ember to-pulse-pink',
  },
]

export default function WhyReyaq() {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center mb-16 text-ink-shadow">
          Why Reyaq
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-gradient-to-br from-mist-white to-white border border-reyaq-violet/10 hover:border-reyaq-violet/30 transition-all animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-1 rounded-full bg-gradient-to-r ${feature.gradient} mb-6`} />
              <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-ink-shadow">
                {feature.title}
              </h3>
              <p className="text-ink-shadow/70 leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

