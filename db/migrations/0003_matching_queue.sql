-- Create matching queue table for serverless-compatible matching
CREATE TABLE IF NOT EXISTS matching_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  mood_id TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by mood
CREATE INDEX IF NOT EXISTS matching_queue_mood_idx ON matching_queue(mood_id, joined_at);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS matching_queue_user_idx ON matching_queue(user_id);

-- Ensure one user can only be in queue once (per mood)
CREATE UNIQUE INDEX IF NOT EXISTS matching_queue_user_mood_unique ON matching_queue(user_id, mood_id);

