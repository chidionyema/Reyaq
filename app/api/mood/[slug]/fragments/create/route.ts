import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/core/auth/auth.service'
import { getMoodBySlug } from '@/core/moods/moods.service'
import { createFragment } from '@/core/fragments/fragments.service'
import { z } from 'zod'

const createFragmentSchema = z.object({
  content: z.string().min(1).max(2000),
  type: z.enum(['text', 'audio', 'doodle']).default('text'),
})

type Params = {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: Params
) {
  try {
    const { profile } = await authenticateRequest()
    const body = await request.json()
    const { content, type } = createFragmentSchema.parse(body)

    const mood = await getMoodBySlug(params.slug)
    if (!mood) {
      return NextResponse.json({ error: 'Mood not found' }, { status: 404 })
    }

    const fragment = await createFragment({
      moodId: mood.id,
      userId: profile.userId,
      type,
      content,
    })

    return NextResponse.json({ fragment })
  } catch (error) {
    console.error('Create fragment error', error)
    const status =
      (error as Error).message === 'Invalid session' ? 401 : 400
    return NextResponse.json(
      { error: (error as Error).message },
      { status }
    )
  }
}

