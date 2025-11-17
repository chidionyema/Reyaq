# Reyaq - App Summary

## Overview

**Reyaq** is a synchronous, two-person co-creation platform where users connect through shared creative moments rather than traditional social media profiles or feeds. The core philosophy is: *"What we make, makes us"* — identity emerges through collaborative creation, not curated profiles.

## Core Concept

Reyaq is designed as an alternative to traditional social networks:
- **No profiles or feeds** — Users are defined by what they create together
- **Synchronous matching** — Real-time pairing based on shared moods
- **Co-creation rituals** — Structured activities that two people complete together
- **Private rooms** — Persistent spaces that grow with each shared moment

## User Flow

1. **Authentication** (`/login`)
   - Google OAuth via Supabase
   - Simple, passwordless entry

2. **Mood Selection** (`/app`)
   - User selects from 5 available moods (e.g., calm, energetic, creative)
   - Each mood represents how they want to connect

3. **Matching** (`/app/matching`)
   - User enters a queue for their selected mood
   - System matches them with another user who selected the same mood
   - **Synclight** feature: If both users select the same mood within 10 seconds, they get a special "synclight" moment (highlighted connection)

4. **Shared Moment** (`/app/moment/[id]`)
   - Both users complete a "Finish My Thought" ritual
   - Each user writes their response to a prompt (e.g., "Right now I wish I could...")
   - Responses are revealed only after both users submit
   - Real-time updates so users see when their partner responds

5. **Room** (`/app/room/[id]`)
   - Persistent private space between the two matched users
   - Shows history of all shared moments
   - Real-time chat functionality
   - Room persists across sessions

## Technical Architecture

### Stack
- **Frontend**: Next.js 14 (App Router), React Server Components, TypeScript
- **Backend**: Next.js API routes, Supabase (PostgreSQL, Auth, Realtime)
- **Database**: Supabase PostgreSQL (migrated from Prisma)
- **Styling**: Tailwind CSS with custom design tokens
- **Real-time**: Supabase Realtime channels for live updates

### Architecture Pattern: Modular Monolith

The app follows a clean separation of concerns:

```
core/                    # Business logic (server-only)
  ├── auth/              # Authentication & profile sync
  ├── moods/             # Mood catalog & validation
  ├── matching/          # Queue management & matching logic
  ├── moments/           # Shared moments & ritual engine
  ├── rooms/              # Room lifecycle & access control
  ├── chat/              # Messaging functionality
  ├── synclight/         # Synclight detection (10s window)
  └── events/            # Event bus & realtime publisher

app/
  ├── api/                # Thin API routes (delegate to /core)
  ├── app/                # Authenticated pages
  ├── components/         # React components (presentation-only)
  └── hooks/             # Client-side hooks
```

### Key Features

**Matching System**
- Database-backed queue (Supabase `matching_queue` table)
- Atomic matching to prevent race conditions
- Real-time notifications via Supabase channels

**Real-time Updates**
- Moment responses broadcast to both users instantly
- Chat messages appear in real-time
- Match notifications delivered via user-specific channels

**Ritual Engine**
- Extensible system for co-creation activities
- Currently implements "Finish My Thought" ritual
- Can be extended with additional ritual types

**Synclight**
- Special connection indicator when users select the same mood within 10 seconds
- Visual pulse effect on matching screen
- Creates a sense of serendipitous connection

## Database Schema

**Tables:**
- `profiles` - User profiles synced from Supabase Auth
- `matching_queue` - Queue of users waiting to be matched
- `rooms` - Persistent spaces between user pairs
- `moments` - Shared moment records with responses
- `messages` - Chat messages within rooms

**Key Relationships:**
- Rooms are deterministically created for user pairs (sorted IDs)
- Moments belong to rooms and track both user responses
- Messages are scoped to rooms

## Recent Changes & Current State

### Migration from Prisma to Supabase Client
- Removed Prisma dependency
- All database operations now use Supabase JS client
- Better compatibility with serverless environments (Vercel)
- Direct HTTPS communication instead of TCP connections

### Fixed Issues
- ✅ Real-time moment updates (both users see responses instantly)
- ✅ Message sending (fixed column name mismatches)
- ✅ Matching queue persistence (moved from in-memory to database)
- ✅ Column naming consistency (handled camelCase/snake_case differences)

### Authentication
- Google OAuth via Supabase
- Profile sync on login
- Protected routes with middleware

## Deployment

- **Platform**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Environment**: Serverless functions
- **Real-time**: Supabase Realtime channels

## Design Philosophy

Reyaq challenges traditional social media by:
1. **Removing the performance** - No curated feeds or perfect profiles
2. **Emphasizing presence** - Identity emerges through creation, not posting
3. **Creating private spaces** - Rooms are shared only between two people
4. **Focusing on co-creation** - Every interaction requires both participants

## Future Enhancements

- Additional ritual types beyond "Finish My Thought"
- Enhanced matching algorithms
- Mobile app
- Extended room features
- More mood options

---

**Tagline**: *"Create the moment."*

**Vision**: *"Reyaq is the first co-creation network. A place where every connection starts with something you build together. No algorithms. No feeds. Just two people, one moment, infinite possibilities."*

