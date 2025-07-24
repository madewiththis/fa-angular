import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuLayoutComponent } from '../../components/layout/menu-layout/menu-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { FeatureFlagService } from '../../services/feature-flag.service';
import { UserProfileTestingService } from '../../services/user-profile-testing.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuLayoutComponent, MatIconModule],
  template: `
    <app-menu-layout>
      <div class="dashboard-container">
        <div class="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        
        <!-- Navigation -->
        <nav class="dashboard-nav">
          <a routerLink="get-started" routerLinkActive="active-link">
            Get Started
          </a>
          
          <a
            routerLink="overview"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <mat-icon>monitoring</mat-icon>Overview
          </a>
          
          <a
            routerLink="accounts-receivable"
            routerLinkActive="active-link"
          >
            <mat-icon>input_circle</mat-icon>Collect Money
          </a>
          <a
            routerLink="accounts-payable"
            routerLinkActive="active-link"
          >
            <mat-icon>output_circle</mat-icon>Pay Bills
          </a>
          

        </nav>
        
        <div class="dashboard-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </app-menu-layout>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 24px;
      }
      .dashboard-header {
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }
      h1 {
        margin: 0;
        color: #1f2937;
      }
      
      .layout-indicator {
        display: flex;
        align-items: center;
      }
      
      .layout-badge {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      
      .layout-badge.layout-simplified {
        background: #dcfce7;
        color: #166534;
      }
      
      .layout-badge.layout-standard {
        background: #e0e7ff;
        color: #3730a3;
      }
      
      .layout-badge.layout-advanced {
        background: #fef3c7;
        color: #92400e;
      }
      .dashboard-nav {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        border-bottom: 1px solid #e5e7eb;
        align-items: center;
      }
      .dashboard-nav a {
        padding: 8px 4px;
        color: #6b7280;
        text-decoration: none;
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .dashboard-nav a.active-link {
        color: #1f2937;
        font-weight: 600;
        border-bottom-color: #3b82f6;
      }
      
      .advanced-feature {
        position: relative;
      }
      
      .advanced-feature::before {
        content: '⭐';
        margin-right: 4px;
        font-size: 0.75rem;
      }
      
      .premium-indicator {
        margin-left: auto;
        display: flex;
        align-items: center;
      }
      
      .premium-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: #fef3c7;
        color: #92400e;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      
      .premium-badge mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
      
      /* Layout-specific navigation styles */
      .nav-simplified {
        opacity: 0.8;
      }
      
      .nav-simplified a {
        font-size: 0.875rem;
      }
      
      .nav-advanced {
        background: linear-gradient(90deg, #f8fafc 0%, #fef7f0 100%);
        padding: 8px;
        border-radius: 8px;
      }
    `,
  ],
})
export class DashboardComponent {
  private userProfileTestingService = inject(UserProfileTestingService);


  isTestingMode(): boolean {
    const state = this.userProfileTestingService.getCurrentTestingState();
    return state.user_role !== 'any' || state.business_type !== 'any' || state.package !== 'any';
  }
}
