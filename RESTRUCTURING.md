# Reyaq Restructuring: Emotional Platform

## Overview

Reyaq has been restructured from a synchronous co-creation platform to a **mood-based emotional platform** with public Shared Emotional Spaces and an Emotional Weather Map.

## Core Philosophy

- **No profiles, feeds, or follows** - Anonymous/pseudonymous emotional expression
- **Public emotional spaces** - One space per mood, accessible to all
- **Pseudonymity** - Automatic pseudonym assignment (e.g., "Calm Leaf", "Lost Ember")
- **Real-time activity** - Emotional Weather Map shows live mood activity

## Primary Features (CORE)

### 1. Emotional Weather Map (`/`)
- **Home page** showing real-time mood activity
- Visual representation of mood "bubbles" with activity intensity
- No login required to browse
- Clicking a mood leads to its Shared Emotional Space

### 2. Shared Emotional Spaces (`/mood/[slug]`)
- **Public pages** for each mood (e.g., `/mood/tender`)
- Anonymous/pseudonymous fragments displayed chronologically
- Fragment types: text (initial), audio, doodles (future)
- Contributions require login (Google OAuth)
- No likes, comments, profiles, or threads
- Optional: Whisper feature for private replies

### 3. Pseudonym System
- Automatic assignment on first login
- Format: Adjective + Noun (e.g., "Calm Leaf", "Lost Ember")
- Ensures uniqueness
- No user control over pseudonym (maintains anonymity)

## Secondary Features (OPTIONAL)

### Synchronous Co-Creation Engine
- **Kept as optional feature** for deeper interaction
- 2-user matching based on mood
- "Finish My Thought" ritual
- Creates Rooms and stores Moments
- Useful for sourcing emotional fragments
- Accessible via `/app` routes (protected)

## New Database Schema

### Core Tables
- `moods` - Mood catalog (id, name, slug, color_theme, description)
- `fragments` - Emotional content (id, mood_id, user_id, type, content, created_at)
- `whispers` - Private replies (id, fragment_id, sender_id, recipient_id, content, created_at)
- `profiles` - Updated with `pseudonym` column

### Existing Tables (Preserved)
- `matching_queue` - For optional co-creation
- `rooms` - For optional co-creation
- `moments` - For optional co-creation
- `messages` - For optional co-creation

## New Core Services

```
core/
  moods/          # Database-driven mood catalog
  fragments/      # Fragment creation and listing
  pseudonyms/    # Pseudonym generation and assignment
  weather/       # Emotional Weather Map data
  whispers/      # Private reply system
  (existing)     # Matching, moments, rooms, chat (optional)
```

## API Routes

### Public (No Auth Required)
- `GET /api/weather` - Get Emotional Weather Map data
- `GET /api/mood/[slug]/fragments` - List fragments for a mood

### Authenticated
- `POST /api/mood/[slug]/fragments/create` - Create a fragment
- `POST /api/whispers/create` - Send a whisper
- `GET /api/whispers` - List received whispers

## Pages

- `/` - Emotional Weather Map (home page)
- `/mood/[slug]` - Shared Emotional Space for a mood
- `/login` - Google OAuth login
- `/app/*` - Optional co-creation features (protected)

## Migration Steps

1. **Run database migrations:**
   ```sql
   -- Run in Supabase SQL Editor or via psql
   \i db/migrations/0006_emotional_platform_core.sql
   \i db/migrations/0007_seed_initial_moods.sql
   ```

2. **Update environment variables** (if needed)

3. **Deploy** - The new structure is backward compatible with existing co-creation features

## Key Changes

### Home Page
- **Before:** Marketing landing page
- **After:** Emotional Weather Map showing real-time mood activity

### Mood Selection
- **Before:** Static mood list for matching
- **After:** Database-driven moods with public spaces

### User Identity
- **Before:** Email/name from Google profile
- **After:** Automatic pseudonym assignment (e.g., "Calm Leaf")

### Content Model
- **Before:** Moments (co-created responses)
- **After:** Fragments (individual emotional expressions)

### Access Control
- **Before:** All features required authentication
- **After:** Browsing is public, contributions require auth

## Design Principles

1. **Emotional content is the medium** - Not profiles or social graphs
2. **Pseudonymity and safety** - Automatic pseudonyms, no persistent identity
3. **Public spaces** - Shared Emotional Spaces are open to all
4. **Real-time activity** - Weather Map updates every 30 seconds
5. **Optional depth** - Co-creation features available but not required

## Future Enhancements

- Audio fragment support
- Doodle fragment support
- Enhanced Whisper UI
- Mood-specific color themes in UI
- Real-time fragment updates via Supabase Realtime
- Fragment search/filtering
- Mood analytics

