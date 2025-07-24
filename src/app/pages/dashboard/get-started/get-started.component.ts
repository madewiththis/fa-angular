import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileTestingService } from '../../../services/user-profile-testing.service';
import { LearningPanelService } from '../../../services/learning-panel.service';
import { CompanySetupService } from '../../../services/company-setup.service';
import { LearningContentService } from '../../../components/learning-center/services/learning-content.service';
import { BusinessGoal } from '../../../models/goal-system.interfaces';
import { QuickGuideCategory, LearningTask, LearningWorkflow, LearningGoal } from '../../../components/learning-center/models/learning-content.types';
import { getRecommendedGoals, searchGoals } from '../../../data/goal-library';
import { CompanySetupModalComponent, CompanySetupData } from '../../../components/settings/company-setup/company-setup-modal.component';

@Component({
  selector: 'app-get-started',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  template: `
    <div class="get-started-container">
      <!-- New Goal-Based Evaluation Interface -->
      <div class="evaluation-header">
        <h1>Let's help you evaluate FlowAccount</h1>
        <p class="evaluation-subtitle">
          We want to help you see if FlowAccount is the right software for your business. 
          Complete real business tasks to experience the value firsthand.
        </p>
        
      </div>

      <div class="evaluation-content">
        <!-- Left Side: Popular First Steps -->
        <div class="first-steps-section">
          <div class="first-steps-card">
            <h3>Get started quickly</h3>
            <p class="first-steps-subtitle">Popular first steps to experience FlowAccount</p>
            
            <div class="quick-actions-list">
              <div 
                *ngFor="let action of quickActions()" 
                class="quick-action-item"
                [class.completed]="action.completed"
                [class.disabled]="!action.enabled"
                [class.selected]="selectedQuickAction() === action.id"
                (click)="handleQuickActionClick($event, action)"
              >
                <div class="action-icon">
                  <mat-icon [class]="action.iconClass">{{ action.icon }}</mat-icon>
                </div>
                <div class="action-content">
                  <div class="action-header">
                    <span class="action-title">{{ action.title }}</span>
                    <mat-icon *ngIf="action.completed" class="completion-check">check_circle</mat-icon>
                  </div>
                  <p class="action-description">{{ action.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Dynamic Sub-Actions -->
        <div class="sub-actions-section">
          <div *ngIf="selectedQuickAction(); else noSelectionMessage" class="sub-actions-content">
            <h3 class="sub-actions-title">Next steps for {{ getSelectedActionTitle() }}</h3>
            <div class="sub-actions-list">
              <div 
                *ngFor="let subAction of getSelectedSubActions()"
                class="sub-action-item"
                [class.completed]="subAction.completed"
                (click)="handleSubActionClick($event, subAction)"
              >
                <div class="sub-action-icon">
                  <mat-icon>{{ subAction.icon }}</mat-icon>
                </div>
                <div class="sub-action-content">
                  <div class="sub-action-header">
                    <span class="sub-action-title">{{ subAction.title }}</span>
                    <span class="sub-action-time">{{ subAction.estimatedTime }}</span>
                  </div>
                  <p class="sub-action-description">{{ subAction.description }}</p>
                </div>
                <div class="sub-action-status">
                  <mat-icon *ngIf="subAction.completed" class="completion-check">check_circle</mat-icon>
                  <mat-icon *ngIf="!subAction.completed" class="arrow-icon">arrow_forward</mat-icon>
                </div>
              </div>
            </div>
          </div>
          
          <ng-template #noSelectionMessage>
            <div class="no-selection-state">
              <mat-icon class="selection-icon">touch_app</mat-icon>
              <h3>Choose a quick start action</h3>
              <p>Select an action from the left to see specific next steps and start exploring FlowAccount's features.</p>
            </div>
          </ng-template>
        </div>
      </div>


    </div>

    <!-- Modal Overlay for Role Selection -->
    <div 
      *ngIf="showRoleSelector" 
      class="modal-overlay"
      (click)="closeSelectors()"
    >
      <div class="selection-modal" (click)="$event.stopPropagation()">
        <!-- Anchored Selected Text -->
        <div 
          class="anchored-text role-anchor"
          [style]="getAnchorStyles()"
        >
          {{ selectedRole | titlecase }}s
        </div>
        
        <!-- Selection Options -->
        <div 
          class="selection-options role-options"
          [style]="getOptionsStyles()"
        >
          <div 
            *ngFor="let role of roleOptions" 
            class="selection-option"
            [class.current]="selectedRole === role.value"
            (click)="selectRole(role.value)"
          >
            {{ role.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Overlay for Business Type Selection -->
    <div 
      *ngIf="showBusinessTypeSelector" 
      class="modal-overlay"
      (click)="closeSelectors()"
    >
      <div class="selection-modal" (click)="$event.stopPropagation()">
        <!-- Anchored Selected Text -->
        <div 
          class="anchored-text business-type-anchor"
          [style]="getAnchorStyles()"
        >
          {{ getBusinessTypeDisplay(selectedBusinessType) }}
        </div>
        
        <!-- Selection Options -->
        <div 
          class="selection-options business-type-options"
          [style]="getOptionsStyles()"
        >
          <div 
            *ngFor="let businessType of businessTypeOptions" 
            class="selection-option"
            [class.current]="selectedBusinessType === businessType.value"
            (click)="selectBusinessType(businessType.value)"
          >
            {{ businessType.label }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .get-started-container {
        min-height: 100vh;
        padding: 24px;
        background: #fff;
      }
      
      /* New Goal-Based Interface Styles */
      .evaluation-header {
        text-align: center;
        margin-bottom: 48px;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }
      
      .evaluation-header h1 {
        font-size: 2.5rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 16px;
      }
      
      .evaluation-subtitle {
        font-size: 1.25rem;
        color: #6b7280;
        line-height: 1.6;
        margin: 0;
      }
      
      .evaluation-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 48px;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      /* First Steps Section Styles */
      .first-steps-section {
        
      }
      
      .first-steps-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 24px;
        position: sticky;
        top: 24px;
      }
      
      .first-steps-card h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 8px;
      }
      
      .first-steps-subtitle {
        font-size: 0.9rem;
        color: #6b7280;
        margin: 0 0 24px;
        line-height: 1.4;
      }
      
      /* Quick Actions List */
      .quick-actions-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .quick-action-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      }
      
      .quick-action-item:hover {
        border-color: #3b82f6;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        transform: translateY(-1px);
      }
      
      .quick-action-item.completed {
        background: #f0fdf4;
        border-color: #16a34a;
      }
      
      .quick-action-item.completed:hover {
        border-color: #15803d;
        box-shadow: 0 2px 8px rgba(22, 163, 74, 0.1);
      }
      
      /* Selected State for Quick Actions */
      .quick-action-item.selected {
        border-color: #3b82f6;
        background: #f0f9ff;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
      }
      
      .quick-action-item.selected::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: #3b82f6;
        border-radius: 8px 0 0 8px;
      }
      
      /* Action Icon */
      .action-icon {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: #f3f4f6;
      }
      
      .action-icon .setup-icon {
        color: #d97706;
      }
      
      .quick-action-item:nth-child(1) .action-icon {
        background: #fef3c7;
      }
      
      .action-icon .quote-icon {
        color: #3b82f6;
      }
      
      .quick-action-item:nth-child(2) .action-icon {
        background: #dbeafe;
      }
      
      .action-icon .payment-icon {
        color: #10b981;
      }
      
      .quick-action-item:nth-child(3) .action-icon {
        background: #d1fae5;
      }
      
      .action-icon .expense-icon {
        color: #ef4444;
      }
      
      .quick-action-item:nth-child(4) .action-icon {
        background: #fee2e2;
      }
      
      .action-icon .report-icon {
        color: #8b5cf6;
      }
      
      .quick-action-item:nth-child(5) .action-icon {
        background: #ede9fe;
      }
      
      .action-icon .sell-icon {
        color: #10b981;
      }
      
      .quick-action-item:nth-child(2) .action-icon {
        background: #d1fae5;
      }
      
      .action-icon .buy-icon {
        color: #8b5cf6;
      }
      
      .quick-action-item:nth-child(3) .action-icon {
        background: #ede9fe;
      }
      
      .action-icon .product-icon {
        color: #f59e0b;
      }
      
      .quick-action-item:nth-child(5) .action-icon {
        background: #fef3c7;
      }
      
      .action-icon .contact-icon {
        color: #06b6d4;
      }
      
      .quick-action-item:nth-child(6) .action-icon {
        background: #cffafe;
      }
      
      .action-icon .accounting-icon {
        color: #64748b;
      }
      
      .quick-action-item:nth-child(8) .action-icon {
        background: #f1f5f9;
      }
      
      /* Action Content */
      .action-content {
        flex: 1;
        min-width: 0;
      }
      
      .action-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
      }
      
      .action-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: #1f2937;
      }
      
      .completion-check {
        color: #16a34a;
        font-size: 18px;
      }
      
      .action-description {
        font-size: 0.8rem;
        color: #6b7280;
        margin: 0;
        line-height: 1.3;
      }
      
      .completed .action-title {
        color: #166534;
      }
      
      .completed .action-description {
        color: #16a34a;
      }
      
      /* Disabled States */
      .quick-action-item.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        
        &:hover {
          transform: none;
          box-shadow: none;
          border-color: #e5e7eb;
        }
      }
      
      /* Sub-Actions Section Styles */
      .sub-actions-section {
        position: relative;
      }
      
      .sub-actions-content {
        
      }
      
      .sub-actions-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 24px;
        line-height: 1.4;
      }
      
      .sub-actions-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .sub-action-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .sub-action-item:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        transform: translateY(-1px);
      }
      
      .sub-action-item.completed {
        background: #f0fdf4;
        border-color: #16a34a;
      }
      
      .sub-action-item.completed:hover {
        border-color: #15803d;
        box-shadow: 0 4px 12px rgba(22, 163, 74, 0.1);
      }
      
      .sub-action-icon {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: #f3f4f6;
        color: #6b7280;
      }
      
      .sub-action-content {
        flex: 1;
        min-width: 0;
      }
      
      .sub-action-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
      }
      
      .sub-action-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
      }
      
      .sub-action-time {
        font-size: 0.875rem;
        color: #6b7280;
        background: #f3f4f6;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 500;
      }
      
      .sub-action-description {
        font-size: 0.95rem;
        color: #6b7280;
        margin: 0;
        line-height: 1.4;
      }
      
      .sub-action-status {
        flex-shrink: 0;
      }
      
      .sub-action-status .completion-check {
        color: #16a34a;
        font-size: 24px;
      }
      
      .sub-action-status .arrow-icon {
        color: #9ca3af;
        font-size: 20px;
        transition: color 0.2s ease;
      }
      
      .sub-action-item:hover .arrow-icon {
        color: #3b82f6;
      }
      
      /* No Selection State */
      .no-selection-state {
        text-align: center;
        padding: 80px 40px;
        color: #6b7280;
      }
      
      .selection-icon {
        font-size: 64px;
        color: #d1d5db;
        margin-bottom: 24px;
      }
      
      .no-selection-state h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #374151;
        margin: 0 0 12px;
      }
      
      .no-selection-state p {
        font-size: 1rem;
        line-height: 1.6;
        margin: 0;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
      }
      
      .goals-section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 24px;
        line-height: 1.4;
        position: relative;
      }
      
      /* Clickable Role and Business Type */
      .clickable-role {
        color: #3b82f6;
        cursor: pointer;
        border-bottom: 2px dashed #3b82f6;
        padding-bottom: 2px;
        transition: all 0.2s ease;
        position: relative;
      }
      
      .clickable-role:hover {
        color: #1d4ed8;
        border-bottom-color: #1d4ed8;
        background-color: rgba(59, 130, 246, 0.05);
        padding: 2px 4px;
        margin: -2px -4px;
        border-radius: 4px;
      }
      
      .clickable-role.active {
        color: #1d4ed8;
        background-color: rgba(59, 130, 246, 0.1);
        padding: 2px 4px;
        margin: -2px -4px;
        border-radius: 4px;
        border-bottom-color: #1d4ed8;
      }
      
      .clickable-business-type {
        color: #10b981;
        cursor: pointer;
        border-bottom: 2px dashed #10b981;
        padding-bottom: 2px;
        transition: all 0.2s ease;
        position: relative;
      }
      
      .clickable-business-type:hover {
        color: #059669;
        border-bottom-color: #059669;
        background-color: rgba(16, 185, 129, 0.05);
        padding: 2px 4px;
        margin: -2px -4px;
        border-radius: 4px;
      }
      
      .clickable-business-type.active {
        color: #059669;
        background-color: rgba(16, 185, 129, 0.1);
        padding: 2px 4px;
        margin: -2px -4px;
        border-radius: 4px;
        border-bottom-color: #059669;
      }
      
      /* Modal Overlay Styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(4px);
        z-index: 1000;
        animation: overlayFadeIn 0.3s ease-out;
      }
      
      @keyframes overlayFadeIn {
        from {
          opacity: 0;
          backdrop-filter: blur(0px);
        }
        to {
          opacity: 1;
          backdrop-filter: blur(4px);
        }
      }
      
      .selection-modal {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      /* Anchored Text - maintains original position */
      .anchored-text {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.4;
        z-index: 1001;
        pointer-events: none;
        display: flex;
        align-items: center;
      }
      
      .anchored-text.role-anchor {
        color: #1d4ed8;
        background-color: rgba(59, 130, 246, 0.1);
        padding: 2px 4px;
        border-radius: 4px;
        border-bottom: 2px dashed #1d4ed8;
      }
      
      .anchored-text.business-type-anchor {
        color: #059669;
        background-color: rgba(16, 185, 129, 0.1);
        padding: 2px 4px;
        border-radius: 4px;
        border-bottom: 2px dashed #059669;
      }
      
      /* Selection Options - Minimal floating near anchor */
      .selection-options {
        position: fixed;
        z-index: 1002;
        animation: optionsFadeIn 0.2s ease-out;
      }
      
      @keyframes optionsFadeIn {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .selection-option {
        padding: 8px 0;
        cursor: pointer;
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.4;
        transition: opacity 0.15s ease;
        color: #6b7280;
      }
      
      .selection-option:hover {
        opacity: 0.7;
      }
      
      .selection-option.current {
        color: #1f2937;
        opacity: 1;
      }
      
      .role-options .selection-option.current {
        color: #1d4ed8;
      }
      
      .business-type-options .selection-option.current {
        color: #059669;
      }
      
      .goals-list {
        margin-bottom: 32px;
      }
      
      .goal-card {
        background: #fff;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        margin-bottom: 16px;
        transition: all 0.2s ease;
        overflow: hidden;
      }
      
      .goal-card:hover {
        border-color: #d1d5db;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      
      .goal-card.expanded {
        border-color: #3b82f6;
        box-shadow: 0 8px 25px -5px rgba(59, 130, 246, 0.1);
      }
      
      .goal-header {
        padding: 20px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      
      .goal-info {
        flex: 1;
      }
      
      .goal-info h4 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 8px;
      }
      
      .goal-description {
        font-size: 1rem;
        color: #6b7280;
        margin: 0;
        line-height: 1.5;
      }
      
      .goal-toggle {
        margin-left: 16px;
      }
      
      .expand-icon {
        display: inline-block;
        font-size: 1rem;
        color: #9ca3af;
        transition: transform 0.2s ease;
      }
      
      .expand-icon.rotated {
        transform: rotate(90deg);
      }
      
      .goal-expanded {
        padding: 0 20px 20px;
        border-top: 1px solid #f3f4f6;
        margin-top: 0;
      }
      
      .goal-benefit {
        background: #fef3c7;
        border: 1px solid #fbbf24;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
        font-size: 0.95rem;
        color: #92400e;
      }
      
      .workflows-section h5 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 16px;
      }
      
      .workflow-item {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
      }
      
      .workflow-item:last-child {
        margin-bottom: 0;
      }
      
      .workflow-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .workflow-header h6 {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }
      
      .workflow-time {
        font-size: 0.875rem;
        color: #6b7280;
        background: #e5e7eb;
        padding: 2px 8px;
        border-radius: 12px;
      }
      
      .workflow-benefit {
        font-size: 0.9rem;
        color: #4b5563;
        margin: 0;
        line-height: 1.4;
      }
      
      .goal-actions {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #f3f4f6;
      }
      
      .try-it-btn {
        background: #10b981;
        color: white;
        border: none;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
        margin-bottom: 12px;
      }
      
      .try-it-btn:hover {
        background: #059669;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      
      .goal-meta {
        text-align: center;
      }
      
      .time-estimate {
        font-size: 0.875rem;
        color: #6b7280;
      }
      
      /* Search Goals Styles */
      .find-more-goals {
        border-top: 2px solid #f3f4f6;
        padding-top: 32px;
      }
      
      .goal-search-input {
        width: 100%;
        padding: 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s ease;
      }
      
      .goal-search-input:focus {
        outline: none;
        border-color: #3b82f6;
      }
      
      .search-results {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-top: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        max-height: 300px;
        overflow-y: auto;
      }
      
      .search-result-item {
        padding: 16px;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      
      .search-result-item:last-child {
        border-bottom: none;
      }
      
      .search-result-item:hover {
        background: #f8fafc;
      }
      
      .search-result-item strong {
        display: block;
        color: #1f2937;
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .search-result-item p {
        color: #6b7280;
        margin: 0;
        font-size: 0.9rem;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .evaluation-content {
          grid-template-columns: 1fr;
          gap: 32px;
        }
        
        .first-steps-card {
          position: static;
        }
        
        .evaluation-header h1 {
          font-size: 2rem;
        }
        
        .goals-section-title {
          font-size: 1.25rem;
          line-height: 1.5;
        }
        
        .anchored-text {
          font-size: 1.25rem;
        }
        
        .selection-option {
          font-size: 1.25rem;
        }
        
        .goal-header {
          padding: 16px;
        }
        
        .goal-expanded {
          padding: 0 16px 16px;
        }
      }
    `,
  ],
})
export class GetStartedComponent {
  private userProfileTestingService = inject(UserProfileTestingService);
  private learningPanelService = inject(LearningPanelService);
  protected companySetupService = inject(CompanySetupService);
  private learningContentService = inject(LearningContentService);
  private dialog = inject(MatDialog);
  
  // Goal-based interface signals  
  protected expandedGoalId = signal<string | null>(null);
  protected searchResults = signal<BusinessGoal[]>([]);
  searchQuery = '';
  
  // Quick start menu signals
  protected selectedQuickAction = signal<string | null>(null);
  
  // Learning Center integration
  readonly quickGuideCategories = this.learningContentService.quickGuideCategories;
  readonly learningTasks = this.learningContentService.tasks;
  readonly learningWorkflows = this.learningContentService.workflows;
  readonly learningGoals = this.learningContentService.goals;
  
  // Business profile selection
  selectedRole = this.getCurrentRole();
  selectedBusinessType = this.getCurrentBusinessType();
  
  // Modal overlay selector states
  showRoleSelector = false;
  showBusinessTypeSelector = false;
  
  // Store anchor position for spatial anchoring
  private anchorPosition = { top: 0, left: 0, width: 0, height: 0 };
  
  // Quick actions from Learning Center Quick Guide Categories
  quickActions = computed(() => {
    const setupCompleted = this.companySetupService.isSetupCompleted();
    const publishedCategories = this.quickGuideCategories().filter(qg => qg.status === 'published');
    
    // Always include company setup as the first action
    const actions = [
      {
        id: 'company-setup',
        title: 'Make your documents look good',
        description: 'Set up your business info to create professional documents',
        icon: 'business',
        iconClass: 'setup-icon',
        completed: setupCompleted,
        enabled: true,
        subActions: [],
        action: () => {
          // Clear any existing selection first, then open modal
          this.selectedQuickAction.set(null);
          this.openCompanySetup();
        }
      },
      // Transform Learning Center Quick Guide Categories into quick actions
      ...publishedCategories.map(category => this.transformCategoryToAction(category, setupCompleted))
    ];
    
    // Add accounting features conditionally
    if (this.shouldShowAccountingFeatures()) {
      actions.push({
        id: 'professional-accounting',
        title: 'Professional accounting',
        description: 'Advanced features for accounting professionals',
        icon: 'calculate',
        iconClass: 'accounting-icon',
        completed: false,
        enabled: setupCompleted,
        subActions: [
        {
          id: 'chart-accounts',
          title: 'Set up chart of accounts',
          description: 'Configure accounting structure and GL codes',
          icon: 'account_tree',
          estimatedTime: '10 min',
          completed: false,
          action: () => this.setupChartOfAccounts()
        },
        {
          id: 'journal-entries',
          title: 'Create journal entries',
          description: 'Record complex accounting transactions',
          icon: 'edit_note',
          estimatedTime: '5 min',
          completed: false,
          action: () => this.createJournalEntries()
        },
        {
          id: 'tax-compliance',
          title: 'Tax compliance',
          description: 'Generate VAT returns and tax reports',
          icon: 'gavel',
          estimatedTime: '8 min',
          completed: false,
          action: () => this.manageTaxCompliance()
        }
        ],
        action: () => this.selectQuickAction('professional-accounting')
      });
    }
    
    return actions;
  });
  
  // Dropdown options with descriptions
  roleOptions = [
    { value: 'owner', label: 'Owner', description: 'Business owner making strategic decisions' },
    { value: 'administrator', label: 'Administrator', description: 'Managing day-to-day operations' },
    { value: 'accountant', label: 'Accountant', description: 'Handling financial records and compliance' },
    { value: 'staff', label: 'Staff', description: 'Team member using the system daily' },
    { value: 'accounting_firm', label: 'Accounting Firm', description: 'Managing multiple client accounts' },
    { value: 'freelancer', label: 'Freelancer', description: 'Independent professional managing projects' }
  ];
  
  businessTypeOptions = [
    { value: 'service', label: 'Service Business', description: 'Providing services to clients' },
    { value: 'product', label: 'Product Business', description: 'Selling physical or digital products' },
    { value: 'mixed', label: 'Mixed Business', description: 'Combination of products and services' },
    { value: 'freelance', label: 'Freelance Business', description: 'Individual contractor or consultant' },
    { value: 'e_commerce', label: 'E-commerce Business', description: 'Online retail and digital sales' },
    { value: 'retail', label: 'Retail Business', description: 'Physical storefront and inventory' },
    { value: 'restaurant', label: 'Restaurant Business', description: 'Food service and hospitality' },
    { value: 'consulting', label: 'Consulting Business', description: 'Expert advice and specialized knowledge' }
  ];
  
  // Learning Center integration methods
  transformCategoryToAction(category: QuickGuideCategory, setupCompleted: boolean) {
    const subActions = this.getSubActionsForCategory(category);
    
    return {
      id: category.id,
      title: category.name,
      description: setupCompleted ? category.subtitle : `Complete setup to unlock ${category.name.toLowerCase()}`,
      icon: category.icon,
      iconClass: this.getIconClassForCategory(category),
      completed: this.isCategoryCompleted(category),
      enabled: setupCompleted,
      subActions: subActions,
      action: () => this.selectQuickAction(category.id)
    };
  }

  getSubActionsForCategory(category: QuickGuideCategory) {
    const subActions: any[] = [];
    
    // Add tasks as sub-actions
    category.assignedTaskIds.forEach(taskId => {
      const task = this.learningTasks().find(t => t.id === taskId && t.status === 'published');
      if (task) {
        subActions.push({
          id: task.id,
          title: task.name,
          description: task.description,
          icon: 'task_alt',
          estimatedTime: `${task.estimatedTime} min`,
          completed: false, // TODO: Track task completion
          action: () => this.startLearningTask(task)
        });
      }
    });
    
    // Add workflows as sub-actions
    category.assignedWorkflowIds.forEach(workflowId => {
      const workflow = this.learningWorkflows().find(w => w.id === workflowId && w.status === 'published');
      if (workflow) {
        subActions.push({
          id: workflow.id,
          title: workflow.name,
          description: workflow.description,
          icon: 'account_tree',
          estimatedTime: `${workflow.estimatedTime} min`,
          completed: false, // TODO: Track workflow completion
          action: () => this.startLearningWorkflow(workflow)
        });
      }
    });
    
    // Add goals as sub-actions
    category.assignedGoalIds.forEach(goalId => {
      const goal = this.learningGoals().find(g => g.id === goalId && g.status === 'published');
      if (goal) {
        subActions.push({
          id: goal.id,
          title: goal.name,
          description: goal.description,
          icon: 'flag',
          estimatedTime: `${goal.estimatedTotalTime} min`,
          completed: false, // TODO: Track goal completion
          action: () => this.startLearningGoal(goal)
        });
      }
    });
    
    return subActions;
  }

  getIconClassForCategory(category: QuickGuideCategory): string {
    // Map Learning Center category types to existing icon classes
    const iconClassMap: { [key: string]: string } = {
      'dashboard': 'setup-icon',
      'point_of_sale': 'sell-icon',
      'phone_android': 'report-icon',
      'shopping_cart': 'buy-icon',
      'receipt_long': 'expense-icon',
      'inventory': 'product-icon',
      'contacts': 'contact-icon',
      'analytics': 'report-icon',
      'calculate': 'accounting-icon'
    };
    
    return iconClassMap[category.icon] || 'setup-icon';
  }

  isCategoryCompleted(category: QuickGuideCategory): boolean {
    // TODO: Implement completion tracking logic
    // This could check if all assigned tasks/workflows/goals are completed
    return false;
  }

  startLearningTask(task: LearningTask): void {
    console.log('🎯 Starting learning task:', task.name);
    // TODO: Integrate with learning panel or task execution system
    alert(`Starting task: ${task.name}\n\n${task.description}\n\nThis would guide you through: ${task.outcome}`);
  }

  startLearningWorkflow(workflow: LearningWorkflow): void {
    console.log('🎯 Starting learning workflow:', workflow.name);
    // TODO: Integrate with learning panel or workflow execution system
    alert(`Starting workflow: ${workflow.name}\n\n${workflow.description}\n\nExpected outcome: ${workflow.outcome}`);
  }

  startLearningGoal(goal: LearningGoal): void {
    console.log('🎯 Starting learning goal:', goal.name);
    // TODO: Integrate with learning panel or goal execution system
    alert(`Starting goal: ${goal.name}\n\n${goal.description}\n\nExpected outcome: ${goal.expectedOutcome}`);
  }


  // Goal-based interface methods
  getCurrentRole(): string {
    const state = this.userProfileTestingService.getCurrentTestingState();
    return state.user_role === 'any' ? 'owner' : state.user_role;
  }
  
  getCurrentBusinessType(): string {
    const state = this.userProfileTestingService.getCurrentTestingState();
    return state.business_type === 'any' ? 'service' : state.business_type;
  }
  
  getRecommendedGoalsForUser(): BusinessGoal[] {
    return getRecommendedGoals(this.selectedRole, this.selectedBusinessType, 3);
  }
  
  // Quick start menu methods
  selectQuickAction(actionId: string): void {
    console.log('🔄 selectQuickAction called:', {
      actionId: actionId,
      currentSelection: this.selectedQuickAction()
    });
    
    if (this.selectedQuickAction() === actionId) {
      // Clicking same action deselects it
      console.log('🔄 Deselecting:', actionId);
      this.selectedQuickAction.set(null);
    } else {
      console.log('📋 Selecting:', actionId);
      this.selectedQuickAction.set(actionId);
    }
    
    console.log('✅ Selection updated. New value:', this.selectedQuickAction());
  }
  
  getSelectedSubActions() {
    const selectedId = this.selectedQuickAction();
    if (!selectedId) return [];
    
    const selectedAction = this.quickActions().find(action => action.id === selectedId);
    return selectedAction?.subActions || [];
  }
  
  shouldShowAccountingFeatures(): boolean {
    const userRole = this.getCurrentRole();
    return userRole === 'accountant' || userRole === 'accounting_firm';
  }
  
  getSelectedActionTitle(): string {
    const selectedId = this.selectedQuickAction();
    if (!selectedId) return '';
    
    const selectedAction = this.quickActions().find(action => action.id === selectedId);
    return selectedAction?.title || '';
  }
  
  executeSubAction(subAction: any): void {
    console.log('🎯 Execute sub-action called:', {
      id: subAction.id,
      title: subAction.title,
      parentSelection: this.selectedQuickAction()
    });
    
    try {
      subAction.action();
      console.log('✅ Sub-action completed:', subAction.title);
    } catch (error) {
      console.error('❌ Sub-action execution failed:', error);
    }
  }
  
  // Debug methods for testing
  debugReloadCompanyData(): void {
    console.log('🔧 Manual reload of company data triggered');
    this.companySetupService.reloadCompanyData();
  }

  debugResetCompletion(): void {
    console.log('🔧 Manual reset of completion state triggered');
    this.companySetupService.forceResetCompletion();
  }
  
  getBusinessTypeDisplay(businessType: string): string {
    const businessTypeMap: Record<string, string> = {
      'service': 'Service Business',
      'product': 'Product Business', 
      'mixed': 'Mixed Business',
      'freelance': 'Freelance Business',
      'e_commerce': 'E-commerce Business',
      'retail': 'Retail Business',
      'restaurant': 'Restaurant Business',
      'consulting': 'Consulting Business'
    };
    return businessTypeMap[businessType] || businessType;
  }
  
  toggleGoal(goalId: string): void {
    if (this.expandedGoalId() === goalId) {
      this.expandedGoalId.set(null);
    } else {
      this.expandedGoalId.set(goalId);
    }
  }
  
  startGoalEvaluation(goal: BusinessGoal): void {
    console.log('🎯 Starting goal evaluation for:', goal.name);
    
    // Start the goal evaluation in the Learning Panel
    this.learningPanelService.startGoalEvaluation(goal);
    
    // Close expanded goal on Get Started page
    this.expandedGoalId.set(null);
  }
  
  onSearchGoals(): void {
    if (this.searchQuery.trim().length > 2) {
      this.searchResults.set(searchGoals(this.searchQuery.trim()));
    } else {
      this.searchResults.set([]);
    }
  }
  
  addGoalFromSearch(goal: BusinessGoal): void {
    console.log('Adding goal from search:', goal.name);
    // Clear search
    this.searchQuery = '';
    this.searchResults.set([]);
    // Expand the selected goal
    this.expandedGoalId.set(goal.id);
  }
  
  onRoleChange(newRole: string): void {
    this.userProfileTestingService.updateField('user_role', newRole);
    this.selectedRole = newRole;
    // Clear expanded goal when profile changes since recommended goals will change
    this.expandedGoalId.set(null);
  }
  
  onBusinessTypeChange(newBusinessType: string): void {
    this.userProfileTestingService.updateField('business_type', newBusinessType);
    this.selectedBusinessType = newBusinessType;
    // Clear expanded goal when profile changes since recommended goals will change
    this.expandedGoalId.set(null);
  }
  
  // Modal overlay selector methods
  openRoleSelector(event: MouseEvent): void {
    this.captureAnchorPosition(event.target as HTMLElement);
    this.showRoleSelector = true;
    this.showBusinessTypeSelector = false;
  }
  
  openBusinessTypeSelector(event: MouseEvent): void {
    this.captureAnchorPosition(event.target as HTMLElement);
    this.showBusinessTypeSelector = true;
    this.showRoleSelector = false;
  }
  
  closeSelectors(): void {
    this.showRoleSelector = false;
    this.showBusinessTypeSelector = false;
  }
  
  selectRole(roleValue: string): void {
    this.onRoleChange(roleValue);
    this.closeSelectors();
  }
  
  selectBusinessType(businessTypeValue: string): void {
    this.onBusinessTypeChange(businessTypeValue);
    this.closeSelectors();
  }
  
  // Capture the position of the clicked element for spatial anchoring
  private captureAnchorPosition(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    this.anchorPosition = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };
  }
  
  // Get styles for the anchored text to maintain spatial position
  getAnchorStyles(): string {
    return `
      position: fixed;
      top: ${this.anchorPosition.top}px;
      left: ${this.anchorPosition.left}px;
      width: ${this.anchorPosition.width}px;
      height: ${this.anchorPosition.height}px;
    `;
  }
  
  // Get styles for the selection options positioned near the anchor
  getOptionsStyles(): string {
    const optionsTop = this.anchorPosition.top + this.anchorPosition.height + 16;
    return `
      top: ${optionsTop}px;
      left: ${this.anchorPosition.left}px;
    `;
  }
  
  // Close selectors with ESC key
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeSelectors();
  }
  
  // Quick action handlers with disabled state check
  executeQuickAction(action: any): void {
    console.log('🎯 Execute action called:', {
      id: action.id,
      title: action.title,
      enabled: action.enabled,
      hasSubActions: action.subActions?.length > 0,
      currentSelection: this.selectedQuickAction()
    });
    
    if (!action.enabled) {
      console.log('❌ Action disabled:', action.title);
      return;
    }
    
    console.log('✅ Executing enabled action:', action.title);
    
    try {
      action.action();
      console.log('✅ Action completed:', action.title);
    } catch (error) {
      console.error('❌ Action failed:', error);
    }
  }

  // Safe method to clear selection state
  clearQuickActionSelection(): void {
    console.log('🔄 Clearing quick action selection');
    this.selectedQuickAction.set(null);
  }

  // Handle quick action clicks with proper event handling
  handleQuickActionClick(event: Event, action: any): void {
    event.stopPropagation();
    
    console.log('🖱️ Quick action click handled:', {
      actionId: action.id,
      currentSelection: this.selectedQuickAction()
    });
    
    this.executeQuickAction(action);
  }

  // Handle sub-action clicks with proper event handling  
  handleSubActionClick(event: Event, subAction: any): void {
    event.stopPropagation();
    
    console.log('🖱️ Sub-action click handled:', {
      subActionId: subAction.id,
      parentSelection: this.selectedQuickAction()
    });
    
    this.executeSubAction(subAction);
  }
  
  createQuote(): void {
    console.log('🧾 Creating quote...');
    // TODO: Navigate to quote creation or show quote modal
    alert('Quote creation feature coming soon! This would take you to create a new quotation.');
  }
  
  createInvoice(): void {
    console.log('💰 Creating invoice...');
    // TODO: Navigate to invoice creation or show invoice modal
    alert('Invoice creation feature coming soon! This would take you to create a new invoice.');
  }
  
  recordExpense(): void {
    console.log('📝 Recording expense...');
    // TODO: Navigate to expense recording or show expense modal
    alert('Expense recording feature coming soon! This would take you to record a business expense.');
  }
  
  // New expanded action handlers
  recordPayment(): void {
    console.log('💰 Recording payment...');
    alert('Payment recording feature coming soon! This would help you mark invoices as paid.');
  }
  
  handleReturns(): void {
    console.log('↩️ Handling returns...');
    alert('Returns handling feature coming soon! This would help you process credit notes and refunds.');
  }
  
  createPurchaseOrder(): void {
    console.log('🛒 Creating purchase order...');
    alert('Purchase order feature coming soon! This would help you order from suppliers.');
  }
  
  receiveGoods(): void {
    console.log('📦 Receiving goods...');
    alert('Goods receipt feature coming soon! This would help you track deliveries.');
  }
  
  processSupplierInvoice(): void {
    console.log('📄 Processing supplier invoice...');
    alert('Supplier invoice feature coming soon! This would help you handle supplier bills.');
  }
  
  submitExpenseClaim(): void {
    console.log('📋 Submitting expense claim...');
    alert('Expense claim feature coming soon! This would help you request reimbursements.');
  }
  
  viewExpenseReports(): void {
    console.log('📊 Viewing expense reports...');
    alert('Expense reports feature coming soon! This would show your spending analysis.');
  }
  
  addProducts(): void {
    console.log('📦 Adding products...');
    alert('Product management feature coming soon! This would help you build your product catalog.');
  }
  
  organizeCategories(): void {
    console.log('🏷️ Organizing categories...');
    alert('Category management feature coming soon! This would help you organize your products.');
  }
  
  trackInventory(): void {
    console.log('📊 Tracking inventory...');
    alert('Inventory tracking feature coming soon! This would help you monitor stock levels.');
  }
  
  addCustomers(): void {
    console.log('👥 Adding customers...');
    alert('Customer management feature coming soon! This would help you build your customer database.');
  }
  
  addSuppliers(): void {
    console.log('🏢 Adding suppliers...');
    alert('Supplier management feature coming soon! This would help you manage vendor relationships.');
  }
  
  organizeRelationships(): void {
    console.log('🤝 Organizing relationships...');
    alert('Contact organization feature coming soon! This would help you categorize business relationships.');
  }
  
  viewProfitLoss(): void {
    console.log('📈 Viewing profit & loss...');
    alert('P&L report feature coming soon! This would show if your business is profitable.');
  }
  
  viewCashFlow(): void {
    console.log('💸 Viewing cash flow...');
    alert('Cash flow report feature coming soon! This would show money in and out of your business.');
  }
  
  viewBalanceSheet(): void {
    console.log('⚖️ Viewing balance sheet...');
    alert('Balance sheet feature coming soon! This would show your business financial position.');
  }
  
  watchReportTutorial(): void {
    console.log('🎬 Watching report tutorial...');
    alert('Report tutorial feature coming soon! This would teach you how to read financial reports.');
  }
  
  setupChartOfAccounts(): void {
    console.log('🌳 Setting up chart of accounts...');
    alert('Chart of accounts feature coming soon! This would help you configure your accounting structure.');
  }
  
  createJournalEntries(): void {
    console.log('📝 Creating journal entries...');
    alert('Journal entries feature coming soon! This would help you record complex transactions.');
  }
  
  manageTaxCompliance(): void {
    console.log('🏛️ Managing tax compliance...');
    alert('Tax compliance feature coming soon! This would help you generate VAT returns and tax reports.');
  }
  
  viewReports(): void {
    console.log('📊 Viewing reports...');
    // This is now handled by selectQuickAction for business-reports
    this.selectQuickAction('business-reports');
  }
  
  openCompanySetup(): void {
    console.log('🏢 Opening company setup modal');
    
    try {
      const dialogRef = this.dialog.open(CompanySetupModalComponent, {
        width: '80vw',
        height: '80vh',
        maxWidth: 'none',
        maxHeight: 'none',
        disableClose: false,
        data: this.companySetupService.companyData() // Pass existing data if available
      });

      dialogRef.afterClosed().subscribe((result: CompanySetupData | undefined) => {
        console.log('📋 Company setup modal closed');
        if (result) {
          this.companySetupService.saveCompanyData(result);
          console.log('✅ Company setup completed and saved:', result);
        } else {
          console.log('❌ Company setup cancelled');
        }
      });
    } catch (error) {
      console.error('❌ Failed to open company setup modal:', error);
    }
  }
} 