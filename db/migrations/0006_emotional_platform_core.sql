-- Core Emotional Platform Schema
-- Primary: Emotional Weather Map + Shared Emotional Spaces

-- Moods table (core catalog)
CREATE TABLE IF NOT EXISTS moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color_theme TEXT NOT NULL, -- e.g., 'violet', 'ember', 'pink'
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Update profiles to include pseudonym
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS pseudonym TEXT;

-- Fragments table (core content)
CREATE TABLE IF NOT EXISTS fragments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mood_id UUID NOT NULL REFERENCES moods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'text', -- 'text', 'audio', 'doodle' (future)
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Whispers table (optional private replies)
CREATE TABLE IF NOT EXISTS whispers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fragment_id UUID NOT NULL REFERENCES fragments(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS fragments_mood_id_idx ON fragments(mood_id);
CREATE INDEX IF NOT EXISTS fragments_created_at_idx ON fragments(created_at DESC);
CREATE INDEX IF NOT EXISTS fragments_user_id_idx ON fragments(user_id);
CREATE INDEX IF NOT EXISTS whispers_fragment_id_idx ON whispers(fragment_id);
CREATE INDEX IF NOT EXISTS whispers_recipient_id_idx ON whispers(recipient_id);

-- Grant permissions for PostgREST
GRANT ALL PRIVILEGES ON TABLE moods TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE fragments TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE whispers TO service_role, anon, authenticated;

-- Grant column-level permissions
GRANT SELECT (id, name, slug, color_theme, description, created_at) ON moods TO anon, authenticated, service_role;
GRANT SELECT (id, mood_id, user_id, type, content, created_at) ON fragments TO anon, authenticated, service_role;
GRANT SELECT (id, fragment_id, sender_id, recipient_id, content, created_at) ON whispers TO anon, authenticated, service_role;

