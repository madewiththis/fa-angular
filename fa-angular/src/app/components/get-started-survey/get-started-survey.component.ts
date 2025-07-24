import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { VideoPlayerComponent } from '../media-player/video-player/video-player.component';
import { MediaPlayerFabComponent } from '../media-player/fab/media-player-fab.component';
import { MediaPlayerService, MediaConfig, PlayerState } from '../media-player/services/media-player.service';

interface SurveyQuestion {
  key: string;
  text: string;
  type: 'binary' | 'choice';
  options?: string[];
  featureInfo?: {
    userCount: string;
    rating: number;
    description: string;
  };
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  details: {
    title: string;
    description: string;
    reward: string;
  };
}

@Component({
  selector: 'app-get-started-survey',
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent, MediaPlayerFabComponent],
  template: `
    <div class="survey-container">
      <ng-container *ngIf="!surveyCompleted">
        <div class="progress-container">
          <div class="progress-bar">
            <div
              class="progress"
              [style.width.%]="
                (currentQuestionIndex / questions.length) * 100
              "
            ></div>
          </div>
          <div class="progress-text">
            Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
          </div>
        </div>

        <div class="question-container">
          <div class="question-content">
            <h2>{{ questions[currentQuestionIndex].text }}</h2>
            <div
              class="answers"
              [class.choice]="questions[currentQuestionIndex].type === 'choice'"
            >
              <ng-container
                *ngIf="questions[currentQuestionIndex].type === 'binary'"
              >
                <button class="answer-button" (click)="answer(true)">
                  Yes
                </button>
                <button class="answer-button" (click)="answer(false)">
                  No
                </button>
              </ng-container>
              <ng-container
                *ngIf="questions[currentQuestionIndex].type === 'choice'"
              >
                <button
                  class="answer-button"
                  *ngFor="let option of questions[currentQuestionIndex].options"
                  (click)="answer(option)"
                >
                  {{ option }}
                </button>
              </ng-container>
            </div>
          </div>
          <div
            class="feature-info"
            *ngIf="questions[currentQuestionIndex].featureInfo as info"
          >
            <div class="info-card">
              <h3>Used by {{ info.userCount }} customers</h3>
              <div class="rating">
                <span *ngFor="let i of getStars(info.rating)" class="star filled"
                  >★</span
                >
                <span
                  *ngFor="let i of getEmptyStars(info.rating)"
                  class="star"
                  >★</span
                >
                <span>{{ info.rating }}/5 stars</span>
              </div>
              <p>{{ info.description }}</p>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-container *ngIf="surveyCompleted">
        <div
          *ngIf="onboardingComplete"
          class="onboarding-complete-container"
        >
          <div class="completion-icon">🎉</div>
          <h2>Onboarding Complete!</h2>
          <p>
            You've unlocked an additional 15 days on your free trial.
          </p>
          <p>
            Your trial now ends on:
            <strong>{{
              trialEndDate | date : 'longDate'
            }}</strong>
          </p>
          <button class="action-button" (click)="exploreApp()">
            Explore the App
          </button>
        </div>
        <div class="completion-container" *ngIf="!onboardingComplete">
          <div class="todo-list-container">
            <h2>Let's get started:</h2>
            <ul class="todo-list">
              <li
                *ngFor="let todo of todos"
                (click)="selectTodo(todo)"
                [class.completed]="todo.completed"
                [class.selected]="todo === selectedTodo"
              >
                <div class="checkbox-container" (click)="toggleTodo(todo)">
                  <input
                    type="checkbox"
                    [id]="todo.id"
                    [checked]="todo.completed"
                  />
                </div>
                <label [for]="todo.id">{{ todo.text }}</label>
                <span *ngIf="todo.completed" class="checkmark">✓</span>
              </li>
            </ul>
          </div>
          <div class="todo-details-container" *ngIf="selectedTodo">
            <div class="details-card">
              <h3>{{ selectedTodo.details.title }}</h3>
              <p>{{ selectedTodo.details.description }}</p>
              <div class="actions">
                <div class="video-container">
                  <!-- Video placeholder - shows when no video is loaded -->
                  <div 
                    class="video-placeholder" 
                    *ngIf="!currentVideoConfig"
                    (click)="playTutorialVideo(selectedTodo)"
                  >
                    <div class="play-button"></div>
                  </div>
                  
                  <!-- Inline video player - shows when video is loaded -->
                  <div class="inline-video-wrapper" *ngIf="currentVideoConfig">
                    <app-video-player
                      [src]="currentVideoConfig.url"
                      [isPlaying]="!isVideoFloating"
                      class="inline-video">
                    </app-video-player>
                  </div>
                </div>
                <button class="action-button walkthrough" (click)="startWalkthrough(selectedTodo)">
                  Start Walkthrough
                </button>
              </div>
              <div class="reward" *ngIf="!selectedTodo.completed">
                <span>Reward for completion:</span>
                <strong>{{ selectedTodo.details.reward }}</strong>
              </div>
              <div class="reward-unlocked" *ngIf="selectedTodo.completed">
                🎉 Reward Unlocked: {{ selectedTodo.details.reward }}
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- Floating video player is now managed by FloatingPlayerComponent -->
      <app-media-player-fab></app-media-player-fab>
    </div>
  `,
  styles: [
    `
      .survey-container {
        background: #fff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      .progress-container {
        margin-bottom: 24px;
      }
      .progress-bar {
        width: 100%;
        background-color: #e5e7eb;
        border-radius: 9999px;
        height: 8px;
      }
      .progress {
        background-color: #3b82f6;
        height: 8px;
        border-radius: 9999px;
        transition: width 0.3s ease-in-out;
      }
      .progress-text {
        margin-top: 8px;
        font-size: 0.875rem;
        color: #6b7280;
      }
      .question-container {
        min-height: 250px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 32px;
      }

      @media (min-width: 992px) {
        .question-container {
          grid-template-columns: 2fr 1fr;
          text-align: left;
        }
      }

      .question-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      @media (min-width: 992px) {
        .question-content {
          align-items: flex-start;
        }
        .answers {
          justify-content: flex-start;
        }
      }

      .feature-info {
        display: flex;
        align-items: center;
      }

      .info-card {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 24px;
        text-align: left;
        width: 100%;
      }

      .info-card h3 {
        margin: 0 0 8px;
        color: #1f2937;
        font-size: 1.125rem;
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 16px;
        color: #6b7280;
      }

      .star {
        font-size: 1.25rem;
        color: #e5e7eb;
      }

      .star.filled {
        color: #f59e0b;
      }

      .info-card p {
        margin: 0;
        color: #4b5563;
        font-size: 0.875rem;
        line-height: 1.5;
      }

      h2 {
        margin: 0 0 24px;
        color: #1f2937;
        font-size: 1.875rem;
        font-weight: 700;
      }
      .answers {
        display: flex;
        gap: 16px;
        justify-content: center;
      }
      .answers.choice {
        flex-direction: column;
      }
      .answer-button {
        background-color: #3b82f6;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
        font-size: 1rem;
        width: 150px;
      }
      .answers.choice .answer-button {
        width: 100%;
      }
      .answer-button:hover {
        background-color: #2563eb;
      }
      .todo-list {
        text-align: left;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
      }
      .todo-list ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .todo-list li {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        cursor: pointer;
        transition: background-color 0.2s;
        font-size: 1rem;
      }
      .todo-list li:last-child {
        border-bottom: none;
      }

      .todo-list li.selected {
        background-color: #eff6ff;
        border-right: 4px solid #3b82f6;
      }

      .todo-list li:hover {
        background-color: #f9fafb;
      }
      .todo-list li.completed label {
        text-decoration: line-through;
        color: #9ca3af;
      }
      .todo-list li .checkbox-container {
        margin-right: 12px;
        display: flex;
        align-items: center;
      }
      .todo-list li input {
        display: none; /* Hide default checkbox */
      }
      .checkbox-container::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #9ca3af;
        border-radius: 4px;
        margin-right: 12px;
        background-color: #fff;
      }

      .todo-list li.completed .checkbox-container::before {
        background-color: #3b82f6;
        border-color: #3b82f6;
      }

      .checkmark {
        color: #fff;
        position: absolute;
        left: 20px;
        top: 18px;
        font-size: 16px;
      }

      .todo-list li label {
        color: #374151;
        cursor: pointer;
        flex-grow: 1;
      }

      .completion-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 32px;
        text-align: left;
      }

      @media (min-width: 992px) {
        .completion-container {
          grid-template-columns: 1fr 1fr;
        }
      }

      .todo-list-container h2 {
        text-align: center;
      }

      @media (min-width: 992px) {
        .todo-list-container h2 {
          text-align: left;
        }
      }

      .details-card {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 24px;
        height: 100%;
      }

      .details-card h3 {
        margin: 0 0 12px;
        color: #1f2937;
        font-size: 1.25rem;
      }

      .details-card p {
        color: #4b5563;
        font-size: 1rem;
        line-height: 1.6;
        margin: 0 0 24px;
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
        width: 100%;
        max-width: 400px;
      }

      .action-button {
        background-color: #fff;
        color: #374151;
        padding: 10px 15px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .action-button:hover {
        background-color: #f9fafb;
        border-color: #9ca3af;
      }

      .video-container {
        position: relative;
        width: 100%;
        max-width: 400px;
        height: 224px; /* Fixed height to maintain layout */
        border-radius: 6px;
        overflow: hidden;
        background: #000;
      }

      .inline-video-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
      }

      .inline-video {
        width: 100%;
        height: 100%;
        display: block;
      }

      .inline-video ::ng-deep .video-tutorial-container {
        position: static !important;
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      .inline-video ::ng-deep .video-wrapper {
        border-radius: 0 !important;
        height: 100% !important;
      }

      .inline-video ::ng-deep .video-js {
        width: 100% !important;
        height: 100% !important;
        min-height: 100% !important;
      }

      .video-placeholder {
        height: 224px;
        border-radius: 6px;
        background-color: #ccc;
        background-image: url(https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=878&q=80);
        background-size: cover;
        background-position: center;
        position: relative;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.2s;
      }

      .video-placeholder:hover {
        transform: scale(1.02);
      }

      .video-placeholder .play-button {
        width: 44px;
        height: 44px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(2px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .video-placeholder .play-button::after {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 16px solid white;
        margin-left: 4px;
      }

      .reward {
        background-color: #eef2ff;
        border: 1px solid #c7d2fe;
        color: #4338ca;
        padding: 16px;
        border-radius: 6px;
        font-size: 0.875rem;
      }

      .reward-unlocked {
        background-color: #ecfdf5;
        border: 1px solid #a7f3d0;
        color: #065f46;
        padding: 16px;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        text-align: center;
      }

      .onboarding-complete-container {
        padding: 48px;
        text-align: center;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
      }

      .completion-icon {
        font-size: 4rem;
        margin-bottom: 16px;
      }

      .onboarding-complete-container h2 {
        font-size: 2.25rem;
      }

      .onboarding-complete-container p {
        font-size: 1.125rem;
        color: #4b5563;
        margin-bottom: 24px;
      }

      .onboarding-complete-container .action-button {
        background-color: #3b82f6;
        color: white;
        padding: 12px 24px;
        font-size: 1rem;
      }
    `,
  ],
})
export class GetStartedSurveyComponent {
  questions: SurveyQuestion[] = [
    {
      key: 'needs_payroll',
      text: 'Do you need payroll?',
      type: 'binary',
      featureInfo: {
        userCount: '10,000+',
        rating: 4.8,
        description:
          'Run payroll in minutes and automatically handle taxes and filings.',
      },
    },
    {
      key: 'sells_products',
      text: 'Do you sell physical products?',
      type: 'binary',
      featureInfo: {
        userCount: '40,000+',
        rating: 4.9,
        description:
          'Manage inventory, track stock levels, and connect to your online store.',
      },
    },
    {
      key: 'has_accountant',
      text: 'Do you have an accountant?',
      type: 'binary',
      featureInfo: {
        userCount: '90%',
        rating: 5.0,
        description:
          'Easily collaborate with your accountant by giving them access to your books.',
      },
    },
    {
      key: 'needs_multi_user',
      text: 'Do you need more than one user?',
      type: 'binary',
      featureInfo: {
        userCount: '15,000+',
        rating: 4.7,
        description:
          'Add team members and set permissions to control who sees what.',
      },
    },
    {
      key: 'sells_ecommerce',
      text: 'Do you sell on ecommerce platforms (like Lazada)?',
      type: 'binary',
      featureInfo: {
        userCount: '25,000+',
        rating: 4.8,
        description:
          'Sync your sales automatically from major ecommerce platforms.',
      },
    },
  ];

  currentQuestionIndex = 0;
  answers: { [key: string]: any } = {};
  surveyCompleted = false;
  todos: Todo[] = [];
  selectedTodo: Todo | null = null;
  onboardingComplete = false;
  trialEndDate: Date | null = null;
  currentVideoConfig: MediaConfig | null = null;
  isVideoFloating = false;
  playerState: PlayerState;

  constructor(
    private userProfileService: UserProfileService,
    private mediaPlayerService: MediaPlayerService
  ) {
    this.playerState = this.mediaPlayerService.currentState;
    this.mediaPlayerService.state$.subscribe(state => {
      this.playerState = state;
      // sync local state with service state
      this.currentVideoConfig = state.videoId ? { id: state.videoId, url: state.videoUrl! } : null;
      this.isVideoFloating = state.isFloating;
    });
  }

  ngOnInit() {
    this.generateTodos();
  }

  answer(value: any) {
    const key = this.questions[this.currentQuestionIndex].key;
    this.answers[key] = value;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.surveyCompleted = true;
      this.generateTodos();
    }
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(1);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(1);
  }

  generateTodos() {
    this.todos = [];

    if (this.answers['sells_products']) {
      this.todos.push({
        id: 'add_products',
        text: 'Add your products',
        completed: false,
        details: {
          title: 'How to Add Products',
          description:
            'Get your products into the system so you can start selling. You can import from a spreadsheet or add them one by one.',
          reward: '20% off your first month!',
        },
      });
    }
    if (this.answers['needs_payroll']) {
      this.todos.push({
        id: 'setup_payroll',
        text: 'Set up Payroll',
        completed: false,
        details: {
          title: 'How to Set up Payroll',
          description:
            "Pay your team on time, every time. We'll guide you through adding employees and setting up your payment schedule.",
          reward: 'First payroll run is on us!',
        },
      });
    }
    if (this.answers['needs_multi_user']) {
      this.todos.push({
        id: 'invite_users',
        text: 'Invite your team members',
        completed: false,
        details: {
          title: 'How to Invite Your Team',
          description:
            'Collaborate with your team by inviting them to your account. You can set permissions to control what they can see and do.',
          reward: 'Unlock 2 additional user seats for free!',
        },
      });
    }

    this.todos.push({
      id: 'setup_company',
      text: 'Complete your company profile',
      completed: false,
      details: {
        title: 'How to Set Up Your Company Profile',
        description:
          'Add your company logo, address, and other details to make your invoices look professional.',
        reward: 'A professional invoice template pack.',
      },
    });
    this.todos.push({
      id: 'connect_bank',
      text: 'Connect your bank account',
      completed: false,
      details: {
        title: 'How to Connect Your Bank Account',
        description:
          'Automatically import your transactions and save hours on manual data entry by connecting your bank account.',
        reward: 'Unlock real-time cash flow insights.',
      },
    });

    if (this.todos.length > 0) {
      this.selectedTodo = this.todos[0];
    }
  }

  toggleTodo(todo: Todo) {
    todo.completed = !todo.completed;
    this.checkOnboardingCompletion();
  }

  selectTodo(todo: Todo) {
    this.selectedTodo = todo;
  }

  checkOnboardingCompletion() {
    const allCompleted = this.todos.every((todo) => todo.completed);
    if (allCompleted && !this.onboardingComplete) {
      this.onboardingComplete = true;
      this.userProfileService.completeOnboarding();
      this.userProfileService.trialEndDate$.subscribe((date) => {
        this.trialEndDate = date;
      });
    }
  }

  exploreApp() {
    // This can be changed to navigate to the main dashboard or another page
    console.log('Explore the app!');
  }

  playTutorialVideo(todo: Todo) {
    const config: MediaConfig = {
      id: `tutorial_${todo.id}`,
      url: `/assets/tutorials/tutorial_quotation.mp4`, // Placeholder URL
      title: todo.details.title,
      description: todo.details.description
    };
    this.mediaPlayerService.launchFloatingPlayer(config);
  }

  startWalkthrough(todo: Todo) {
    // Logic to start an interactive walkthrough
    console.log('Starting walkthrough for:', todo.details.title);
  }
} 