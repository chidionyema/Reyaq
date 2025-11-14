import { notFound } from 'next/navigation'
import { getMomentById } from '@/core/moments/moments.service'
import MomentView from '@/app/components/MomentView'

type Props = {
  params: { id: string }
  searchParams: { roomId?: string }
}

export default async function MomentPage({ params, searchParams }: Props) {
  const moment = await getMomentById(params.id)
  if (!moment) {
    notFound()
  }

  return (
    <MomentView
      moment={moment}
      roomId={searchParams.roomId}
      isSynclight={moment.synclight}
    />
  )
}


