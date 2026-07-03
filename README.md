# Orion LMS — Learner Track Onboarding

A multi-step onboarding wizard that figures out a learner's AI knowledge and
programming background, then recommends a learning track with a roadmap and
one-click enrollment.

Built with Next.js + TypeScript on the frontend, Node/Express + TypeScript on
the backend, and PostgreSQL for storage.

## Project structure

```
learner-track-app/
├── backend/                # Express + TypeScript API
│   ├── db/
│   │   ├── schema.sql       # tables, constraints, indexes
│   │   └── seed.sql         # seed data for tracks + roadmap
│   ├── scripts/             # migrate.ts, seed.ts
│   ├── src/
│   │   ├── config/db.ts
│   │   ├── validators/      # zod schemas
│   │   ├── middleware/
│   │   ├── services/        # recommendation engine + business logic
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
├── frontend/                # Next.js wizard UI
│   └── src/
│       ├── pages/
│       │   └── onboarding/  # step router
│       ├── components/
│       │   ├── layout/
│       │   ├── ui/
│       │   ├── steps/       # one component per wizard step
│       │   └── recommendation/
│       ├── context/OnboardingContext.tsx
│       └── lib/api.ts
│
├── docs/
│   ├── API.md
│   └── architecture.md
│
└── docker-compose.yml        # spins up local Postgres
```

## Running it locally

**1. Postgres**

```bash
docker compose up -d
```
(or point `backend/.env` at any Postgres instance you already have running)

**2. Backend**

```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev        # http://localhost:4000
```

Check it's alive: `curl http://localhost:4000/health`

**3. Frontend**

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev        # http://localhost:3000
```

Go to `http://localhost:3000` — it'll bounce you to `/onboarding`.

## API

| Method | Path                | What it does                              |
| ------ | ------------------- | ------------------------------------------ |
| POST   | `/assessment`        | saves a learner's answers from the wizard   |
| POST   | `/recommend-track`   | runs the recommendation logic on those answers |
| POST   | `/select-track`      | enrolls the learner in a track              |
| GET    | `/learning-tracks`   | returns the track catalog                   |

Full request/response shapes are in [`docs/API.md`](./docs/API.md).

## How the wizard flows

1. AI knowledge slider (1–10)
2. "Do you have programming experience?" — Yes/No
   - Yes → pick your tech skills (Python, JS, React, Node, Java, other)
   - No → "Would you like to learn programming?" → routes either into the
     programming-first path or straight to the low-code / agentic track
3. Main goal — build AI apps, become an AI/ML engineer, AI agents &
   automation, or general career growth
4. Recommendation screen — primary track + 3 alternatives with reasoning
5. Roadmap screen — ordered steps (a prerequisite gets added automatically
   if the AI knowledge score is under 5), then Enroll

The actual decision rules for the recommendation engine are written up in
[`docs/architecture.md`](./docs/architecture.md).

## A few implementation notes

- Validation happens in middleware (zod) before it ever reaches a
  controller, so the controllers/services don't need to re-check input.
- Enrollment is idempotent — `select-track` upserts on
  `(learner_id, track_id)`, so clicking Enroll twice doesn't create
  duplicates.
- Every recommendation gets saved to `track_recommendations`, not just
  computed and thrown away — useful if you ever want to look at
  recommendation → enrollment conversion per track.
- No login required to take the assessment. A learner row + a UUID cached
  in localStorage gets created on first submit, which keeps things fast.

## Notes to self / possible next steps

- Add screenshots or a short demo video
- Maybe a Figma pass on the wizard UI
- Recommendation engine is a pure function (`decidePrimarySlug`) so it's
  easy to unit test — haven't added those tests yet