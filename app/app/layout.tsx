import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerComponentClient } from '@/lib/supabase/server'
import UserNav from '@/app/components/UserNav'

export const dynamic = 'force-dynamic'

type Props = {
  children: ReactNode
}

export default async function AppLayout({ children }: Props) {
  const supabase = createSupabaseServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect('/login')
  }

  const profile =
    (await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })) ?? undefined

  return (
    <div className="min-h-screen bg-mist-white">
      <header className="border-b border-ink-shadow/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold uppercase tracking-[0.5em] text-ink-shadow">
            Reyaq
          </div>
          <UserNav
            email={profile?.email ?? session.user.email}
            fullName={profile?.fullName}
            avatarUrl={profile?.avatarUrl}
          />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}


