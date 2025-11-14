type QueueEntry = {
  userId: string
  moodId: string
  joinedAt: Date
}

const queues = new Map<string, QueueEntry[]>()

export const enqueueUser = (moodId: string, userId: string) => {
  const entry: QueueEntry = { userId, moodId, joinedAt: new Date() }
  const queue = (queues.get(moodId) ?? []).filter(
    (existing) => existing.userId !== userId
  )
  queue.push(entry)
  queues.set(moodId, queue)
  return entry
}

export const popPartner = (
  moodId: string,
  currentUserId: string
): QueueEntry | null => {
  const queue = queues.get(moodId) ?? []
  const partnerIndex = queue.findIndex((entry) => entry.userId !== currentUserId)
  if (partnerIndex === -1) {
    return null
  }
  const [partner] = queue.splice(partnerIndex, 1)
  queues.set(moodId, queue)
  return partner
}

export const removeUserFromQueue = (userId: string) => {
  queues.forEach((entries, moodId) => {
    const filtered = entries.filter((entry) => entry.userId !== userId)
    queues.set(moodId, filtered)
  })
}


