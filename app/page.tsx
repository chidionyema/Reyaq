import WeatherMap from '@/app/components/WeatherMap'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="min-h-screen">
      <WeatherMap />
    </main>
  )
}

