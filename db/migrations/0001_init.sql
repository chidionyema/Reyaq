-- Prisma-style SQL migration for Reyaq schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Room" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "user_a_id" UUID NOT NULL,
  "user_b_id" UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS "Moment" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "user_a_id" UUID NOT NULL,
  "user_b_id" UUID NOT NULL,
  "mood" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "user_a_response" TEXT,
  "user_b_response" TEXT,
  "synclight" BOOLEAN NOT NULL DEFAULT FALSE,
  "room_id" UUID
);

CREATE TABLE IF NOT EXISTS "Message" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "room_id" UUID NOT NULL,
  "sender_id" UUID NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE "Room"
  ADD CONSTRAINT "Room_user_a_id_fkey" FOREIGN KEY ("user_a_id") REFERENCES profiles ("user_id"),
  ADD CONSTRAINT "Room_user_b_id_fkey" FOREIGN KEY ("user_b_id") REFERENCES profiles ("user_id");

ALTER TABLE "Moment"
  ADD CONSTRAINT "Moment_user_a_id_fkey" FOREIGN KEY ("user_a_id") REFERENCES profiles ("user_id"),
  ADD CONSTRAINT "Moment_user_b_id_fkey" FOREIGN KEY ("user_b_id") REFERENCES profiles ("user_id"),
  ADD CONSTRAINT "Moment_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room" ("id");

ALTER TABLE "Message"
  ADD CONSTRAINT "Message_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room" ("id");

CREATE INDEX IF NOT EXISTS "Moment_room_id_idx" ON "Moment"("room_id");
CREATE INDEX IF NOT EXISTS "Room_users_idx" ON "Room"("user_a_id", "user_b_id");
CREATE INDEX IF NOT EXISTS "Message_room_idx" ON "Message"("room_id");


