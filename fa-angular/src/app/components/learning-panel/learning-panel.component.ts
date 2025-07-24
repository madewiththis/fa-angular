import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LearningPanelService } from '../../services/learning-panel.service';

@Component({
  selector: 'app-learning-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div 
      class="learning-panel-overlay" 
      [class.open]="learningPanel.isOpen"
      (click)="onOverlayClick()"
    >
      <div 
        class="learning-panel" 
        (click)="$event.stopPropagation()"
        [class.open]="learningPanel.isOpen"
      >
        <!-- Panel Header -->
        <div class="panel-header">
          <div class="header-title">
            <mat-icon>school</mat-icon>
            <h2>Learning Center</h2>
          </div>
          <button 
            mat-icon-button 
            (click)="learningPanel.closePanel()"
            class="close-btn"
            aria-label="Close learning panel"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Panel Content -->
        <div class="panel-content">
          <!-- Goal Overview View -->
          <div *ngIf="learningPanel.getCurrentView() === 'goal_overview'" class="view-container">
            <div *ngIf="!learningPanel.hasActiveGoal" class="welcome-state">
              <div class="welcome-icon">
                <mat-icon>lightbulb</mat-icon>
              </div>
              <h3>Welcome to the Learning Center</h3>
              <p>
                Start evaluating FlowAccount by selecting a business goal from the Get Started page. 
                We'll guide you through hands-on tasks to see if FlowAccount fits your needs.
              </p>
              <button 
                mat-stroked-button 
                color="primary"
                (click)="learningPanel.closePanel()"
                class="action-btn"
              >
                Go to Get Started
              </button>
            </div>

            <div *ngIf="learningPanel.hasActiveGoal" class="goal-overview">
              <div class="goal-header">
                <h3>{{ learningPanel.activeGoal()?.name }}</h3>
                <p class="goal-description">{{ learningPanel.activeGoal()?.description }}</p>
              </div>
              
              <div class="goal-benefit">
                <strong>Expected Outcome:</strong>
                {{ learningPanel.activeGoal()?.overallBenefit }}
              </div>

              <div class="workflows-selection">
                <h4>Choose a workflow to try:</h4>
                <div class="workflow-cards">
                  <div 
                    *ngFor="let workflow of learningPanel.activeGoal()?.workflows"
                    class="workflow-card"
                    (click)="learningPanel.selectWorkflow(workflow)"
                  >
                    <div class="workflow-info">
                      <h5>{{ workflow.name }}</h5>
                      <p>{{ workflow.benefitStatement }}</p>
                      <div class="workflow-meta">
                        <span class="time">~{{ workflow.estimatedTime }} min</span>
                        <span class="difficulty" [class]="workflow.difficulty">{{ workflow.difficulty }}</span>
                      </div>
                    </div>
                    <mat-icon class="workflow-arrow">arrow_forward</mat-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Workflow List View -->
          <div *ngIf="learningPanel.getCurrentView() === 'workflow_list'" class="view-container">
            <div class="breadcrumb">
              <button mat-button (click)="learningPanel.goBackToGoalOverview()" class="breadcrumb-btn">
                <mat-icon>arrow_back</mat-icon>
                {{ learningPanel.activeGoal()?.name }}
              </button>
            </div>

            <div class="workflow-detail">
              <h3>{{ learningPanel.activeWorkflow()?.name }}</h3>
              <p>{{ learningPanel.activeWorkflow()?.description }}</p>
              
              <div class="workflow-outcome">
                <strong>What you'll achieve:</strong>
                {{ learningPanel.activeWorkflow()?.benefitStatement }}
              </div>

              <div class="tasks-preview">
                <h4>Tasks in this workflow:</h4>
                <div class="task-list">
                  <div 
                    *ngFor="let task of learningPanel.activeWorkflow()?.tasks; let i = index"
                    class="task-item"
                  >
                    <div class="task-number">{{ i + 1 }}</div>
                    <div class="task-info">
                      <h5>{{ task.name }}</h5>
                      <p>{{ task.description }}</p>
                      <span class="task-time">~{{ task.estimatedTime }} min</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                mat-raised-button 
                color="primary" 
                (click)="startWorkflow()"
                class="start-workflow-btn"
              >
                Start This Workflow
              </button>
            </div>
          </div>

          <!-- Task Guidance View -->
          <div *ngIf="learningPanel.getCurrentView() === 'task_guidance'" class="view-container">
            <div class="breadcrumb">
              <button mat-button (click)="learningPanel.goBackToWorkflowList()" class="breadcrumb-btn">
                <mat-icon>arrow_back</mat-icon>
                {{ learningPanel.activeWorkflow()?.name }}
              </button>
            </div>

            <div *ngIf="learningPanel.hasActiveTask" class="task-guidance">
              <div class="task-header">
                <h3>{{ learningPanel.activeTask()?.name }}</h3>
                <div class="task-meta">
                  <span class="time">~{{ learningPanel.activeTask()?.estimatedTime }} min</span>
                  <span class="difficulty" [class]="learningPanel.activeTask()?.difficulty">
                    {{ learningPanel.activeTask()?.difficulty }}
                  </span>
                </div>
              </div>

              <div class="task-outcome">
                <strong>What you'll achieve:</strong>
                {{ learningPanel.activeTask()?.taskOutcome }}
              </div>

              <div class="task-instructions">
                <h4>Instructions</h4>
                <p class="instructions-overview">{{ learningPanel.activeTask()?.instructions?.overview }}</p>
                
                <div class="steps-list">
                  <div 
                    *ngFor="let step of learningPanel.activeTask()?.instructions?.steps"
                    class="step-item"
                  >
                    <div class="step-number">{{ step.stepNumber }}</div>
                    <div class="step-content">
                      <h5>{{ step.title }}</h5>
                      <p>{{ step.description }}</p>
                      <div *ngIf="step.inputValue" class="step-input">
                        <strong>Enter:</strong> <code>{{ step.inputValue }}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="learningPanel.activeTask()?.tips?.length" class="task-tips">
                <h4>💡 Tips</h4>
                <ul>
                  <li *ngFor="let tip of learningPanel.activeTask()?.tips">{{ tip }}</li>
                </ul>
              </div>

              <div class="task-actions">
                <button 
                  mat-raised-button 
                  color="primary"
                  (click)="markTaskComplete()"
                  class="complete-btn"
                >
                  Mark as Complete
                </button>
                <button 
                  mat-stroked-button
                  (click)="skipTask()"
                  class="skip-btn"
                >
                  Skip This Task
                </button>
              </div>
            </div>
          </div>

          <!-- Progress Summary View -->
          <div *ngIf="learningPanel.getCurrentView() === 'progress_summary'" class="view-container">
            <div class="progress-summary">
              <div class="progress-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <h3>Great Progress!</h3>
              <p>You're making excellent progress evaluating FlowAccount.</p>
              <!-- TODO: Add actual progress tracking -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Overlay that covers the entire screen */
    .learning-panel-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .learning-panel-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    /* The actual panel that slides in from the right */
    .learning-panel {
      position: absolute;
      top: 0;
      right: 0;
      width: 480px;
      height: 100vh;
      background: white;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .learning-panel.open {
      transform: translateX(0);
    }

    /* Panel Header */
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: #f8fafc;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-title mat-icon {
      color: #3b82f6;
      font-size: 24px;
    }

    .header-title h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .close-btn {
      color: #6b7280;
    }

    .close-btn:hover {
      color: #374151;
    }

    /* Panel Content */
    .panel-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .view-container {
      padding: 24px;
      min-height: 100%;
    }

    /* Welcome State */
    .welcome-state {
      text-align: center;
      padding: 48px 24px;
    }

    .welcome-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #fbbf24;
      margin-bottom: 16px;
    }

    .welcome-state h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 12px;
    }

    .welcome-state p {
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 24px;
    }

    .action-btn {
      width: 100%;
      padding: 12px;
      font-weight: 500;
    }

    /* Goal Overview */
    .goal-header h3 {
      font-size: 1.375rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px;
    }

    .goal-description {
      color: #6b7280;
      line-height: 1.5;
      margin: 0 0 20px;
    }

    .goal-benefit {
      background: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      font-size: 0.9rem;
      color: #92400e;
      line-height: 1.4;
    }

    /* Workflow Cards */
    .workflows-selection h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px;
    }

    .workflow-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .workflow-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
    }

    .workflow-info {
      flex: 1;
    }

    .workflow-info h5 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 4px;
    }

    .workflow-info p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 8px;
      line-height: 1.4;
    }

    .workflow-meta {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .time {
      font-size: 0.75rem;
      color: #6b7280;
      background: #e5e7eb;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .difficulty {
      font-size: 0.75rem;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 500;
    }

    .difficulty.beginner {
      background: #dcfce7;
      color: #166534;
    }

    .difficulty.intermediate {
      background: #fef3c7;
      color: #92400e;
    }

    .difficulty.advanced {
      background: #fee2e2;
      color: #991b1b;
    }

    .workflow-arrow {
      color: #9ca3af;
      margin-left: 12px;
    }

    /* Breadcrumb */
    .breadcrumb {
      margin-bottom: 20px;
    }

    .breadcrumb-btn {
      color: #3b82f6;
      padding: 4px 8px;
      min-width: auto;
    }

    .breadcrumb-btn mat-icon {
      font-size: 18px;
      margin-right: 4px;
    }

    /* Task Guidance */
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .task-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      flex: 1;
    }

    .task-meta {
      display: flex;
      gap: 8px;
      margin-left: 16px;
    }

    .task-outcome {
      background: #eff6ff;
      border: 1px solid #3b82f6;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      font-size: 0.9rem;
      color: #1e40af;
      line-height: 1.4;
    }

    /* Instructions */
    .task-instructions h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 12px;
    }

    .instructions-overview {
      color: #6b7280;
      margin: 0 0 20px;
      line-height: 1.5;
    }

    .step-item {
      display: flex;
      margin-bottom: 16px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 3px solid #3b82f6;
    }

    .step-number {
      background: #3b82f6;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      flex-shrink: 0;
      margin-right: 12px;
    }

    .step-content h5 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 4px;
    }

    .step-content p {
      color: #6b7280;
      margin: 0 0 8px;
      line-height: 1.4;
    }

    .step-input {
      font-size: 0.875rem;
      color: #374151;
    }

    .step-input code {
      background: #e5e7eb;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: monospace;
    }

    /* Tips */
    .task-tips {
      background: #fef7ed;
      border: 1px solid #fb923c;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
    }

    .task-tips h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #ea580c;
      margin: 0 0 8px;
    }

    .task-tips ul {
      margin: 0;
      padding-left: 16px;
      color: #9a3412;
    }

    .task-tips li {
      margin-bottom: 4px;
      line-height: 1.4;
    }

    /* Task Actions */
    .task-actions {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 12px;
    }

    .complete-btn {
      flex: 1;
      padding: 12px;
      font-weight: 500;
    }

    .skip-btn {
      padding: 12px 16px;
    }

    /* Task List in Workflow Detail */
    .task-list {
      margin: 16px 0;
    }

    .task-item {
      display: flex;
      align-items: flex-start;
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .task-item .task-number {
      background: #e5e7eb;
      color: #374151;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      flex-shrink: 0;
      margin-right: 12px;
    }

    .task-item .task-info h5 {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 2px;
    }

    .task-item .task-info p {
      font-size: 0.8rem;
      color: #6b7280;
      margin: 0 0 4px;
      line-height: 1.3;
    }

    .task-time {
      font-size: 0.7rem;
      color: #9ca3af;
    }

    .start-workflow-btn {
      width: 100%;
      padding: 14px;
      font-weight: 500;
      margin-top: 20px;
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .learning-panel {
        width: 100vw;
      }
    }
  `]
})
export class LearningPanelComponent {
  protected learningPanel = inject(LearningPanelService);

  onOverlayClick(): void {
    this.learningPanel.closePanel();
  }

  startWorkflow(): void {
    const workflow = this.learningPanel.activeWorkflow();
    if (workflow && workflow.tasks.length > 0) {
      this.learningPanel.selectTask(workflow.tasks[0]);
    }
  }

  markTaskComplete(): void {
    const task = this.learningPanel.activeTask();
    if (task) {
      this.learningPanel.markTaskComplete(task.id);
      // Move to next task or complete workflow
      this.moveToNextTask();
    }
  }

  skipTask(): void {
    this.moveToNextTask();
  }

  private moveToNextTask(): void {
    const workflow = this.learningPanel.activeWorkflow();
    const currentTask = this.learningPanel.activeTask();
    
    if (workflow && currentTask) {
      const currentIndex = workflow.tasks.findIndex(task => task.id === currentTask.id);
      if (currentIndex < workflow.tasks.length - 1) {
        // Move to next task
        this.learningPanel.selectTask(workflow.tasks[currentIndex + 1]);
      } else {
        // Workflow complete
        this.learningPanel.markWorkflowComplete(workflow.id);
        this.learningPanel.goBackToGoalOverview();
        // TODO: Show completion celebration
      }
    }
  }
}