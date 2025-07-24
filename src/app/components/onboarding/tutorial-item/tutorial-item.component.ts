import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialGuide } from '../../../models/onboarding.interfaces';
import { OnboardingService } from '../../../services/onboarding.service';

@Component({
  selector: 'app-tutorial-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tutorial-item" [class.completed]="isCompleted()">
      <div class="tutorial-header">
        <div class="tutorial-info">
          <h3>{{ tutorial.title }}</h3>
          <p>{{ tutorial.description }}</p>
          <div class="tutorial-meta">
            <span *ngIf="tutorial.estimatedDuration" class="duration">
              {{ tutorial.estimatedDuration }}
            </span>
            <span *ngIf="tutorial.category" class="category">
              {{ tutorial.category }}
            </span>
          </div>
        </div>
        
        <div class="completion-toggle">
          <button 
            class="completion-button"
            [class.completed]="isCompleted()"
            (click)="toggleCompletion()"
            [title]="isCompleted() ? 'Mark as incomplete' : 'Mark as complete'"
          >
            <span class="checkmark">✓</span>
          </button>
        </div>
      </div>

      <div class="tutorial-video">
        <div class="video-placeholder">
          <p><strong>Video:</strong> {{ tutorial.videoConfig.title }}</p>
          <p class="video-url">URL: {{ tutorial.videoConfig.url }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tutorial-item {
      border: 2px solid #000;
      background: #fff;
      margin-bottom: 24px;
      transition: all 0.3s ease;
    }

    .tutorial-item.completed {
      background: #f8f9fa;
      border-color: #28a745;
    }

    .tutorial-header {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .tutorial-info {
      flex: 1;
    }

    .tutorial-info h3 {
      margin: 0 0 8px;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .tutorial-info p {
      margin: 0 0 12px;
      color: #666;
      line-height: 1.5;
    }

    .tutorial-meta {
      display: flex;
      gap: 12px;
      font-size: 0.875rem;
    }

    .duration {
      color: #888;
      font-weight: 500;
    }

    .category {
      color: #666;
      background: #f0f0f0;
      padding: 2px 8px;
      border: 1px solid #ddd;
      font-weight: 500;
    }

    .completion-toggle {
      flex-shrink: 0;
    }

    .completion-button {
      width: 40px;
      height: 40px;
      border: 2px solid #000;
      background: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      position: relative;
    }

    .completion-button:hover {
      background: #f5f5f5;
    }

    .completion-button.completed {
      background: #28a745;
      border-color: #28a745;
      color: #fff;
    }

    .completion-button.completed:hover {
      background: #218838;
    }

    .checkmark {
      font-weight: bold;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.2s;
    }

    .completion-button.completed .checkmark {
      opacity: 1;
      transform: scale(1);
    }

    .tutorial-video {
      border-top: 1px solid #eee;
    }

    .tutorial-item.completed .tutorial-video {
      border-top-color: #d4edda;
    }

    .video-placeholder {
      padding: 20px;
      background: #f8f9fa;
    }

    .video-placeholder p {
      margin: 0 0 8px;
      color: #666;
    }

    .video-url {
      font-family: monospace;
      font-size: 0.875rem;
      word-break: break-all;
    }

    @media (max-width: 768px) {
      .tutorial-header {
        flex-direction: column;
        gap: 12px;
      }
      
      .completion-toggle {
        align-self: flex-end;
      }
      
      .tutorial-info h3 {
        font-size: 1.125rem;
      }
    }
  `]
})
export class TutorialItemComponent {
  @Input({ required: true }) tutorial!: TutorialGuide;
  
  private onboardingService = inject(OnboardingService);

  isCompleted(): boolean {
    return this.onboardingService.isTutorialCompleted(this.tutorial.id);
  }

  toggleCompletion(): void {
    if (this.isCompleted()) {
      this.onboardingService.markTutorialIncomplete(this.tutorial.id);
    } else {
      this.onboardingService.markTutorialCompleted(this.tutorial.id);
    }
  }
}