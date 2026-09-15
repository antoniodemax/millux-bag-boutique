# Millux Collections — Deployment

Frontend: Vercel → https://milluxcollections.vercel.app
Backend:  Render  → https://millux-collections-api.onrender.com
Database: PostgreSQL (Render)

## Backend (Render web service)

| Setting        | Value                          |
|----------------|--------------------------------|
| Root directory | `backend`                      |
| Build command  | `npm ci && npm run build`      |
| Start command  | `npm start`                    |

`typescript` and the `@types/*` packages live in `dependencies` on purpose: Render
sets `NODE_ENV=production`, which makes npm skip `devDependencies`, and the build
needs the compiler and type packages.

On start the server connects to PostgreSQL and applies every file in
`backend/migrations/*.sql` that is not yet recorded in `schema_migrations`
(see `src/db/migrate.ts`). The migrations are idempotent, so this is safe on
every deploy. To run them manually: `npm run migrate` (after `npm run build`).

### Environment variables

| Variable              | Production value / note                                          |
|-----------------------|------------------------------------------------------------------|
| `NODE_ENV`            | `production` (turns on `Secure; SameSite=None` auth cookies)     |
| `PORT`                | provided by Render                                               |
| `DATABASE_URL`        | Render PostgreSQL connection string                              |
| `JWT_SECRET`          | long random string                                               |
| `FRONTEND_URL`        | `https://milluxcollections.vercel.app` (exact origin, no slash)  |
| `BACKEND_URL`         | `https://millux-collections-api.onrender.com`                    |
| `UPLOAD_DIR`          | `./uploads` (Render's disk is ephemeral; uploads vanish on redeploy unless a persistent disk is attached) |
| `GOOGLE_CLIENT_ID`    | from Google Cloud console                                        |
| `GOOGLE_CLIENT_SECRET`| from Google Cloud console                                        |
| `GOOGLE_CALLBACK_URL` | `https://millux-collections-api.onrender.com/api/auth/google/callback` (must also be an authorised redirect URI in Google Cloud) |
| `ADMIN_GOOGLE_EMAIL`  | the one Google account allowed to become admin via Google sign-in |

### First admin user

Email/password admins are created either by the seed script
(`admin@millux.com`, see `backend/seeds/seed.database.ts`) or by an existing admin
via Admin → Settings → "Create admin user" (`POST /api/auth/register`). Google
sign-in creates the admin automatically for `ADMIN_GOOGLE_EMAIL`.

## Frontend (Vercel)

| Setting          | Value                                            |
|------------------|--------------------------------------------------|
| Framework        | Vite                                             |
| Build command    | `npm run build`                                  |
| Output directory | `dist`                                           |
| `VITE_API_BASE_URL` | `https://millux-collections-api.onrender.com` |

`vercel.json` rewrites every path (including `/admin/*`) to `index.html` so
direct navigation to SPA routes works.

## Local development

```bash
# backend (http://localhost:5000)
cd backend && cp .env.example .env   # fill in values
npm install && npm run dev

# frontend (http://localhost:8080)
npm install && npm run dev
```
