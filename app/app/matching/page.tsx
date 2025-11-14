import MatchingScreen from '@/app/components/MatchingScreen'

type Props = {
  searchParams: { mood?: string }
}

export default function MatchingPage({ searchParams }: Props) {
  return <MatchingScreen moodId={searchParams.mood} />
}


