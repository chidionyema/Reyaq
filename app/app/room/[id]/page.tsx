import RoomScreen from '@/app/components/RoomScreen'

type Props = {
  params: { id: string }
}

export default function RoomPage({ params }: Props) {
  return <RoomScreen roomId={params.id} />
}


