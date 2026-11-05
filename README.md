# TaxAce AI Agent Hub (Next.js + Auth.js + Neon)

Internal guide hub for MarGine, Newella, Vidora and Webtrix, behind email + password sign-in.

- **Accounts are admin-created.** There is no public sign-up. Emails must be on `ALLOWED_EMAIL_DOMAINS` (default `taxace.com`).
- **Auth:** Auth.js v5 Credentials provider, bcrypt password hashes in Neon, 8-hour sessions.
- **Brute-force protection:** 5 wrong passwords locks the account for 15 minutes (an admin reset clears it).
- **Protection:** `proxy.ts` redirects every anonymous request to `/login`. Guide content lives in `content/` (not `public/`), and images are served through `/img/[name]`, which also requires sign-in. Only the logo, favicon, `hub.js` and `/login` are public. Disabling a user blocks them on their next page load.
- **Pages:** `/` hub, `/account` change own password, `/admin` add users, reset passwords, disable/enable (admins only).

## Setup

1. **Neon:** create a project and copy the **pooled** connection string.
2. **Env vars** (`.env.local` locally, Vercel Project Settings in production):
   - `DATABASE_URL`: the Neon string
   - `AUTH_SECRET`: generate with `npx auth secret`
   - `ALLOWED_EMAIL_DOMAINS`: `taxace.com`
3. **Create the table** (once):
   ```bash
   DATABASE_URL='postgresql://...' npm run db:migrate
   ```
4. **Create the first admin** (once):
   ```bash
   DATABASE_URL='postgresql://...' npm run user:add -- "Your Name" you@taxace.com "a-long-temporary-password" --admin
   ```
   After signing in, add everyone else at `/admin` and change your own password at `/account`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push to GitHub (`.env*` is git-ignored).
2. Vercel > Add New > Project > import the repo (Next.js is auto-detected).
3. Add the three env vars above and deploy.

## Editing content

Page body: `content/hub.html`. Styles: `app/hub.css`. View switching: `public/hub.js`.
