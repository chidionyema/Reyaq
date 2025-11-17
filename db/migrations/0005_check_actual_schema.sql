-- Diagnostic: Check what columns actually exist in the database
-- Run this first to see the real column names

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND (table_name = 'Moment' OR LOWER(table_name) = 'moment')
ORDER BY table_name, ordinal_position;

-- If the columns exist but PostgREST can't see them, 
-- it's a schema cache issue. The migration 0004 should fix permissions,
-- but PostgREST might need a manual schema reload.

