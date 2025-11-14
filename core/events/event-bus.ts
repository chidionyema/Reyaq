import { EventEmitter } from 'events'
import type { ReyaqEvent, ReyaqEventHandler, ReyaqEventMap } from './event-types'

class EventBus {
  private emitter = new EventEmitter()

  emit<TEvent extends ReyaqEvent>(
    event: TEvent,
    payload: ReyaqEventMap[TEvent]
  ): void {
    this.emitter.emit(event, payload)
  }

  on<TEvent extends ReyaqEvent>(
    event: TEvent,
    handler: ReyaqEventHandler<TEvent>
  ): void {
    this.emitter.on(event, handler as ReyaqEventHandler<ReyaqEvent>)
  }
}

const globalAny = global as typeof globalThis & {
  __REYAQ_EVENT_BUS__?: EventBus
}

export const eventBus = (() => {
  if (!globalAny.__REYAQ_EVENT_BUS__) {
    globalAny.__REYAQ_EVENT_BUS__ = new EventBus()
  }
  return globalAny.__REYAQ_EVENT_BUS__
})()


