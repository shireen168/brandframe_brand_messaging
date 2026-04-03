# BrandFrame — Brand Messaging Generator

> Fill in your brand details. Get a complete brand messaging strategy in seconds.

**Live demo:** _add after deploy_

---

## What it does

BrandFrame replicates the work of a brand consultant. Input basic company details and receive:

- Positioning statement
- Brand promise
- Brand pillars
- Voice and tone profile (traits, dos, don'ts)
- 2 customer personas
- 5 tagline options
- Elevator pitches (short, medium, long)

Guests get 2 free generations per day. Sign in with Google for 10/day plus a saved dashboard.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4, Framer Motion |
| Auth + DB | Supabase (Google OAuth, Postgres + RLS) |
| AI | Claude claude-sonnet-4-6 (Anthropic SDK) |
| Rate limiting | Upstash Redis |
| Hosting | Vercel |

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/shireen-mvps/brandframe_brand_messaging
cd brandframe_brand_messaging
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `UPSTASH_REDIS_REST_URL` | Upstash console → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash console → REST API |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for local dev |

AI calls are hard-blocked if Upstash is not configured.

### 3. Create the Supabase table

1. Go to your Supabase project → SQL Editor
2. Paste and run the contents of `supabase/migrations/001_brand_docs.sql`

This creates the `brand_docs` table with Row Level Security enabled.

### 4. Configure Google OAuth

**In Google Cloud Console:**
1. Go to APIs & Services → Credentials → your OAuth 2.0 Client ID
2. Under Authorized redirect URIs, add:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
   Replace `[your-project-ref]` with your Supabase project reference ID.

**In Supabase:**
1. Authentication → Providers → enable Google, paste your Google Client ID and Secret
2. Authentication → URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note for testing:** Guest rate limits key off your IP. On localhost this is `rl:guest:unknown` in Upstash. Delete this key in the Upstash console to reset your quota during development.

---

## Guardrails

- Rate limits: 2 gen/IP/24h (guest), 10/user/24h (authenticated) via Upstash Redis
- Hard-block if Upstash is unconfigured — never fails open to unlimited usage
- `max_tokens: 2000` cap on every Claude call
- All inputs sanitised and length-capped before reaching the API
- All secrets in `.env.local` only — gitignored
- Set Anthropic spending cap at [console.anthropic.com](https://console.anthropic.com) before deploying

Estimated cost: ~$0.04 per generation.

---

## Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add all 7 environment variables in Vercel project settings
4. Update `NEXT_PUBLIC_SITE_URL` to your Vercel URL
5. In Supabase → URL Configuration, add your Vercel URL to Redirect URLs
6. Deploy

---

Project 3 of 10 in the [AI Marketing Portfolio](https://aiwithshireen.com)
