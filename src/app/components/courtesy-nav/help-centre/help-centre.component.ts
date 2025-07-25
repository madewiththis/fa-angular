import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LearningCenterPanelComponent } from '../../learning-center/learning-center-panel/learning-center-panel.component';
import { LearningPanelService } from '../../learning-center/services/learning-panel.service';

@Component({
  selector: 'app-help-centre',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, LearningCenterPanelComponent],
  template: `
    <button 
      mat-icon-button 
      color="primary" 
      (click)="toggleLearningPanel()" 
      style="border-radius: 50%;"
      [attr.aria-label]="learningPanel.isOpen ? 'Close learning center' : 'Open learning center'"
      [class.active]="learningPanel.isOpen"
    >
      <mat-icon>{{ learningPanel.isOpen ? 'close' : 'school' }}</mat-icon>
    </button>
    
    <!-- Full-height Learning Center Panel -->
    <app-learning-center-panel></app-learning-center-panel>
  `,
  styles: [`
    button[mat-icon-button] {
      background: #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      width: 40px;
      height: 40px;
      margin: 0;
      transition: all 0.2s ease;
    }
    
    button[mat-icon-button].active {
      background: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }
    
    button[mat-icon-button].active mat-icon {
      color: white;
    }
    
    mat-icon {
      font-size: 22px;
      color: #333;
      transition: color 0.2s ease;
    }
    
    button[mat-icon-button]:hover {
      background: #f3f4f6;
    }
    
    button[mat-icon-button].active:hover {
      background: #2563eb;
    }
  `]
})
export class HelpCentreComponent {
  protected learningPanel = inject(LearningPanelService);

  toggleLearningPanel(): void {
    this.learningPanel.togglePanel();
  }
}
