-- Seed initial moods for the Emotional Platform
-- These match the original mood options but are now database-driven

INSERT INTO moods (name, slug, color_theme, description) VALUES
  ('Calm', 'calm', 'violet', 'A peaceful, serene emotional space'),
  ('Curious', 'curious', 'ember', 'A space for wonder and exploration'),
  ('Restless', 'restless', 'pink', 'A space for energy and movement'),
  ('Tender', 'tender', 'rose', 'A gentle, caring emotional space'),
  ('Bold', 'bold', 'orange', 'A confident, courageous space')
ON CONFLICT (slug) DO NOTHING;

