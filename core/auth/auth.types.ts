import type { Profile } from '@prisma/client'

export type AuthenticatedProfile = Profile

export type AuthContext = {
  profile: AuthenticatedProfile
  accessToken: string
}


