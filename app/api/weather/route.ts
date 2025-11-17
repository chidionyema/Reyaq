import { NextResponse } from 'next/server'
import { getWeatherMap } from '@/core/weather/weather.service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const weather = await getWeatherMap()
    return NextResponse.json({ weather })
  } catch (error) {
    console.error('Weather map error', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

