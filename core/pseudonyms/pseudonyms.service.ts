import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { randomUUID } from 'crypto'

// Pseudonym generation: Adjective + Noun
const adjectives = [
  'Calm', 'Lost', 'Bright', 'Quiet', 'Warm', 'Cool', 'Soft', 'Sharp',
  'Gentle', 'Wild', 'Still', 'Rushing', 'Deep', 'Light', 'Hollow', 'Full',
  'Tender', 'Rough', 'Smooth', 'Brittle', 'Strong', 'Fragile', 'Ancient', 'New',
  'Distant', 'Close', 'Vast', 'Tiny', 'Bold', 'Shy', 'Loud', 'Silent'
]

const nouns = [
  'Leaf', 'Ember', 'Wave', 'Stone', 'Wind', 'Cloud', 'Star', 'Moon',
  'River', 'Ocean', 'Mountain', 'Valley', 'Forest', 'Desert', 'Sky', 'Earth',
  'Flame', 'Shadow', 'Light', 'Dark', 'Dawn', 'Dusk', 'Storm', 'Calm',
  'Echo', 'Silence', 'Song', 'Whisper', 'Thunder', 'Rain', 'Snow', 'Sun'
]

const generatePseudonym = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adjective} ${noun}`
}

const ensureUniquePseudonym = async (): Promise<string> => {
  const supabase = getSupabaseServiceClient()
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const pseudonym = generatePseudonym()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('pseudonym')
      .eq('pseudonym', pseudonym)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check pseudonym uniqueness: ${error.message}`)
    }

    if (!data) {
      // Pseudonym is unique
      return pseudonym
    }

    attempts++
  }

  // Fallback: add random number if we can't find unique combination
  return `${generatePseudonym()} ${Math.floor(Math.random() * 1000)}`
}

export const assignPseudonym = async (userId: string): Promise<string> => {
  const supabase = getSupabaseServiceClient()

  // Check if user already has a pseudonym
  const { data: existing } = await supabase
    .from('profiles')
    .select('pseudonym')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing?.pseudonym) {
    return existing.pseudonym
  }

  // Generate and assign new pseudonym
  const pseudonym = await ensureUniquePseudonym()

  const { error } = await supabase
    .from('profiles')
    .update({ pseudonym })
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to assign pseudonym: ${error.message}`)
  }

  return pseudonym
}

export const getPseudonym = async (userId: string): Promise<string | null> => {
  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('pseudonym')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to get pseudonym: ${error.message}`)
  }

  return data?.pseudonym ?? null
}

