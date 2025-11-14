export type AuthenticatedProfile = {
  userId: string
  email: string
  fullName?: string | null
  avatarUrl?: string | null
}

export type AuthContext = {
  profile: AuthenticatedProfile
  accessToken: string
}


