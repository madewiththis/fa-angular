import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingService } from '../../../services/onboarding.service';
import { TutorialItemComponent } from '../tutorial-item/tutorial-item.component';

@Component({
  selector: 'app-tutorial-list',
  standalone: true,
  imports: [CommonModule, TutorialItemComponent],
  template: `
    <div class="tutorial-list-container" *ngIf="onboarding">
      <div class="list-header">
        <h2>Your Personalized Tutorial Guide</h2>
        <p>Based on your responses, here are the tutorials we recommend for you:</p>
        
        <div class="progress-section">
          <div class="progress-text">
            {{ progress().completedTutorials }} of {{ progress().totalTutorials }} tutorials completed
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              [style.width.%]="progress().percentComplete"
            ></div>
          </div>
          <div class="progress-percentage">
            {{ progress().percentComplete }}%
          </div>
        </div>
      </div>

      <div class="tutorial-list">
        <app-tutorial-item 
          *ngFor="let tutorial of onboarding.recommendedTutorials; trackBy: trackByTutorialId"
          [tutorial]="tutorial"
        ></app-tutorial-item>
      </div>

      <div class="list-footer" *ngIf="progress().percentComplete === 100">
        <div class="completion-celebration">
          <h3>🎉 Congratulations!</h3>
          <p>You've completed all your recommended tutorials. You're ready to make the most of FlowAccount!</p>
          <button class="action-button" (click)="goToDashboard()">
            Go to Dashboard
          </button>
        </div>
      </div>

      <div class="list-actions">
        <button class="action-button secondary" (click)="retakeSurvey()">
          Retake Survey
        </button>
        <button class="action-button secondary" (click)="addMoreTutorials()">
          Browse All Tutorials
        </button>
      </div>
    </div>
  `,
  styles: [`
    .tutorial-list-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }

    .list-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .list-header h2 {
      font-size: 1.75rem;
      font-weight: 600;
      margin: 0 0 8px;
      color: #1a1a1a;
    }

    .list-header p {
      font-size: 1rem;
      color: #666;
      margin: 0 0 24px;
    }

    .progress-section {
      background: #f8f9fa;
      border: 1px solid #ddd;
      padding: 20px;
      text-align: center;
    }

    .progress-text {
      font-weight: 500;
      margin-bottom: 12px;
      color: #1a1a1a;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e9ecef;
      border: 1px solid #000;
      margin-bottom: 8px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #28a745;
      transition: width 0.3s ease;
    }

    .progress-percentage {
      font-size: 0.875rem;
      font-weight: 600;
      color: #28a745;
    }

    .tutorial-list {
      margin-bottom: 40px;
    }

    .completion-celebration {
      background: #d4edda;
      border: 2px solid #28a745;
      padding: 24px;
      text-align: center;
      margin-bottom: 24px;
    }

    .completion-celebration h3 {
      margin: 0 0 8px;
      color: #155724;
      font-size: 1.25rem;
    }

    .completion-celebration p {
      margin: 0 0 16px;
      color: #155724;
    }

    .list-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .action-button {
      padding: 12px 24px;
      border: 2px solid #000;
      background: #000;
      color: #fff;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-button:hover {
      background: #333;
    }

    .action-button.secondary {
      background: #fff;
      color: #000;
    }

    .action-button.secondary:hover {
      background: #f5f5f5;
    }

    @media (max-width: 768px) {
      .tutorial-list-container {
        padding: 16px;
      }
      
      .list-header h2 {
        font-size: 1.5rem;
      }
      
      .list-actions {
        flex-direction: column;
      }
      
      .action-button {
        width: 100%;
      }
    }
  `]
})
export class TutorialListComponent {
  private onboardingService = inject(OnboardingService);
  
  onboarding = this.onboardingService.currentOnboarding;
  progress = computed(() => this.onboardingService.getProgress());

  trackByTutorialId(index: number, tutorial: any): string {
    return tutorial.id;
  }

  retakeSurvey(): void {
    // This will be handled by the parent component
    this.onboardingService.resetOnboarding();
  }

  addMoreTutorials(): void {
    // Future feature: Browse all available tutorials
    console.log('Browse all tutorials - coming soon!');
  }

  goToDashboard(): void {
    // Navigate to main dashboard
    window.location.href = '/dashboard/overview';
  }
}