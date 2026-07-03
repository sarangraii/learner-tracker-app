-- ============================================================================
-- Seed data: learning_tracks + roadmap steps
-- Run with: psql -U <user> -d <db> -f db/seed.sql   (after schema.sql)
-- ============================================================================

INSERT INTO learning_tracks (slug, title, description, icon, level, duration_label, duration_weeks, track_type, category, tags)
VALUES
  ('ai-foundations',
   'AI Foundations',
   'Build core AI concepts before advanced specialization.',
   '🧠', 'Beginner', '2 Months', 8, 'prerequisite', 'ai_foundation',
   ARRAY['AI Basics']),

  ('programming-foundation-ai-track',
   'Programming Foundation + AI Track',
   'Start with programming basics, then move into AI Engineering or ML Engineering.',
   '📚', 'Beginner', '9 Months', 36, 'main', 'programming_ai',
   ARRAY['Programming', 'AI Basics', 'Projects']),

  ('claude-architect-track',
   'Claude Architect Track',
   'Design AI systems and Claude-based workflows.',
   '🏗️', 'Intermediate', '6 Months', 24, 'alternative', 'ai_ml_engineer',
   ARRAY['Architecture', 'Claude', 'Systems Design']),

  ('agentic-pro-code-engineering',
   'Agentic Pro Code Engineering',
   'Build AI agents and automated workflows.',
   '🤖', 'Intermediate', '7 Months', 28, 'alternative', 'ai_agents_automation',
   ARRAY['Agents', 'Automation', 'Pro-code']),

  ('agentic-low-code-engineering',
   'Agentic Low Code Engineering',
   'Build AI solutions without heavy coding.',
   '🛠️', 'Beginner', '4 Months', 16, 'alternative', 'agentic_low_code',
   ARRAY['Low-code', 'Agents', 'No-code Tools']),

  ('real-world-portfolio-projects',
   'Real-world Portfolio Projects',
   'Build and deploy production-ready AI projects.',
   '🗺️', 'Intermediate', '1 Month', 4, 'prerequisite', 'portfolio',
   ARRAY['Portfolio', 'Deployment'])
ON CONFLICT (slug) DO NOTHING;

-- Roadmap for the flagship "Programming Foundation + AI Track"
INSERT INTO track_roadmap_steps (track_id, step_order, title, description, duration_label, badge)
SELECT id, 1, 'AI Foundations', 'Build core AI concepts before advanced specialization.', '2 Months', 'Recommended'
FROM learning_tracks WHERE slug = 'programming-foundation-ai-track'
ON CONFLICT (track_id, step_order) DO NOTHING;

INSERT INTO track_roadmap_steps (track_id, step_order, title, description, duration_label, badge)
SELECT id, 2, 'Programming Foundation', 'Learn Python or Full Stack basics.', '3 Months', 'Current'
FROM learning_tracks WHERE slug = 'programming-foundation-ai-track'
ON CONFLICT (track_id, step_order) DO NOTHING;

INSERT INTO track_roadmap_steps (track_id, step_order, title, description, duration_label, badge)
SELECT id, 3, 'Real-world Portfolio Projects', 'Build and deploy production-ready AI projects.', '1 Month', 'Portfolio'
FROM learning_tracks WHERE slug = 'programming-foundation-ai-track'
ON CONFLICT (track_id, step_order) DO NOTHING;
