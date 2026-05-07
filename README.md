# Life OS — Anil's Personal Command Center

A PWA (Progressive Web App) with AI-powered task management, daily reminders, and Claude integration.

---

## Deploy in 10 minutes

### Step 1 — Prerequisites
- [Node.js](https://nodejs.org) v18+
- [GitHub](https://github.com) account (free)
- [Vercel](https://vercel.com) account (free)
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

---

### Step 2 — Push to GitHub

```bash
# In this folder:
git init
git add .
git commit -m "Life OS v1"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/life-os.git
git push -u origin main
```

---

### Step 3 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework: **Vite** (auto-detected)
4. Click **Environment Variables**, add:
   ```
   Name:  ANTHROPIC_API_KEY
   Value: sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. Click **Deploy** — takes ~1 minute

Your app is live at `https://your-project.vercel.app` 🎉

---

### Step 4 — Install on iPhone as an app

1. Open your Vercel URL in **Safari** (must be Safari)
2. Tap the **Share** button (box with arrow)
3. Scroll down → **"Add to Home Screen"**
4. Tap **Add**

It now appears on your home screen like a native app — full screen, no browser bar.

---

### Step 5 — Enable push notifications (iOS 16.4+)

When you open the app from home screen, tap **Enable** in the notification banner. This allows real push notifications for task reminders.

---

## Local development

```bash
npm install
npm run dev
```

> Note: AI features won't work in dev without a local proxy. Add a `.env.local` file:
> ```
> ANTHROPIC_API_KEY=sk-ant-xxxxxx
> ```
> Then run: `npm run dev` — Vite will use the `/api/claude.js` serverless function via `vercel dev` (install Vercel CLI: `npm i -g vercel`).

---

## Daily reminders (fixed)

| Time     | Reminder     |
|----------|-------------|
| 7:00 AM  | 💪 Gym time |
| 9:30 AM  | 💻 Work start |
| 6:30 PM  | 🏠 Family time |

Keep the app open (or as a PWA on home screen) for reminders to fire. The ON/OFF toggle controls them.

---

## Tech stack

- **React + Vite** — UI framework
- **vite-plugin-pwa** — Service worker, manifest, offline support
- **Vercel** — Hosting + serverless functions
- **Anthropic Claude** — AI chat + task extraction (server-side, key never exposed)
- **localStorage** — Task persistence (no database needed)
