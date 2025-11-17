export type Mood = {
  id: string
  name: string
  slug: string
  colorTheme: string
  description?: string
  createdAt: string
}

export type MoodWithActivity = Mood & {
  recentActivity: number // Count of fragments in last hour
  lastActivityAt?: string
}

