import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveyQuestion, SurveyResponse } from '../../../models/onboarding.interfaces';
import { SURVEY_QUESTIONS } from '../../../data/onboarding-data';

@Component({
  selector: 'app-onboarding-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="survey-container">
      <div class="survey-header">
        <h1>Let's personalize your FlowAccount experience</h1>
        <p>Answer a few quick questions so we can recommend the best tutorials for you.</p>
        <div class="progress-indicator">
          Question {{ currentQuestionIndex() + 1 }} of {{ questions.length }}
        </div>
      </div>

      <div class="question-container">
        <div class="question" *ngIf="currentQuestion()">
          <h2>{{ currentQuestion()!.text }}</h2>
          
          <div class="options">
            <div 
              *ngFor="let option of currentQuestion()!.options" 
              class="option"
              [class.selected]="isOptionSelected(option.id)"
              (click)="toggleOption(option.id)"
            >
              <input 
                type="checkbox" 
                [checked]="isOptionSelected(option.id)"
                [id]="option.id"
                (change)="toggleOption(option.id)"
              >
              <label [for]="option.id">{{ option.text }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <button 
          *ngIf="currentQuestionIndex() > 0"
          class="nav-button secondary"
          (click)="previousQuestion()"
        >
          Previous
        </button>
        
        <button 
          *ngIf="currentQuestionIndex() < questions.length - 1"
          class="nav-button primary"
          [disabled]="!hasSelections()"
          (click)="nextQuestion()"
        >
          Next
        </button>
        
        <button 
          *ngIf="currentQuestionIndex() === questions.length - 1"
          class="nav-button primary"
          [disabled]="!hasSelections()"
          (click)="completeSurvey()"
        >
          Get My Tutorials
        </button>
      </div>
    </div>
  `,
  styles: [`
    .survey-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
    }

    .survey-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .survey-header h1 {
      font-size: 1.75rem;
      font-weight: 600;
      margin: 0 0 8px;
      color: #1a1a1a;
    }

    .survey-header p {
      font-size: 1rem;
      color: #666;
      margin: 0 0 16px;
    }

    .progress-indicator {
      font-size: 0.875rem;
      color: #888;
      font-weight: 500;
    }

    .question-container {
      margin-bottom: 40px;
    }

    .question h2 {
      font-size: 1.25rem;
      font-weight: 500;
      margin: 0 0 24px;
      color: #1a1a1a;
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .option {
      display: flex;
      align-items: center;
      padding: 16px;
      border: 2px solid #000;
      background: #fff;
      cursor: pointer;
      transition: background-color 0.2s;
      gap: 12px;
    }

    .option:hover {
      background: #f5f5f5;
    }

    .option.selected {
      background: #f0f0f0;
    }

    .option input {
      margin: 0;
      cursor: pointer;
    }

    .option label {
      flex: 1;
      cursor: pointer;
      font-weight: 500;
      color: #1a1a1a;
    }

    .navigation {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .nav-button {
      padding: 12px 24px;
      border: 2px solid #000;
      background: #fff;
      color: #000;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 120px;
    }

    .nav-button.primary {
      background: #000;
      color: #fff;
    }

    .nav-button.primary:hover:not(:disabled) {
      background: #333;
    }

    .nav-button.secondary:hover {
      background: #f5f5f5;
    }

    .nav-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .survey-container {
        padding: 16px;
      }
      
      .survey-header h1 {
        font-size: 1.5rem;
      }
      
      .navigation {
        flex-direction: column-reverse;
      }
      
      .nav-button {
        width: 100%;
      }
    }
  `]
})
export class OnboardingSurveyComponent {
  @Output() surveyCompleted = new EventEmitter<SurveyResponse[]>();
  
  questions = SURVEY_QUESTIONS;
  currentQuestionIndex = signal(0);
  responses = new Map<string, string[]>();

  currentQuestion = () => this.questions[this.currentQuestionIndex()];

  isOptionSelected(optionId: string): boolean {
    const questionId = this.currentQuestion()?.id;
    if (!questionId) return false;
    return this.responses.get(questionId)?.includes(optionId) || false;
  }

  toggleOption(optionId: string): void {
    const question = this.currentQuestion();
    if (!question) return;

    const currentSelections = this.responses.get(question.id) || [];
    
    if (question.type === 'single-choice') {
      // For single choice, replace the selection
      this.responses.set(question.id, [optionId]);
    } else {
      // For multiple choice, toggle the option
      if (currentSelections.includes(optionId)) {
        const newSelections = currentSelections.filter(id => id !== optionId);
        this.responses.set(question.id, newSelections);
      } else {
        this.responses.set(question.id, [...currentSelections, optionId]);
      }
    }
  }

  hasSelections(): boolean {
    const questionId = this.currentQuestion()?.id;
    if (!questionId) return false;
    const selections = this.responses.get(questionId);
    return selections ? selections.length > 0 : false;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions.length - 1) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() + 1);
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() - 1);
    }
  }

  completeSurvey(): void {
    const surveyResponses: SurveyResponse[] = Array.from(this.responses.entries()).map(
      ([questionId, selectedOptionIds]) => ({
        questionId,
        selectedOptionIds
      })
    );
    
    this.surveyCompleted.emit(surveyResponses);
  }
}