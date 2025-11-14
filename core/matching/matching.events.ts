import { createLogger } from '@/utils/helpers'
import { eventBus } from '../events/event-bus'

const logger = createLogger('matching-events')

eventBus.on('match_attempt', (payload) => {
  logger.info('Match attempt', payload)
})

eventBus.on('match_made', (payload) => {
  logger.info('Match made', payload)
})


