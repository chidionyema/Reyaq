import Hero from '@/components/Hero'
import Features from '@/components/Features'
import WhyReyaq from '@/components/WhyReyaq'
import Vision from '@/components/Vision'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <WhyReyaq />
      <Vision />
      <Footer />
    </main>
  )
}

