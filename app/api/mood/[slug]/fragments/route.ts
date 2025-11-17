import { NextResponse } from 'next/server'
import { getMoodBySlug } from '@/core/moods/moods.service'
import { listFragmentsForMood } from '@/core/fragments/fragments.service'

type Params = {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const mood = await getMoodBySlug(params.slug)
    if (!mood) {
      return NextResponse.json({ error: 'Mood not found' }, { status: 404 })
    }

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') ?? '50', 10)
    const offset = parseInt(url.searchParams.get('offset') ?? '0', 10)

    const fragments = await listFragmentsForMood(mood.id, limit, offset)

    return NextResponse.json({ mood, fragments })
  } catch (error) {
    console.error('Fragments error', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

