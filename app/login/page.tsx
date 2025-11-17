import { redirect } from 'next/navigation'
import SocialLoginButtons from '@/components/auth/SocialLoginButtons'
import { createSupabaseServerComponentClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: { error?: string; redirectTo?: string }
}

export default async function LoginPage({ searchParams = {} }: Props) {
  const supabase = createSupabaseServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const hasError = searchParams?.error
  // Default to landing page - never force redirect to mood-select
  const redirectTo = searchParams?.redirectTo || '/'

  // Only redirect if there's a session AND no error parameter
  // This prevents redirect loops when auth fails
  if (session?.user && !hasError) {
    redirect(redirectTo)
  }

  const errorMessage =
    hasError === 'missing_code'
      ? 'Authentication code missing. Please try again.'
      : hasError === 'exchange_failed'
        ? 'Failed to complete authentication. Please try again.'
        : hasError === 'auth'
          ? 'Authentication failed. Please try again.'
          : null

  return (
    <div className="min-h-screen bg-mist-white px-6 py-12">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-ink-shadow/60">
          Welcome to Reyaq
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink-shadow">
          Sign in to contribute
        </h1>
        <p className="mt-2 text-base text-ink-shadow/70">
          Use your Google account. No profile, no followers. Just presence.
        </p>
        {errorMessage && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}
        <div className="mt-6">
            <SocialLoginButtons redirectTo={searchParams?.redirectTo} />
        </div>
      </div>
    </div>
  )
}


