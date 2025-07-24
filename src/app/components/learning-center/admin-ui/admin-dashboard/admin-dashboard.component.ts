import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LearningContentService } from '../../services/learning-content.service';
import { ContentManagementService } from '../../services/content-management.service';
import { GoalManagementComponent } from '../content-management/goal-management/goal-management.component';
import { WorkflowManagementComponent } from '../content-management/workflow-management/workflow-management.component';
import { TaskManagementComponent } from '../content-management/task-management/task-management.component';
import { RelationshipBuilderComponent } from '../relationship-builder/relationship-builder.component';
import { ContentValidationDisplayComponent } from '../shared/content-validation-display/content-validation-display.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatBadgeModule,
    MatTooltipModule,
    GoalManagementComponent,
    WorkflowManagementComponent,
    TaskManagementComponent,
    RelationshipBuilderComponent,
    ContentValidationDisplayComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  private learningContentService = inject(LearningContentService);
  private contentManagementService = inject(ContentManagementService);

  // UI State
  selectedTabIndex = signal<number>(0);
  
  // Content Statistics
  readonly contentStats = computed(() => {
    const totalContent = this.learningContentService.totalContent();
    const publishedContent = this.learningContentService.publishedContent();
    
    return {
      total: totalContent,
      published: publishedContent,
      drafts: {
        goals: totalContent.goals - publishedContent.goals,
        workflows: totalContent.workflows - publishedContent.workflows,
        tasks: totalContent.tasks - publishedContent.tasks
      }
    };
  });

  // Validation State
  readonly validationResults = this.contentManagementService.validationResults;
  readonly hasValidationErrors = computed(() => {
    const results = this.validationResults();
    return results && !results.valid;
  });

  // Tab Configuration
  readonly tabConfig = [
    {
      label: 'Goals',
      icon: 'flag',
      badge: () => this.contentStats().total.goals,
      component: 'goals'
    },
    {
      label: 'Workflows', 
      icon: 'account_tree',
      badge: () => this.contentStats().total.workflows,
      component: 'workflows'
    },
    {
      label: 'Tasks',
      icon: 'task_alt',
      badge: () => this.contentStats().total.tasks,
      component: 'tasks'
    },
    {
      label: 'Relationships',
      icon: 'hub',
      badge: () => null,
      component: 'relationships'
    },
    {
      label: 'Validation',
      icon: 'verified',
      badge: () => this.hasValidationErrors() ? '!' : null,
      component: 'validation'
    }
  ];

  constructor() {
    // Run initial validation
    this.validateContent();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex.set(index);
  }

  validateContent(): void {
    this.contentManagementService.validateContent();
  }

  exportContent(): void {
    const content = this.contentManagementService.exportContent();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-content-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async importContent(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const content = await file.text();
    
    try {
      const success = await this.contentManagementService.importContent(content);
      if (success) {
        console.log('Content imported successfully');
        this.validateContent();
      } else {
        console.error('Failed to import content');
      }
    } catch (error) {
      console.error('Error importing content:', error);
    }
  }

  resetContent(): void {
    if (confirm('Are you sure you want to reset all content? This action cannot be undone.')) {
      this.learningContentService.resetAll();
      this.validateContent();
    }
  }
}