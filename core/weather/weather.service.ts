import { getSupabaseServiceClient } from '@/lib/supabase/service'
import type { MoodWithActivity } from '../moods/moods.types'

// Get mood activity in the last hour
const getRecentActivityWindow = () => {
  const oneHourAgo = new Date()
  oneHourAgo.setHours(oneHourAgo.getHours() - 1)
  return oneHourAgo.toISOString()
}

export const getWeatherMap = async (): Promise<MoodWithActivity[]> => {
  const supabase = getSupabaseServiceClient()
  const since = getRecentActivityWindow()

  // Fetch all moods
  const { data: moods, error: moodsError } = await supabase
    .from('moods')
    .select('id, name, slug, color_theme, description, created_at')
    .order('name', { ascending: true })

  if (moodsError || !moods) {
    throw new Error(moodsError?.message ?? 'Unable to load moods')
  }

  // Fetch fragment counts per mood in the last hour
  const { data: activity, error: activityError } = await supabase
    .from('fragments')
    .select('mood_id, created_at')
    .gte('created_at', since)

  if (activityError) {
    throw new Error(activityError.message)
  }

  // Count fragments per mood and find most recent activity
  const activityMap = new Map<string, { count: number; lastAt?: string }>()

  activity?.forEach((fragment) => {
    const existing = activityMap.get(fragment.mood_id) ?? { count: 0 }
    activityMap.set(fragment.mood_id, {
      count: existing.count + 1,
      lastAt: existing.lastAt
        ? existing.lastAt > fragment.created_at
          ? existing.lastAt
          : fragment.created_at
        : fragment.created_at,
    })
  })

  // Combine moods with activity data
  return moods.map((mood) => {
    const activityData = activityMap.get(mood.id) ?? { count: 0 }
    return {
      id: mood.id,
      name: mood.name,
      slug: mood.slug,
      colorTheme: mood.color_theme,
      description: mood.description ?? undefined,
      createdAt: mood.created_at,
      recentActivity: activityData.count,
      lastActivityAt: activityData.lastAt,
    }
  })
}

export const getMoodActivity = async (moodId: string): Promise<number> => {
  const supabase = getSupabaseServiceClient()
  const since = getRecentActivityWindow()

  const { count, error } = await supabase
    .from('fragments')
    .select('*', { count: 'exact', head: true })
    .eq('mood_id', moodId)
    .gte('created_at', since)

  if (error) {
    throw new Error(error.message)
  }

  return count ?? 0
}

