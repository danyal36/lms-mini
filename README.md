# lms-mini

Minimal Learning Management System — Angular + Node/Express + MongoDB.

## Prerequisites
- Node.js 20+
- npm 9+
- MongoDB Atlas account (or local MongoDB)

## Setup

### Backend
```bash
cd backend
cp .env.example .env          # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                   # starts on http://localhost:3001
```

Verify: `curl http://localhost:3001/api/health`

### Frontend
```bash
cd frontend
npm install
npm start                     # serves on http://localhost:4200
```

## Commands

| App | Command | Purpose |
|-----|---------|---------|
| backend | `npm run dev` | Dev server (ts-node-dev watch) |
| backend | `npm run build` | Compile TypeScript → dist/ |
| backend | `npm run start` | Run compiled build |
| backend | `npm run lint` | ESLint |
| backend | `npm test` | Jest |
| frontend | `npm start` | Angular dev server |
| frontend | `npm run build` | Production build |
| frontend | `npm test` | Karma/Jasmine unit tests |
| frontend | `npm run lint` | Angular ESLint |

## Deployment
- **Frontend** → Vercel (connect repo, set root to `frontend`)
- **Backend** → Render (connect repo, root `backend`, set env vars in dashboard)
- **Database** → MongoDB Atlas free-tier cluster
