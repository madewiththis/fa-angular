export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'single-choice' | 'multiple-choice';
  options: SurveyOption[];
}

export interface SurveyOption {
  id: string;
  text: string;
  tutorialIds: string[]; // Maps to tutorials this option should recommend
}

export interface SurveyResponse {
  questionId: string;
  selectedOptionIds: string[];
}

export interface TutorialGuide {
  id: string;
  title: string;
  description: string;
  videoConfig: {
    id: string;
    url: string;
    title: string;
    description: string;
    startTime?: number;
  };
  estimatedDuration?: string;
  category?: string;
}

export interface PersonalizedOnboarding {
  userId?: string; // For future backend integration
  surveyResponses: SurveyResponse[];
  recommendedTutorials: TutorialGuide[];
  completedTutorialIds: string[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface OnboardingProgress {
  totalTutorials: number;
  completedTutorials: number;
  percentComplete: number;
}