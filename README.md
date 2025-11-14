# Reyaq MVP – Synchronous Co‑Creation

This repo hosts the first functional slice of **Reyaq**, a synchronous, two-person co-creation product built as a **lean modular monolith**. The MVP proves behaviour (mood matching ➜ ritual ➜ room) without painting us into a corner: core business logic sits in `/core`, API routes stay thin, React components stay presentation-only, and Supabase handles auth + realtime + Postgres (via Prisma).

---

## Tech Stack

- **Next.js 14 App Router** (React Server Components + API routes)
- **TypeScript** end-to-end
- **Supabase** for auth, Postgres, storage, realtime broadcast
- **Prisma** (schema, migrations, typed data access)
- **Tailwind CSS** for design system tokens
- **Event-driven core** via a lightweight in-memory bus in `/core/events`

---

## Project Structure (Modular Monolith)

```
core/
  auth/           # Supabase auth wrapper + request context
  moods/          # Mood catalog + validation
  matching/       # Queue + realtime match orchestration
  moments/        # Shared moments + ritual engine
  rooms/          # Room lifecycle + access control
  chat/           # Messaging writes + events
  synclight/      # Synclight logic + thresholds
  events/         # Event bus + Supabase realtime publisher

app/
  api/            # Thin API routes that call into /core
  app/            # Authenticated experience (/app, /app/matching, /app/moment/[id], /app/room/[id])
  auth/           # OAuth callback handler
  login/          # Google OAuth entry point
  components/     # View-only React components (renders inside / and /app layouts)
  hooks/          # Client hooks (auth session, api helper, realtime channel)

db/
  prisma.schema   # Source of truth for Prisma + Supabase
  migrations/     # SQL snapshot (0001_init.sql)
```

React components **never** import business logic—only data returned from services or constants. Server-only modules (`*.server.ts`) ensure secrets (service role key) stay off the client bundle.

---

## Environment Variables

Copy `env.example` to `.env.local` (and `.env` for Prisma CLI) and fill these:

```
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/postgres?sslmode=require
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # or your deployed origin
```

> Supabase: Project Settings → Database → “Connection string: URI” contains the correct `DATABASE_URL`. Keep the service role key server-only (only `lib/supabase/service.ts` uses it). `NEXT_PUBLIC_SITE_URL` must match the redirect origin configured in Supabase auth settings.

### Supabase Auth setup

1. In Supabase dashboard → **Authentication → Providers**, enable **Google** and supply client ID/secret (Google Cloud → Credentials).
2. Under **Authentication → URL configuration**, set the redirect to `${NEXT_PUBLIC_SITE_URL}/auth/callback`.
3. Hit “Save”, then test by visiting `/login` locally.

### Database + RLS

Run the migrations with:

```bash
npm run db:push        # push Prisma schema (profiles, rooms, moments, messages)
psql ... < db/migrations/0002_profiles_rls.sql   # or run the SQL in Supabase SQL editor
```

The RLS script enables per-user policies on `profiles` so Supabase can enforce row access on the hosted Postgres instance.

---

## Getting Started

1. **Install deps**
   ```bash
   npm install
   ```
2. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```
3. **Push schema to Supabase Postgres (or local Postgres)**
   ```bash
   npm run db:push
   ```
   > Prefer migrations? Create them via `npx prisma migrate dev --schema db/prisma.schema`.
4. **Start dev server**
   ```bash
   npm run dev
   ```
5. **Auth** – visit [`/login`](http://localhost:3000/login) and click “Continue with Google”. Supabase handles the OAuth redirect → `/auth/callback`, syncs your profile into Postgres, then middleware routes you into `/app`.

---

### Authentication UX

- `/login` renders `SocialLoginButtons` (Google OAuth). Once authenticated, users are redirected to `/app`.
- Landing hero retains the “Enter Reyaq” CTA plus an inline Google login toggle.
- `/auth/callback` exchanges the Supabase code for a session, calls `syncProfileFromAuthUser`, and drops users into `/app`.
- `/app` routes (mood, matching, ritual, room) sit behind `middleware.ts` + a server layout that fetches the current profile and renders `UserNav` (avatar/email/sign out).

---

## Domain Overview

| Module          | Responsibility                                                                          |
|-----------------|------------------------------------------------------------------------------------------|
| `core/auth`     | Uses Supabase SSR helpers, syncs `profiles`, emits `user_logged_in`.                     |
| `core/moods`    | Static mood catalogue + validation + `mood_selected` event.                              |
| `core/matching` | In-memory per-mood queues, synclight detection, match orchestration, realtime broadcast. |
| `core/moments`  | Ritual engine + prompt generation, response recording, `moment_started/completed`.      |
| `core/rooms`    | Deterministic room creation (sorted user pair) + guard rails for reads.                 |
| `core/chat`     | Message creation, emits `message_sent`, pushes to Supabase realtime room channel.        |
| `core/events`   | EventEmitter bus + Supabase realtime publisher (`user:{id}`, `room:{id}` channels).      |
| `core/synclight`| Window calculation (default 10s) + emit helper.                                          |

Queues + ritual definitions live fully in memory today, but the structure supports swapping to Redis or JSON definitions later without touching the UI.

---

## API Surface (App Router)

| Route                        | Method | Description                                      |
|------------------------------|--------|--------------------------------------------------|
| `/api/mood/select`           | POST   | Validate mood, emit `mood_selected`.             |
| `/api/match/request`         | POST   | Add user to queue, maybe return match.           |
| `/api/moment/respond`        | POST   | Persist ritual response, emit `moment_completed`.|
| `/api/room/create`           | POST   | Deterministically create/find room for pair.     |
| `/api/room/[id]`             | GET    | Fetch room, guard membership.                    |
| `/api/room/[id]/message`     | POST   | Send chat message + realtime broadcast.          |

Every route authenticates via `core/auth/auth.service.ts` and only delegates to `/core` services.

---

## Frontend Flows

- **Marketing (`/`)** – same landing surface, now with inline Google login + CTA to `/login`.
- **Authenticated area (`/app`)** – mood selection, matching waitroom, ritual, and room log/chat now live under the `/app` segment (protected by middleware + SSR layout).
- **Mood Selection (`/app`)** – shows five moods, calls `/api/mood/select` + `/api/match/request`, routes to `/app/matching` or `/app/moment/[id]`.
- **Matching Waitroom (`/app/matching`)** – listens on Supabase realtime `user:{id}`, displays Synclight pulse.
- **Moment Ritual (`/app/moment/[id]`)** – runs Finish-My-Thought, reveals when both sides submit, lets users go again, exit, or jump to the room.
- **Room (`/app/room/[id]`)** – shows shared moments log + realtime chat (channel `room:{id}`).

Marketing and product now live side-by-side without code duplication.

---

## Realtime & Eventing

- `core/events/event-bus.ts` is a tiny wrapper around Node’s `EventEmitter`.
- `core/events/realtime.publisher.ts` mirrors events to Supabase broadcast channels:
  - `user:{userId}` – match notifications.
  - `room:{roomId}` – chat messages (and future room events).
- Supabase client usage is split into `lib/supabase/service.ts` (service role, server-only) and `lib/supabase/{client,server}.ts` (browser + SSR) to keep secrets off the client bundle.

> Important: the matching queue is in-memory per Node process. For multi-region/scale you’d swap `core/matching/matching.logic.ts` with Redis or Supabase storage, leaving the rest untouched.

---

## Scripts Reference

| Command               | Purpose                                    |
|-----------------------|--------------------------------------------|
| `npm run dev`         | Next.js dev server                         |
| `npm run build`       | Production build                           |
| `npm run db:push`     | Push Prisma schema → DB (`db/prisma.schema`)|
| `npm run db:migrate`  | Apply migrations in production             |
| `npm run db:studio`   | Launch Prisma Studio                       |
| `npm run db:generate` | Regenerate Prisma Client                   |

---

## Next Steps / Notes

- Add a Supabase-powered onboarding flow (magic links, phone, etc.) so test users can authenticate without manual token injection.
- Persist the matching queue externally for horizontal scale and failover.
- Extend the ritual engine with additional JSON definitions inside `core/moments/rituals`.
- Add automated tests around matching + ritual completion (current MVP focuses on behaviour delivery).

**What we make, makes us.**
