import type { RitualDefinition } from '@/utils/types'

export const finishMyThought: RitualDefinition = {
  id: 'finish_my_thought',
  prompt: 'Finish this sentence: Right now I wish I could…',
  responseType: 'text',
  steps: 1,
  reveal: 'immediate',
}


