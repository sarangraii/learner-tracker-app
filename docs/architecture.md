# Architecture

## Overview

Pretty standard three-tier setup — Next.js wizard on the frontend, a
stateless Express API in the middle, Postgres at the bottom. Only the
backend talks to the database.

```
Frontend (Next.js)  --HTTPS/JSON-->  Backend (Express)  --SQL-->  PostgreSQL
                     <--------------                    <-------
```

The wizard steps live entirely on the frontend:

- Step 1: AI knowledge slider
- Step 2: programming experience (yes/no)
- Step 3: tech skills (only if yes)
- Alt step: "want to learn programming?" (only if no)
- Step 4: main goal
- Recommendation screen
- Roadmap + enroll

The backend just exposes four endpoints: `/assessment`, `/recommend-track`,
`/select-track`, `/learning-tracks`. Tables: `learners`, `assessments`,
`learning_tracks`, `track_roadmap_steps`, `track_recommendations`,
`enrollments`.

## How a request actually flows

Steps 1–4 don't hit the network at all — everything's held in
`OnboardingContext` on the client so the wizard feels instant.

Only once you hit the last step does it start talking to the backend:

1. `POST /assessment` — saves the answers, creates a `learners` row the
   first time (id gets cached in localStorage), gives back an
   `assessmentId`.
2. `POST /recommend-track` — this is where `recommendation.service.ts`
   does its thing: reads the assessment, runs it through the decision
   rules below, saves a `track_recommendations` row, and returns the
   primary track + prerequisite (if needed) + 3 alternatives + roadmap.
3. Recommendation screen shows the primary track and the 3 alternatives.
   Roadmap screen shows the ordered steps.
4. Hitting "Start Learning Now" fires `POST /select-track`, which creates
   an `enrollments` row. It's idempotent — clicking enroll twice on the
   same track doesn't duplicate anything.

## Recommendation logic

This is the actual core of the app, so worth spelling out:

```
if no programming experience AND doesn't want to learn programming:
    -> Agentic Low Code Engineering

else if goal is AI agents/automation AND has programming experience:
    -> Agentic Pro Code Engineering

else:
    -> Programming Foundation + AI Track   (default path)

if AI knowledge score < 5:
    add "AI Foundations" as a prerequisite before the main track

alternatives = whatever's left of the 4 catalog tracks
```

It's all one pure function (`decidePrimarySlug`), no DB or HTTP stuff
inside it, so it's easy to test on its own — that's on my list to actually
write tests for.

## Why routes → controllers → services → db

Mostly just to keep things from turning into spaghetti as it grows:

- Controllers stay thin — just handle the request/response, no logic.
- Services hold the actual business logic and don't know anything about
  HTTP.
- Zod validates everything in middleware before it even reaches a
  controller, so nothing downstream has to double-check types.
- Recommendations get saved to the DB instead of just computed and
  discarded — mainly so I can later look at how many recommendations
  actually turn into enrollments.

## If this needed to scale

Some notes for future-me:

- API's stateless (learner id is just a UUID from the client), so scaling
  horizontally behind a load balancer is straightforward.
- `learning_tracks` and `track_roadmap_steps` barely change and get read a
  lot — good candidates for caching (Redis, or just cache at the CDN edge)
  if this ever gets real traffic.
- Already indexed the foreign keys that get queried a lot
  (`assessments.learner_id`, `enrollments.learner_id`,
  `enrollments.track_id`).
- Since the recommendation engine is a pure function, it'd be easy to move
  behind a queue/worker later if it gets more complex (e.g. actual ML
  scoring) without breaking the API contract.