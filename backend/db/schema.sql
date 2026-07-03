-- ============================================================================
-- Learner Track Recommendation & Onboarding — PostgreSQL Schema
-- Run with: psql -U <user> -d <db> -f db/schema.sql
-- Idempotent: safe to re-run (uses IF NOT EXISTS / DROP ... CASCADE guards)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- learners: anonymous or authenticated user taking the onboarding wizard
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learners (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) UNIQUE,           -- nullable: supports anonymous flow
    name        VARCHAR(255),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- learning_tracks: catalog of tracks that can be recommended / browsed
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_tracks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug            VARCHAR(120) UNIQUE NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    icon            VARCHAR(10)  DEFAULT '📘',
    level           VARCHAR(30)  NOT NULL DEFAULT 'Beginner'
                        CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    duration_label  VARCHAR(50)  NOT NULL,           -- e.g. "9 Months"
    duration_weeks  INTEGER,                         -- machine-readable duration
    track_type      VARCHAR(30)  NOT NULL DEFAULT 'main'
                        CHECK (track_type IN ('prerequisite', 'main', 'alternative')),
    category        VARCHAR(50)  NOT NULL,           -- used by the recommendation engine
                        -- ai_foundation | programming_ai | ai_ml_engineer |
                        -- ai_agents_automation | claude_architect | agentic_low_code
    tags            TEXT[] NOT NULL DEFAULT '{}',    -- e.g. {Programming, AI Basics, Projects}
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- track_roadmap_steps: ordered steps shown on "Your Learning Roadmap"
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS track_roadmap_steps (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id        UUID NOT NULL REFERENCES learning_tracks(id) ON DELETE CASCADE,
    step_order      INTEGER NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    duration_label  VARCHAR(50) NOT NULL,
    badge           VARCHAR(30),                     -- Recommended | Current | Portfolio
    UNIQUE (track_id, step_order)
);

-- ----------------------------------------------------------------------------
-- assessments: one row per onboarding wizard submission
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessments (
    id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learner_id                  UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,

    -- Step 1: AI knowledge slider (1-10)
    ai_knowledge_score          SMALLINT NOT NULL CHECK (ai_knowledge_score BETWEEN 1 AND 10),

    -- Step 2: programming experience
    has_programming_experience  BOOLEAN NOT NULL,

    -- Step 3a (experienced devs only): tech skills multi-select
    tech_skills                 TEXT[] DEFAULT '{}',
                                 -- subset of {python, full_stack_js, react, nodejs, java, other}

    -- Step 3b (non-programmers only): do they want to learn programming
    wants_to_learn_programming  BOOLEAN,

    -- Step 4: main goal
    main_goal                   VARCHAR(50) NOT NULL
                                 CHECK (main_goal IN (
                                    'build_ai_apps',
                                    'ai_ml_engineer',
                                    'ai_agents_automation',
                                    'career_growth'
                                 )),

    -- derived flag, kept for fast querying/reporting
    needs_ai_foundation         BOOLEAN GENERATED ALWAYS AS (ai_knowledge_score < 5) STORED,

    status                      VARCHAR(20) NOT NULL DEFAULT 'completed'
                                 CHECK (status IN ('in_progress', 'completed')),

    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- a learner who has no programming experience must answer step 3b
    CONSTRAINT chk_step3b_required CHECK (
        has_programming_experience = TRUE
        OR wants_to_learn_programming IS NOT NULL
    )
);

CREATE INDEX IF NOT EXISTS idx_assessments_learner_id ON assessments(learner_id);

-- ----------------------------------------------------------------------------
-- track_recommendations: computed recommendation for a given assessment
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS track_recommendations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id           UUID NOT NULL UNIQUE REFERENCES assessments(id) ON DELETE CASCADE,
    primary_track_id        UUID NOT NULL REFERENCES learning_tracks(id),
    prerequisite_track_id   UUID REFERENCES learning_tracks(id),   -- e.g. AI Foundations, nullable
    alternative_track_ids   UUID[] NOT NULL DEFAULT '{}',
    reasoning               TEXT NOT NULL,
    match_reasons           TEXT[] NOT NULL DEFAULT '{}',          -- chips: "Matches your current skills" etc.
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- enrollments: learner selecting/enrolling into a track
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learner_id      UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    assessment_id   UUID REFERENCES assessments(id) ON DELETE SET NULL,
    track_id        UUID NOT NULL REFERENCES learning_tracks(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'enrolled'
                        CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
    enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (learner_id, track_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_learner_id ON enrollments(learner_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_track_id ON enrollments(track_id);

-- ----------------------------------------------------------------------------
-- updated_at trigger helper
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_assessments_updated_at ON assessments;
CREATE TRIGGER trg_assessments_updated_at
    BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_learning_tracks_updated_at ON learning_tracks;
CREATE TRIGGER trg_learning_tracks_updated_at
    BEFORE UPDATE ON learning_tracks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
