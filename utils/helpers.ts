export const assertUnreachable = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`)
}

export const now = () => new Date()

export const secondsAgo = (seconds: number) =>
  new Date(Date.now() - seconds * 1000)

export const createLogger = (scope: string) => ({
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(`[${scope}] ${message}`, meta ?? {})
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(`[${scope}] ${message}`, meta ?? {})
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    console.error(`[${scope}] ${message}`, meta ?? {})
  },
})



