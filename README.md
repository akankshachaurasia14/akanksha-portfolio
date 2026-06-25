# Akanksha Chaurasia — Portfolio

A full-stack personal portfolio: React (Vite) frontend + Express/MongoDB
backend. Content (skills, projects, experience, bio, photo) lives in the
database and is editable without touching code or redeploying.

```
portfolio/
├── client/      React frontend (Vite)
└── server/      Express backend (API + MongoDB)
```

## What's inside

- **Animated terminal hero** that types out a short intro, your name, and tagline
- **Dark / bright theme toggle** (persists across visits)
- **Click-to-change profile photo** with a glowing "scan" hover effect
- **Hover-reveal project cards** with a gradient glow border
- **Scroll-reveal animations** throughout (Framer Motion), respecting
  `prefers-reduced-motion`
- **Working contact form** that saves messages to MongoDB
- **Editable profile data** via a `PUT /api/profile` endpoint — change your
  bio, skills, or projects without redeploying

---

## 1. Local setup

### Backend

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGODB_URI` — a free MongoDB Atlas connection string (see below). Leave
  blank to run with read-only sample data (the site still works, you just
  can't save edits or contact messages).
- `ALLOWED_ORIGINS` — keep the default for now (`http://localhost:5173`)

Seed the database with your resume content (only works once `MONGODB_URI` is set):

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

This runs on **http://localhost:5000**.

### Frontend

In a separate terminal:

```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```

This runs on **http://localhost:5173** — open that in your browser.

---

## 2. Setting up a free MongoDB database

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → sign up free.
2. Create a free M0 cluster (no credit card needed).
3. Under **Database Access**, create a user with a password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) — fine
   for a personal project; tighten later if you want.
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Paste that into `server/.env` as `MONGODB_URI` (replace `<username>`/`<password>`
   with your real values).

---

## 3. Editing your content without redeploying

Once `MONGODB_URI` is set and seeded, send a `PUT` request to update any
field — for example, updating your bio:

```bash
curl -X PUT https://your-backend.onrender.com/api/profile \
  -H "Content-Type: application/json" \
  -d '{"bio": "Your updated bio text here."}'
```

You can update `skillGroups`, `projects`, `experience`, `education`,
`photoUrl`, or any other field the same way — only the fields you include
get changed, everything else stays as-is.

(A simple admin UI for this isn't included yet — say so if you'd like one
added, it's a natural next step.)

---

## 4. Deploying

### Backend → Render

1. Push the `server/` folder to a GitHub repo (or push the whole `portfolio/`
   repo and set Render's **Root Directory** to `server`).
2. On [render.com](https://render.com) → **New +** → **Web Service** → connect your repo.
3. Settings:
   - **Root Directory:** `server` (if using the combined repo)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables (same names as your `.env`):
   - `MONGODB_URI`
   - `ALLOWED_ORIGINS` — set this **after** you have your Vercel URL (step below)
5. Deploy. You'll get a URL like `https://akanksha-portfolio-api.onrender.com`.

### Frontend → Vercel

1. Push `client/` to GitHub (or set **Root Directory** to `client` in the
   same combined repo).
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Vercel auto-detects Vite. No build settings to change.
4. Add an environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** your Render URL from above (no trailing slash)
   - Apply to Production, Preview, and Development
5. Deploy. You'll get a URL like `https://akanksha-portfolio.vercel.app`.

### Connect them (CORS)

Go back to Render → your backend's environment variables → set:
```
ALLOWED_ORIGINS=https://akanksha-portfolio.vercel.app,http://localhost:5173
```
Save — Render redeploys automatically. This is the same CORS step from the
HirePulse project: the backend needs to explicitly allow your frontend's
domain, or every API call will fail with "Failed to fetch."

### Free-tier note

Render's free tier sleeps after 15 minutes of no traffic; the next visitor
waits ~30–60 seconds while it wakes up. This is normal, not a bug — see the
HirePulse README for the same explanation if you've forgotten.

---

## 5. Adding your real project links

In `server/data/seed.js` (and `data/fallback-profile.json` for the offline
copy), each project has `"codeUrl": "#"`. Replace those with your real
GitHub repo URLs, then re-run `npm run seed` (or `PUT` them via the API) to
update the live site.

## 6. Replacing the placeholder bio

The bio in `seed.js` was written based on your resume since you asked me to
draft it. Feel free to rewrite it in your own voice — edit `seedProfile.bio`
in `server/data/seed.js`, re-seed, or `PUT` the new text directly.
