import { z } from 'zod'

export const moodSelectSchema = z.object({
  moodId: z.string().min(1),
})

export const matchRequestSchema = z.object({
  moodId: z.string().min(1),
})

export const momentResponseSchema = z.object({
  momentId: z.string().uuid(),
  response: z.string().min(1).max(500),
})

export const roomCreateSchema = z.object({
  partnerId: z.string().uuid(),
})

export const roomMessageSchema = z.object({
  content: z.string().min(1).max(800),
})



