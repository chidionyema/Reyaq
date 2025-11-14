import { redirect } from 'next/navigation'
import SocialLoginButtons from '@/components/auth/SocialLoginButtons'
import { createSupabaseServerComponentClient } from '@/lib/supabase/server'

export default async function LoginPage() {
  const supabase = createSupabaseServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session?.user) {
    redirect('/app')
  }

  return (
    <div className="min-h-screen bg-mist-white px-6 py-12">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-ink-shadow/60">
          Welcome to Reyaq
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink-shadow">
          Sign in to co-create
        </h1>
        <p className="mt-2 text-base text-ink-shadow/70">
          Use your Google account. We’ll fast-track you into the Shared Moments
          loop.
        </p>
        <div className="mt-6">
          <SocialLoginButtons />
        </div>
      </div>
    </div>
  )
}


