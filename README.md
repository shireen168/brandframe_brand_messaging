# BrandFrame — Brand Messaging Generator

> Fill in your brand details. Get a complete brand messaging strategy in seconds.

**Live demo:** _add after deploy_
**Built by** [Shireen](https://github.com/shireen-mvps) · Powered by Claude Code

---

## What it does

BrandFrame replicates the work of a brand consultant. Input your company details and receive a full brand messaging document:

- Positioning statement (competitor-aware; explicitly differentiates if you name rivals)
- Brand promise
- Brand pillars
- Voice and tone profile (traits, dos, don'ts)
- 2 customer personas
- 5 tagline options
- Elevator pitches (short, medium, long)
- Voice in Action: ready-to-use LinkedIn post, Instagram caption, and email subject line written in your brand voice

**UX features:**
- Regenerate any individual section with one click (the refresh icon) without re-running the full generation
- Copy any card to clipboard instantly
- Copy All: exports the complete brand doc as plain text
- Live rate-limit badge updates after each generation
- Generation progress indicator with animated step messages
- Guest upgrade prompt when the free limit is reached

Guests get 2 free generations per day. Sign in with Google for 10 per day, plus a saved dashboard where all sections are fully expanded.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4, Framer Motion |
| Auth and DB | Supabase (Google OAuth, Postgres with RLS) |
| AI | Claude claude-sonnet-4-6 (Anthropic SDK) |
| Rate limiting | Upstash Redis |
| Hosting | Vercel |

---

## API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/generate` | POST | Full brand messaging generation |
| `/api/regenerate` | POST | Regenerate a single section (rate-limited) |
| `/api/save` | POST | Save brand doc to Supabase (auth required) |
| `/auth/callback` | GET | Supabase OAuth callback handler |

---

## Local setup

### 1. Clone and install

```powershell
git clone https://github.com/shireen-mvps/brandframe_brand_messaging
cd brandframe_brand_messaging
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```powershell
Copy-Item .env.local.example .env.local
```

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project, Settings, API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project, Settings, API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project, Settings, API |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `UPSTASH_REDIS_REST_URL` | Upstash console, REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash console, REST API |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for local dev |

AI calls are hard-blocked if Upstash is not configured.

### 3. Create the Supabase table

1. Go to your Supabase project, SQL Editor
2. Paste and run the contents of `supabase/migrations/001_brand_docs.sql`

This creates the `brand_docs` table with Row Level Security enabled.

### 4. Configure Google OAuth

**In Google Cloud Console:**
1. Go to APIs and Services, Credentials, your OAuth 2.0 Client ID
2. Under Authorized redirect URIs, add:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```

**In Supabase:**
1. Authentication, Providers: enable Google, paste your Client ID and Secret
2. Authentication, URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 5. Run locally

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Testing note:** Guest rate limits key off your IP. On localhost this resolves to `rl:guest:unknown` in Upstash. Delete this key in the Upstash console to reset your quota during development.

---

## Guardrails

- Rate limits: 2 gen/IP/24h (guest), 10/user/24h (authenticated) via Upstash Redis
- `/api/regenerate` shares the same rate limit counter; each section regeneration costs 1 credit
- Hard-block if Upstash is unconfigured; never fails open
- `max_tokens: 2500` cap on full generation, `max_tokens: 600` cap on section regeneration
- All inputs sanitised and length-capped before reaching the API
- All secrets in `.env.local` only, gitignored
- Set an Anthropic spending cap at [console.anthropic.com](https://console.anthropic.com) before deploying

Estimated cost: ~$0.04 to $0.05 per full generation, ~$0.005 per section regeneration.

---

## Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Update `NEXT_PUBLIC_SITE_URL` to your Vercel URL
5. In Supabase, URL Configuration: add your Vercel URL to Redirect URLs
6. Deploy

---

## Project status

| Phase | Status |
|---|---|
| Phase 1: Scaffold, guardrails, auth, AI, deploy | Complete |
| Phase 2: UX, loading states, rate limit feedback, copy, regenerate, voice examples | Complete |
| Phase 3: Animation-heavy UI/UX overhaul | Pending |

Built by a Marketing professional specialising in applied AI. View the full portfolio of production-grade AI marketing tools at [aiwithshireen.com](https://aiwithshireen.com) or browse more projects on [GitHub](https://github.com/shireen-mvps).
