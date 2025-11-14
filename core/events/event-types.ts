export type ReyaqEventMap = {
  user_logged_in: { userId: string }
  mood_selected: { userId: string; moodId: string }
  user_queued: { userId: string; moodId: string }
  match_attempt: { userId: string; moodId: string }
  match_made: {
    userAId: string
    userBId: string
    momentId: string
    moodId: string
    synclight: boolean
  }
  moment_started: { momentId: string; userAId: string; userBId: string }
  moment_completed: { momentId: string }
  room_created: { roomId: string; userAId: string; userBId: string }
  message_sent: { roomId: string; messageId: string }
  synclight_triggered: {
    momentId: string
    userAId: string
    userBId: string
    moodId: string
  }
}

export type ReyaqEvent = keyof ReyaqEventMap

export type ReyaqEventHandler<TEvent extends ReyaqEvent> = (
  payload: ReyaqEventMap[TEvent]
) => void | Promise<void>


