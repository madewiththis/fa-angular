import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CompanySetupModalComponent, CompanySetupData } from './company-setup-modal.component';
import { CompanySetupService } from '../../../services/company-setup.service';

@Component({
  selector: 'app-company-setup-trigger',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="company-setup-trigger">
      <!-- Setup Status Display -->
      <div class="setup-status" *ngIf="companySetupService.isSetupCompleted()">
        <div class="status-header">
          <mat-icon class="check-icon">check_circle</mat-icon>
          <h3>Company Setup Complete</h3>
        </div>
        <p class="company-summary">{{ companySetupService.getCompanySummary() }}</p>
        <button mat-stroked-button (click)="openSetupModal()" class="edit-btn">
          <mat-icon>edit</mat-icon>
          Edit Company Information
        </button>
      </div>

      <!-- Initial Setup Call-to-Action -->
      <div class="setup-cta" *ngIf="!companySetupService.isSetupCompleted()">
        <div class="cta-content">
          <mat-icon class="setup-icon">business</mat-icon>
          <h3>Complete Your Company Setup</h3>
          <p>Set up your business information to customize forms and enable compliance features.</p>
          <button mat-raised-button color="primary" (click)="openSetupModal()" class="setup-btn">
            <mat-icon>settings</mat-icon>
            Start Company Setup
          </button>
        </div>
      </div>

      <!-- Debug Section (for development) -->
      <div class="debug-section" *ngIf="showDebug">
        <h4>Debug Controls</h4>
        <button mat-button (click)="clearSetup()" class="debug-btn">Clear Setup Data</button>
        <button mat-button (click)="toggleDebug()" class="debug-btn">Hide Debug</button>
      </div>
    </div>
  `,
  styles: [`
    .company-setup-trigger {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Setup Status Display */
    .setup-status {
      background: #f0fdf4;
      border: 1px solid #16a34a;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
    }

    .status-header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }

    .check-icon {
      color: #16a34a;
      font-size: 24px;
      margin-right: 8px;
    }

    .status-header h3 {
      margin: 0;
      color: #166534;
      font-weight: 600;
    }

    .company-summary {
      color: #15803d;
      margin: 0 0 20px;
      font-size: 0.95rem;
    }

    .edit-btn {
      color: #16a34a;
      border-color: #16a34a;
    }

    .edit-btn:hover {
      background: #f0fdf4;
    }

    /* Initial Setup CTA */
    .setup-cta {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
    }

    .cta-content {
      max-width: 400px;
      margin: 0 auto;
    }

    .setup-icon {
      color: #d97706;
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .setup-cta h3 {
      margin: 0 0 12px;
      color: #92400e;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .setup-cta p {
      color: #a16207;
      margin: 0 0 24px;
      line-height: 1.5;
    }

    .setup-btn {
      background: #f59e0b;
      color: white;
      padding: 12px 24px;
    }

    .setup-btn:hover {
      background: #d97706;
    }

    /* Debug Section */
    .debug-section {
      margin-top: 32px;
      padding: 16px;
      background: #f3f4f6;
      border-radius: 8px;
      border: 1px dashed #9ca3af;
    }

    .debug-section h4 {
      margin: 0 0 12px;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .debug-btn {
      margin-right: 8px;
      font-size: 0.8rem;
      color: #6b7280;
    }
  `]
})
export class CompanySetupTriggerComponent {
  private dialog = inject(MatDialog);
  protected companySetupService = inject(CompanySetupService);
  
  showDebug = true; // Set to false in production

  openSetupModal(): void {
    const dialogRef = this.dialog.open(CompanySetupModalComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: 'none',
      maxHeight: 'none',
      disableClose: false,
      data: this.companySetupService.companyData() // Pass existing data if available
    });

    dialogRef.afterClosed().subscribe((result: CompanySetupData | undefined) => {
      if (result) {
        this.companySetupService.saveCompanyData(result);
        console.log('Company setup completed:', result);
      }
    });
  }

  clearSetup(): void {
    if (confirm('Are you sure you want to clear all company setup data?')) {
      this.companySetupService.clearCompanyData();
    }
  }

  toggleDebug(): void {
    this.showDebug = !this.showDebug;
  }
}