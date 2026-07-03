# API Documentation

Base URL (local): `http://localhost:4000`

All responses are JSON. Successful responses are shaped `{ "data": ... }`.
Errors are shaped `{ "error": string, "message": string, "details"?: any }`.

---

## `POST /assessment`

Persist a learner's onboarding wizard answers.

### Request body

```json
{
  "learnerId": "uuid (optional — omit on first visit)",
  "learnerEmail": "string (optional)",
  "aiKnowledgeScore": 4,
  "hasProgrammingExperience": true,
  "techSkills": ["java"],
  "wantsToLearnProgramming": null,
  "mainGoal": "ai_ml_engineer"
}
```

| Field                       | Type                                                                             | Required                                   |
| --------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------- |
| `learnerId`                 | UUID                                                                             | No — a learner is created if omitted        |
| `aiKnowledgeScore`          | integer 1–10                                                                     | Yes                                          |
| `hasProgrammingExperience`  | boolean                                                                          | Yes                                          |
| `techSkills`                | array of `python \| full_stack_js \| react \| nodejs \| java \| other`           | No                                            |
| `wantsToLearnProgramming`   | boolean                                                                          | **Required if** `hasProgrammingExperience` is `false` |
| `mainGoal`                  | `build_ai_apps \| ai_ml_engineer \| ai_agents_automation \| career_growth`       | Yes                                          |

### Response `201`

```json
{
  "data": {
    "id": "a1b2...",
    "learner_id": "c3d4...",
    "ai_knowledge_score": 4,
    "has_programming_experience": true,
    "tech_skills": ["java"],
    "wants_to_learn_programming": null,
    "main_goal": "ai_ml_engineer",
    "needs_ai_foundation": true,
    "status": "completed",
    "created_at": "2026-07-04T10:00:00.000Z"
  }
}
```

### Errors

- `422 ValidationError` — missing/invalid fields (field-level `details`).
- `404 NotFound` — `learnerId` was supplied but does not exist.

---

## `POST /recommend-track`

Runs the recommendation engine against a previously-submitted assessment.

### Request body

```json
{ "assessmentId": "a1b2..." }
```

### Response `200`

```json
{
  "data": {
    "primaryTrack": { "id": "...", "slug": "programming-foundation-ai-track", "title": "Programming Foundation + AI Track", "...": "..." },
    "prerequisiteTrack": { "id": "...", "slug": "ai-foundations", "title": "AI Foundations", "...": "..." },
    "alternativeTracks": [ { "title": "Claude Architect Track" }, { "title": "Agentic Pro Code Engineering" }, { "title": "Agentic Low Code Engineering" } ],
    "reasoning": "Recommended because you want a guided programming-first roadmap.",
    "matchReasons": ["✅ Matches your current skills", "🚀 Good career growth", "🧭 Clear roadmap"],
    "roadmap": [
      { "stepOrder": 1, "title": "AI Foundations", "description": "...", "durationLabel": "2 Months", "badge": "Recommended" },
      { "stepOrder": 2, "title": "Programming Foundation", "description": "...", "durationLabel": "3 Months", "badge": "Current" },
      { "stepOrder": 3, "title": "Real-world Portfolio Projects", "description": "...", "durationLabel": "1 Month", "badge": "Portfolio" }
    ]
  }
}
```

### Errors

- `422 ValidationError` — `assessmentId` missing/invalid.
- `404 NotFound` — assessment does not exist.

---

## `POST /select-track`

Enrolls a learner into a track (idempotent per `learnerId` + `trackId`).

### Request body

```json
{
  "learnerId": "c3d4...",
  "trackId": "e5f6...",
  "assessmentId": "a1b2... (optional)"
}
```

### Response `201`

```json
{
  "data": {
    "enrollment": {
      "id": "...",
      "learner_id": "c3d4...",
      "track_id": "e5f6...",
      "assessment_id": "a1b2...",
      "status": "enrolled",
      "enrolled_at": "2026-07-04T10:05:00.000Z"
    },
    "track": { "id": "e5f6...", "title": "Programming Foundation + AI Track", "...": "..." }
  }
}
```

### Errors

- `404 NotFound` — learner or track does not exist.

---

## `GET /learning-tracks`

Lists the full track catalog (used for a "compare tracks" screen).

### Query params (optional)

| Param      | Example               | Description                              |
| ---------- | ---------------------- | ----------------------------------------- |
| `category` | `ai_ml_engineer`       | Filter by recommendation-engine category  |
| `type`     | `main`                 | `prerequisite \| main \| alternative`     |

### Response `200`

```json
{
  "data": [
    { "id": "...", "slug": "programming-foundation-ai-track", "title": "Programming Foundation + AI Track", "level": "Beginner", "duration_label": "9 Months", "tags": ["Programming", "AI Basics", "Projects"] },
    { "id": "...", "slug": "claude-architect-track", "title": "Claude Architect Track", "...": "..." }
  ]
}
```

## `GET /learning-tracks/:id`

Returns a single track plus its ordered roadmap steps.

---

## Additional utility endpoints

- `GET /health` — liveness probe, returns `{ status: "ok", uptime }`.
- `GET /assessment/:id` — fetch a single assessment.
- `GET /assessment/learner/:learnerId` — assessment history for a learner.
- `GET /select-track/learner/:learnerId` — enrollment history for a learner.
