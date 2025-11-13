import Hero from '@/components/Hero'
import Features from '@/components/Features'
import WhyReyaq from '@/components/WhyReyaq'
import Vision from '@/components/Vision'
import EmailCapture from '@/components/EmailCapture'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <WhyReyaq />
      <Vision />
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-semibold mb-8 text-ink-shadow">
            Ready to create?
          </h2>
          <p className="text-xl text-ink-shadow/70 mb-12">
            Join early access and be among the first to experience Reyaq.
          </p>
          <EmailCapture />
        </div>
      </section>
      <Footer />
    </main>
  )
}

