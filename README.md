# seen

A mood-first streaming companion that helps you choose what to watch based on how you feel.

Instead of browsing endlessly through catalogs, Seen starts with a simple question: *how are you feeling?* It then surfaces curated show and movie recommendations tailored to your current mood, lets you save titles to a personal shelf, and connects you with friends through shared taste.


![seen](https://github.com/user-attachments/assets/b3dd1012-7ccd-4323-b1b4-cbed3ea37525)

## Architecture

The project is a full-stack JavaScript application split into two packages:

```
seen-mvp/
├── backend/          # REST API server
├── frontend/         # Single-page application
└── documentation/    # Project docs and field reports
```

### Backend

- **Runtime:** Node.js with Express
- **Database:** MongoDB via Mongoose
- **Authentication:** JWT-based (bcryptjs for password hashing)
- **API Routes:**
  - `/api/auth` — signup, login, session persistence
  - `/api/moods` — mood event logging
  - `/api/recs` — recommendation retrieval
  - `/api/saves` — saving/unsaving titles
- **Data Models:**
  - `User` — account credentials and profile
  - `MoodEvent` — timestamped mood selections
  - `Recommendation` — title metadata and mood mappings
  - `SavedTitle` — user-specific saved titles with mood context

### Frontend

- **Framework:** React 19 with Vite
- **Routing:** React Router DOM v7
- **State Management:** React Context API (`AuthContext`, `TutorialContext`)
- **Layout:** Sidebar navigation (`BottomNav`) with a top bar, wrapping three main tab views

**Key Pages:**

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Public marketing page for unauthenticated visitors |
| `/mood` | Mood Page | Select a mood and receive tailored recommendations (3 or 5) |
| `/circles` | Circles Page | Social layer with friend recommendations and shared activity |
| `/vibeshelf` | Vibeshelf Page | Personal shelf of saved titles with reflections |
| `/profile` | Profile Page | Account settings and preferences |
| `/onboarding` | Onboarding Page | First-time user setup flow |

**Component Organization:**

- `components/mood/` — pick cards, picks grid, platform filters
- `components/circles/` — friend cards, activity feeds, recommendations
- `components/vibeshelf/` — shelf items, reflection modals
- `components/shared/` — reusable UI primitives (Chip, Card, PageContainer, etc.)
- `layout/` — MainLayout, TopBar, BottomNav, AppShell

### Authentication Flow

1. Unauthenticated users land on the marketing landing page at `/`
2. Sign up or log in via `/signup` or `/login`
3. First-time users are guided through onboarding with a tutorial system
4. Authenticated users are redirected from `/` to `/mood`
5. All app routes are wrapped in `ProtectedRoute` requiring a valid session

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env    # configure your MongoDB URI and JWT secret
npm install
npm run dev             # starts on port 5001
```

### Frontend

```bash
cd frontend
npm install
npm run dev             # starts on port 5174 locally if 5173 is in use
```

### Run both locally

```bash
npm run dev             # from the repo root; starts backend 5001 and frontend 5174
```

### Deploy Env Notes

For a single Vercel project from the repo root:

- Install Command: `npm run install:all`
- Build Command: `npm run build`
- Output Directory: `frontend/dist`

Required Vercel env vars:

- `NODE_ENV=production`
- `MONGODB_URI` for the staging or production MongoDB database
- `JWT_SECRET` as a long secret unique to that environment
- `WATCHMODE_API_KEY`
- `DISABLE_WATCHMODE=false` when live Watchmode data should be enabled
- `VITE_API_BASE_URL=/api`

`CLIENT_ORIGIN` is optional for the first Vercel deploy if Vercel system environment variables are enabled; the backend will use `https://${VERCEL_URL}`. After the first deploy, you can set `CLIENT_ORIGIN` to the final Vercel domain.

## License

MIT
