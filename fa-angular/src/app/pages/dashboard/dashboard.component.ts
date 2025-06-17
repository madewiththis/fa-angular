import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuLayoutComponent } from '../../components/layout/menu-layout/menu-layout.component';
import { MatIconModule } from '@angular/material/icon';

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
        <nav class="dashboard-nav">
          <a
            routerLink="get-started"
            routerLinkActive="active-link"
            >Get Started</a
          >
          <a
            routerLink="overview"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            ><mat-icon>monitoring</mat-icon>Overview</a
          >
          <a
            routerLink="accounts-receivable"
            routerLinkActive="active-link"
            ><mat-icon>input_circle</mat-icon>Collect Money</a
          >
          <a
            routerLink="accounts-payable"
            routerLinkActive="active-link"
            ><mat-icon>output_circle</mat-icon>Pay Bills</a
          >
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
      }
      h1 {
        margin: 0;
        color: #1f2937;
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
    `,
  ],
})
export class DashboardComponent {}
