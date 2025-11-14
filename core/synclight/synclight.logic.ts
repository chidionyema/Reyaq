const DEFAULT_WINDOW_SECONDS = 10

export const isSynclightWindow = (
  joinedAtA: Date,
  joinedAtB: Date,
  windowSeconds = DEFAULT_WINDOW_SECONDS
) => {
  return Math.abs(joinedAtA.getTime() - joinedAtB.getTime()) <= windowSeconds * 1000
}


