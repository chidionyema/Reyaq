'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type Props = {
  email?: string | null
  fullName?: string | null
  avatarUrl?: string | null
}

export default function UserNav({ email, fullName, avatarUrl }: Props) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-3 rounded-2xl bg-mist-white/80 px-3 py-2 text-left">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={fullName ?? 'Profile'}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-violet-ember text-sm font-semibold text-white">
            {(fullName ?? email ?? 'R').slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-shadow/70">
          {fullName ?? email ?? 'Reyaq Member'}
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="rounded-full border border-ink-shadow/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink-shadow hover:border-ink-shadow/30"
      >
        Sign out
      </button>
    </div>
  )
}



