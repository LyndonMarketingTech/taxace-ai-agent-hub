# TaxAce AI Agent Hub (Next.js + Auth.js + Neon)

Internal guide hub for MarGine, Newella, Vidora and Webtrix, now behind Google sign-in.

- **Auth:** Auth.js v5, Google provider, limited to `ALLOWED_EMAIL_DOMAINS` (default `taxace.com`) plus optional `ALLOWED_EMAILS`.
- **Database:** Neon Postgres stores users and accounts (JWT sessions, 12 h).
- **Protection:** `proxy.ts` redirects every anonymous request to `/login`. Guide content lives in `content/` (never in `public/`), and agent images are served through `/img/[name]`, which also requires sign-in. Only the logo, favicon, `hub.js` and `/login` are public.

## Setup

1. **Neon:** create a project, copy the **pooled** connection string.
2. **Create tables** (once):
   ```powershell
   $env:DATABASE_URL = "postgresql://..."
   npm run db:migrate
   ```
3. **Google OAuth:** Google Cloud Console > APIs & Services > Credentials > Create OAuth client ID > Web application.
   Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR-VERCEL-DOMAIN/api/auth/callback/google`
   (If the OAuth consent screen is set to "Internal" for your Workspace, only taxace.com users can even attempt sign-in.)
4. **Env vars:** copy `.env.example` to `.env.local` and fill it in. Generate `AUTH_SECRET` with `npx auth secret`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (`.env*` is git-ignored).
2. Vercel > Add New > Project > import the repo (framework auto-detects as Next.js).
3. Add env vars: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ALLOWED_EMAIL_DOMAINS`.
4. Deploy, then add the production callback URL to the Google OAuth client.

## Editing content

The original single-file site was split into `content/hub.html` (page body), `app/hub.css` (styles) and `public/hub.js` (view switching). Edit the HTML in `content/hub.html`.
