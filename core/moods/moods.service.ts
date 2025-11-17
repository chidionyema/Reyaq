import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { eventBus } from '../events/event-bus'
import type { Mood, MoodWithActivity } from './moods.types'

type MoodRow = {
  id: string
  name: string
  slug: string
  color_theme: string
  description: string | null
  created_at: string
}

const mapMood = (row: MoodRow): Mood => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  colorTheme: row.color_theme,
  description: row.description ?? undefined,
  createdAt: row.created_at,
})

export const listMoods = async (): Promise<Mood[]> => {
  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from('moods')
    .select('id, name, slug, color_theme, description, created_at')
    .order('name', { ascending: true })

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to load moods')
  }

  return data.map(mapMood)
}

export const getMoodBySlug = async (slug: string): Promise<Mood | null> => {
  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from('moods')
    .select('id, name, slug, color_theme, description, created_at')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return mapMood(data)
}

export const selectMood = (userId: string, moodId: string) => {
  eventBus.emit('mood_selected', { userId, moodId })
}
