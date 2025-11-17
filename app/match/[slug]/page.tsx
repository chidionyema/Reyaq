import { redirect } from 'next/navigation'
import { getMoodBySlug } from '@/core/moods/moods.service'
import { createSupabaseServerComponentClient } from '@/lib/supabase/server'
import MatchingScreen from '@/app/components/MatchingScreen'
import GlobalHeader from '@/app/components/GlobalHeader'

export const dynamic = 'force-dynamic'

type Props = {
  params: { slug: string }
}

export default async function MatchPage({ params }: Props) {
  const supabase = createSupabaseServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Require authentication
  if (!session?.user) {
    redirect(`/login?redirectTo=/match/${params.slug}`)
  }

  // Get mood by slug to get the ID
  const mood = await getMoodBySlug(params.slug)
  if (!mood) {
    redirect('/mood-select')
  }

  return (
    <>
      <GlobalHeader />
      <MatchingScreen moodId={mood.id} />
    </>
  )
}

