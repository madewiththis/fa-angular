import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

import { ContentManagementService } from '../../../services/content-management.service';
import { LearningContentService } from '../../../services/learning-content.service';

@Component({
  selector: 'app-content-validation-display',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule
  ],
  template: `
    <div class="validation-display">
      <div class="validation-header">
        <h2>Content Validation</h2>
        <button mat-raised-button color="primary" (click)="runValidation()">
          <mat-icon>refresh</mat-icon>
          Run Validation
        </button>
      </div>
      
      @if (validationResults()) {
        <mat-card class="validation-results">
          <mat-card-header>
            <mat-card-title>
              <mat-icon [color]="validationResults()?.valid ? 'primary' : 'warn'">
                {{ validationResults()?.valid ? 'check_circle' : 'error' }}
              </mat-icon>
              {{ validationResults()?.valid ? 'Content is Valid' : 'Validation Issues Found' }}
            </mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            @if (validationResults()?.errors && validationResults()!.errors.length > 0) {
              <div class="validation-section">
                <h3 class="error-title">
                  <mat-icon color="warn">error</mat-icon>
                  Errors ({{ validationResults()!.errors.length }})
                </h3>
                <mat-list>
                  @for (error of validationResults()?.errors; track error) {
                    <mat-list-item class="error-item">
                      <mat-icon matListItemIcon color="warn">error</mat-icon>
                      <span matListItemTitle>{{ error }}</span>
                    </mat-list-item>
                  }
                </mat-list>
              </div>
            }
            
            @if (validationResults()?.warnings && validationResults()!.warnings.length > 0) {
              <div class="validation-section">
                <h3 class="warning-title">
                  <mat-icon color="accent">warning</mat-icon>
                  Warnings ({{ validationResults()!.warnings.length }})
                </h3>
                <mat-list>
                  @for (warning of validationResults()?.warnings; track warning) {
                    <mat-list-item class="warning-item">
                      <mat-icon matListItemIcon color="accent">warning</mat-icon>
                      <span matListItemTitle>{{ warning }}</span>
                    </mat-list-item>
                  }
                </mat-list>
              </div>
            }
            
            @if (validationResults()?.valid) {
              <div class="success-message">
                <mat-icon color="primary">check_circle</mat-icon>
                <p>All content relationships are valid and no issues were found.</p>
              </div>
            }
          </mat-card-content>
        </mat-card>
        
        <!-- Content Summary -->
        <mat-card class="content-summary">
          <mat-card-header>
            <mat-card-title>Content Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-stats">
              <div class="stat-item">
                <mat-icon>flag</mat-icon>
                <div class="stat-details">
                  <span class="stat-number">{{ totalContentStats().goals }}</span>
                  <span class="stat-label">Total Goals</span>
                  <span class="stat-published">({{ publishedContentStats().goals }} published)</span>
                </div>
              </div>
              
              <div class="stat-item">
                <mat-icon>account_tree</mat-icon>
                <div class="stat-details">
                  <span class="stat-number">{{ totalContentStats().workflows }}</span>
                  <span class="stat-label">Total Workflows</span>
                  <span class="stat-published">({{ publishedContentStats().workflows }} published)</span>
                </div>
              </div>
              
              <div class="stat-item">
                <mat-icon>task_alt</mat-icon>
                <div class="stat-details">
                  <span class="stat-number">{{ totalContentStats().tasks }}</span>
                  <span class="stat-label">Total Tasks</span>
                  <span class="stat-published">({{ publishedContentStats().tasks }} published)</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card class="no-validation">
          <mat-card-content>
            <div class="placeholder-content">
              <mat-icon class="placeholder-icon">verified</mat-icon>
              <h3>No Validation Results</h3>
              <p>Click "Run Validation" to check content integrity.</p>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .validation-display {
      height: 100%;
    }
    
    .validation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      
      h2 {
        margin: 0;
        color: #333;
      }
    }
    
    .validation-results {
      margin-bottom: 24px;
      
      mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .validation-section {
        margin-bottom: 24px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .error-title, .warning-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 500;
        }
        
        .error-title {
          color: #d32f2f;
        }
        
        .warning-title {
          color: #f57c00;
        }
        
        mat-list {
          .error-item, .warning-item {
            border-left: 3px solid;
            margin-bottom: 8px;
            background-color: #fafafa;
          }
          
          .error-item {
            border-left-color: #d32f2f;
          }
          
          .warning-item {
            border-left-color: #f57c00;
          }
        }
      }
      
      .success-message {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background-color: #e8f5e8;
        border-radius: 8px;
        
        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
        }
        
        p {
          margin: 0;
          color: #2e7d32;
          font-weight: 500;
        }
      }
    }
    
    .content-summary {
      .summary-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background-color: #f5f5f5;
          border-radius: 8px;
          
          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
            color: #666;
          }
          
          .stat-details {
            display: flex;
            flex-direction: column;
            
            .stat-number {
              font-size: 24px;
              font-weight: 700;
              color: #333;
            }
            
            .stat-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 2px;
            }
            
            .stat-published {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
    
    .no-validation {
      .placeholder-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        text-align: center;
        
        .placeholder-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          color: #ccc;
          margin-bottom: 16px;
        }
        
        h3 {
          margin: 0 0 8px 0;
          color: #666;
        }
        
        p {
          margin: 0;
          color: #999;
        }
      }
    }
  `]
})
export class ContentValidationDisplayComponent {
  private contentManagementService = inject(ContentManagementService);
  private learningContentService = inject(LearningContentService);

  readonly validationResults = this.contentManagementService.validationResults;
  readonly totalContentStats = this.learningContentService.totalContent;
  readonly publishedContentStats = this.learningContentService.publishedContent;

  runValidation(): void {
    this.contentManagementService.validateContent();
  }
}