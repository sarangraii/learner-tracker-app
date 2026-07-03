import Head from 'next/head';
import { OnboardingProvider, useOnboarding } from '@/context/OnboardingContext';
import WizardShell from '@/components/layout/WizardShell';
import StepAIKnowledge from '@/components/steps/StepAIKnowledge';
import StepProgrammingExperience from '@/components/steps/StepProgrammingExperience';
import StepTechSkills from '@/components/steps/StepTechSkills';
import StepWantToLearn from '@/components/steps/StepWantToLearn';
import StepMainGoal from '@/components/steps/StepMainGoal';
import RecommendationScreen from '@/components/recommendation/RecommendationScreen';
import RoadmapScreen from '@/components/recommendation/RoadmapScreen';

function WizardRouter() {
  const { step } = useOnboarding();

  switch (step) {
    case 'ai-knowledge':
      return <StepAIKnowledge />;
    case 'programming-experience':
      return <StepProgrammingExperience />;
    case 'tech-skills':
      return <StepTechSkills />;
    case 'want-to-learn':
      return <StepWantToLearn />;
    case 'main-goal':
      return <StepMainGoal />;
    case 'recommendation':
      return <RecommendationScreen />;
    case 'roadmap':
      return <RoadmapScreen />;
    default:
      return null;
  }
}

export default function OnboardingPage() {
  return (
    <>
      <Head>
        <title>Orion LMS — Build your personalized learning journey</title>
        <meta
          name="description"
          content="Answer a few questions and get a personalized learning track recommendation."
        />
      </Head>
      <OnboardingProvider>
        <WizardShell>
          <WizardRouter />
        </WizardShell>
      </OnboardingProvider>
    </>
  );
}
