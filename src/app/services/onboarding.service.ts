import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { 
  SurveyResponse, 
  TutorialGuide, 
  PersonalizedOnboarding, 
  OnboardingProgress 
} from '../models/onboarding.interfaces';
import { SURVEY_QUESTIONS, TUTORIAL_GUIDES } from '../data/onboarding-data';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private readonly STORAGE_KEY = 'flowaccount_onboarding';
  
  private onboardingState$ = new BehaviorSubject<PersonalizedOnboarding | null>(null);
  
  constructor() {
    this.loadOnboardingState();
  }

  get onboarding$() {
    return this.onboardingState$.asObservable();
  }

  get currentOnboarding() {
    return this.onboardingState$.value;
  }

  /**
   * Process survey responses and generate personalized tutorial recommendations
   */
  processSurveyResults(responses: SurveyResponse[]): PersonalizedOnboarding {
    const recommendedTutorialIds = this.generateTutorialRecommendations(responses);
    const recommendedTutorials = this.getTutorialsByIds(recommendedTutorialIds);
    
    const onboarding: PersonalizedOnboarding = {
      surveyResponses: responses,
      recommendedTutorials,
      completedTutorialIds: [],
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    this.saveOnboardingState(onboarding);
    return onboarding;
  }

  /**
   * Generate tutorial recommendations based on survey responses
   */
  private generateTutorialRecommendations(responses: SurveyResponse[]): string[] {
    const tutorialIds = new Set<string>();
    
    responses.forEach(response => {
      const question = SURVEY_QUESTIONS.find(q => q.id === response.questionId);
      if (!question) return;
      
      response.selectedOptionIds.forEach(optionId => {
        const option = question.options.find(opt => opt.id === optionId);
        if (option) {
          option.tutorialIds.forEach(id => tutorialIds.add(id));
        }
      });
    });
    
    return Array.from(tutorialIds);
  }

  /**
   * Get tutorial guides by their IDs
   */
  private getTutorialsByIds(tutorialIds: string[]): TutorialGuide[] {
    return TUTORIAL_GUIDES.filter(tutorial => tutorialIds.includes(tutorial.id));
  }

  /**
   * Mark a tutorial as completed
   */
  markTutorialCompleted(tutorialId: string): void {
    const current = this.currentOnboarding;
    if (!current) return;

    if (!current.completedTutorialIds.includes(tutorialId)) {
      current.completedTutorialIds.push(tutorialId);
      current.lastUpdated = new Date();
      this.saveOnboardingState(current);
    }
  }

  /**
   * Mark a tutorial as incomplete
   */
  markTutorialIncomplete(tutorialId: string): void {
    const current = this.currentOnboarding;
    if (!current) return;

    const index = current.completedTutorialIds.indexOf(tutorialId);
    if (index > -1) {
      current.completedTutorialIds.splice(index, 1);
      current.lastUpdated = new Date();
      this.saveOnboardingState(current);
    }
  }

  /**
   * Check if a tutorial is completed
   */
  isTutorialCompleted(tutorialId: string): boolean {
    const current = this.currentOnboarding;
    return current ? current.completedTutorialIds.includes(tutorialId) : false;
  }

  /**
   * Get onboarding progress statistics
   */
  getProgress(): OnboardingProgress {
    const current = this.currentOnboarding;
    if (!current) {
      return { totalTutorials: 0, completedTutorials: 0, percentComplete: 0 };
    }

    const totalTutorials = current.recommendedTutorials.length;
    const completedTutorials = current.completedTutorialIds.length;
    const percentComplete = totalTutorials > 0 ? Math.round((completedTutorials / totalTutorials) * 100) : 0;

    return { totalTutorials, completedTutorials, percentComplete };
  }

  /**
   * Reset onboarding state (for testing or re-taking survey)
   */
  resetOnboarding(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.onboardingState$.next(null);
  }

  /**
   * Check if user has completed onboarding survey
   */
  hasCompletedSurvey(): boolean {
    return this.currentOnboarding !== null;
  }

  /**
   * Save onboarding state to localStorage and update observable
   */
  private saveOnboardingState(onboarding: PersonalizedOnboarding): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(onboarding));
      this.onboardingState$.next(onboarding);
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  }

  /**
   * Load onboarding state from localStorage
   */
  private loadOnboardingState(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const onboarding = JSON.parse(stored) as PersonalizedOnboarding;
        // Convert date strings back to Date objects
        onboarding.createdAt = new Date(onboarding.createdAt);
        onboarding.lastUpdated = new Date(onboarding.lastUpdated);
        this.onboardingState$.next(onboarding);
      }
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}