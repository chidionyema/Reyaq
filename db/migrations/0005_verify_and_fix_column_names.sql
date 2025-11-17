-- Verify actual column names and fix PostgREST access
-- Run this to see what PostgREST actually sees

-- Check what columns exist in the Moment table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Moment' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check lowercase version (what PostgREST sees)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE LOWER(table_name) = 'moment' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- If created_at exists but PostgREST can't see it, try granting explicit column permissions
-- This forces PostgREST to recognize the column
GRANT SELECT (id, created_at, user_a_id, user_b_id, mood, prompt, user_a_response, user_b_response, synclight, room_id) 
ON "Moment" TO anon, authenticated, service_role;

