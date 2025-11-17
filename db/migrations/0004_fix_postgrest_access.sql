-- Fix PostgREST access to tables created with quoted identifiers
-- PostgREST normalizes table names to lowercase, so we need to ensure proper access

-- Grant usage on schema public to all necessary roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Explicitly grant permissions on each table (including quoted ones)
GRANT ALL PRIVILEGES ON TABLE profiles TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE "Room" TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE "Moment" TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE "Message" TO service_role, anon, authenticated;

-- Grant all privileges on all existing tables to service_role (for server-side operations)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant select/insert/update/delete on all tables to anon and authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Ensure future tables get proper permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;

