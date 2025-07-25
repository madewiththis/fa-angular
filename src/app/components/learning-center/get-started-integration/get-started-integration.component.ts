import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { LearningContentService } from '../services/learning-content.service';
import { LearningPanelService } from '../services/learning-panel.service';

@Component({
  selector: 'app-get-started-integration',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './get-started-integration.component.html',
  styleUrls: ['./get-started-integration.component.scss']
})
export class GetStartedIntegrationComponent {
  private learningContentService = inject(LearningContentService);
  private learningPanelService = inject(LearningPanelService);
  
  // Component state
  readonly quickActions = signal([
    {
      id: 'create-first-invoice',
      title: 'Create Your First Invoice',
      description: 'Learn the basics of creating professional invoices',
      icon: 'receipt',
      difficulty: 'beginner',
      estimatedTime: 10,
      contentId: 'task-create-invoice-basic'
    },
    {
      id: 'setup-contacts',
      title: 'Add Your First Customer',
      description: 'Set up your customer database for invoicing',
      icon: 'person_add',
      difficulty: 'beginner', 
      estimatedTime: 5,
      contentId: 'task-add-contact'
    },
    {
      id: 'configure-payment',
      title: 'Setup Payment Methods',
      description: 'Configure how customers can pay you',
      icon: 'payment',
      difficulty: 'intermediate',
      estimatedTime: 15,
      contentId: 'workflow-payment-setup'
    }
  ]);
  
  constructor() {
    // Initialize component
  }
  
  openLearningContent(contentId: string): void {
    // Find the content in the learning content service
    const allContent = [
      ...this.learningContentService.tasks(),
      ...this.learningContentService.workflows(),
      ...this.learningContentService.goals()
    ];
    
    const content = allContent.find(c => c.id === contentId);
    
    if (content) {
      // Open the learning panel with this content
      this.learningPanelService.loadContent(content);
      this.learningPanelService.openPanel();
    }
  }
  
  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner': return 'primary';
      case 'intermediate': return 'accent';
      case 'advanced': return 'warn';
      default: return 'primary';
    }
  }
  
  formatTime(minutes: number): string {
    return minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }
}