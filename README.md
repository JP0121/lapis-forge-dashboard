# Lapis Forge Intelligence Dashboard

Full-stack news, DePIN, and AI intelligence hub. Built with MERN stack.
<img width="1918" height="928" alt="image" src="https://github.com/user-attachments/assets/72dccfc4-3141-4df3-9d09-e0ed20782417" />

---

## Quick Start (Local Dev)

### 1. Clone & install
```bash
git clone https://github.com/JP0121/lapis-forge-dashboard.git
cd lapis-forge-dashboard
npm run install:all
```

### 2. Configure environment
```bash
cp .env.example server/.env
```

Open `server/.env` and fill in:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string (`openssl rand -base64 64`) |
| `JWT_REFRESH_SECRET` | Another long random string |
| `ADMIN_USERNAME` | Your login username |
| `ADMIN_PASSWORD` | Your login password (min 8 chars) |
| `CLIENT_URL` | `https://news.lapisforge.com` in prod, leave blank for dev |
| `ANTHROPIC_API_KEY` | Optional — required for AI digest in Analytics |

### 3. Create your admin account (run once)
```bash
node server/scripts/seedAdmin.js
```

### 4. Run dev servers
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## Hostinger Deployment

### Environment variables
Add all variables from `.env.example` in Hostinger's Node.js environment panel.
Set `NODE_ENV=production` and `CLIENT_URL=https://news.lapisforge.com`.

### Build
```bash
npm run install:all   # installs all deps
npm run build         # builds React into server/public/
```

### Hostinger settings
| Setting | Value |
|---|---|
| Entry point | `server/server.js` |
| Node version | 18+ |
| Build command | `npm run install:all && npm run build` |
| Start command | `npm start` |

### GitHub → Hostinger
Push to `main` branch. Hostinger pulls and redeploys automatically if you've set up the Git integration.

---

## Features

| Page | What it does |
|---|---|
| **Feed Hub** | Aggregated RSS + API news feed. Filter by category, search, mark read, bookmark. Auto-refreshes every 20 min. |
| **Projects** | Track DePIN/AI projects with status, ROI, node count, notes. Per-project article matching. |
| **Watchlist** | Keyword alerts that match against incoming articles. Toggle on/off, view recent matches. |
| **Bookmarks** | All saved articles with tag and notes editing. |
| **Analytics** | Article volume charts, category breakdown, trending keywords, AI weekly digest. |

## Feed Sources (pre-configured)
- **DePIN:** Messari, CoinDesk, The Defiant, IoTeX Blog
- **AI:** MIT Tech Review, VentureBeat AI, Ars Technica, The Batch
- **Crypto:** CoinTelegraph, Decrypt, Bitcoin Magazine, CryptoPanic (optional key)
- **Tech:** Hacker News, TechCrunch, Wired, Oracle Cloud Blog

Add more in `server/config/feedSources.js`.

---

## Security
- JWT access tokens (15min) + refresh tokens (7d) in HTTP-only cookies
- bcrypt password hashing (cost 12)
- Rate limiting on login (10 attempts / 15 min)
- Helmet.js security headers
- CORS locked to your domain
- Input validation on all endpoints
- MongoDB injection protection via Mongoose
