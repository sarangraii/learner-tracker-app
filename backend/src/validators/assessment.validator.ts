import { z } from 'zod';

export const techSkillEnum = z.enum([
  'python',
  'full_stack_js',
  'react',
  'nodejs',
  'java',
  'other',
]);

export const mainGoalEnum = z.enum([
  'build_ai_apps',
  'ai_ml_engineer',
  'ai_agents_automation',
  'career_growth',
]);

export const assessmentSchema = z
  .object({
    learnerId: z.string().uuid().optional(),
    learnerEmail: z.string().email().optional(),
    aiKnowledgeScore: z
      .number({ invalid_type_error: 'aiKnowledgeScore must be a number' })
      .int()
      .min(1, 'aiKnowledgeScore must be between 1 and 10')
      .max(10, 'aiKnowledgeScore must be between 1 and 10'),
    hasProgrammingExperience: z.boolean(),
    techSkills: z.array(techSkillEnum).optional().default([]),
    wantsToLearnProgramming: z.boolean().optional(),
    mainGoal: mainGoalEnum,
  })
  .superRefine((data, ctx) => {
    // Step 3b is required only when the learner has no programming experience
    if (
      data.hasProgrammingExperience === false &&
      typeof data.wantsToLearnProgramming !== 'boolean'
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'wantsToLearnProgramming is required when hasProgrammingExperience is false',
        path: ['wantsToLearnProgramming'],
      });
    }
  });

export const recommendTrackSchema = z.object({
  assessmentId: z.string().uuid('assessmentId must be a valid UUID'),
});

export const selectTrackSchema = z.object({
  learnerId: z.string().uuid('learnerId must be a valid UUID'),
  trackId: z.string().uuid('trackId must be a valid UUID'),
  assessmentId: z.string().uuid().optional(),
});
