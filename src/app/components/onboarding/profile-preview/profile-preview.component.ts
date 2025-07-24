import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileTestingService } from '../../../services/user-profile-testing.service';

@Component({
  selector: 'app-profile-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-preview-container">
      <div class="profile-header">
        <h2>We know a bit about you!</h2>
        <p>Based on your signup, here's what we have. You can update anything that's incorrect before we personalize your onboarding.</p>
      </div>

      <div class="profile-info">
        <div class="info-section">
          <h3>Personal Information</h3>
          <div class="info-row">
            <strong>Name:</strong> {{ getFullName() || 'Not provided' }}
          </div>
          <div class="info-row">
            <strong>Email:</strong> {{ profileData.email || 'Not provided' }}
          </div>
          <div class="info-row">
            <strong>Company:</strong> {{ profileData.company_name || 'Not provided' }}
          </div>
        </div>

        <div class="info-section">
          <h3>Business Profile</h3>
          <div class="form-field">
            <label for="role">Your Role:</label>
            <select id="role" [(ngModel)]="selectedRole" (change)="onRoleChange()">
              <option value="">Select your role</option>
              <option *ngFor="let role of userProfileTestingService.dropdownOptions.user_role.slice(1)" 
                      [value]="role.value">
                {{ role.label }}
              </option>
            </select>
          </div>

          <div class="form-field">
            <label for="businessType">Business Type:</label>
            <select id="businessType" [(ngModel)]="selectedBusinessType" (change)="onBusinessTypeChange()">
              <option value="">Select your business type</option>
              <option *ngFor="let type of userProfileTestingService.dropdownOptions.business_type.slice(1)" 
                      [value]="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="profile-actions">
        <button class="action-button secondary" (click)="skipPersonalization()">
          Skip - Use Default Onboarding
        </button>
        <button 
          class="action-button primary" 
          [disabled]="!canProceed()"
          (click)="proceedWithPersonalization()"
        >
          Continue with Personalized Onboarding
        </button>
      </div>

      <div class="alternative-option" *ngIf="canProceed()">
        <p><strong>Alternative:</strong> Show me onboarding for {{ getRoleLabel() }} in {{ getBusinessTypeLabel() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .profile-preview-container {
      max-width: 700px;
      margin: 0 auto;
      padding: 24px;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .profile-header h2 {
      font-size: 1.75rem;
      font-weight: 600;
      margin: 0 0 12px;
      color: #1a1a1a;
    }

    .profile-header p {
      font-size: 1rem;
      color: #666;
      margin: 0;
      line-height: 1.5;
    }

    .profile-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 32px;
    }

    .info-section {
      background: #f8f9fa;
      border: 1px solid #ddd;
      padding: 24px;
    }

    .info-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 16px;
      color: #1a1a1a;
    }

    .info-row {
      margin-bottom: 12px;
      color: #666;
    }

    .info-row strong {
      color: #1a1a1a;
      margin-right: 8px;
    }

    .form-field {
      margin-bottom: 16px;
    }

    .form-field label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #1a1a1a;
    }

    .form-field select {
      width: 100%;
      padding: 12px;
      border: 2px solid #000;
      background: #fff;
      font-size: 1rem;
      font-weight: 500;
    }

    .form-field select:focus {
      outline: none;
      border-color: #333;
    }

    .profile-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 24px;
    }

    .action-button {
      padding: 12px 24px;
      border: 2px solid #000;
      background: #fff;
      color: #000;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 200px;
    }

    .action-button.primary {
      background: #000;
      color: #fff;
    }

    .action-button.primary:hover:not(:disabled) {
      background: #333;
    }

    .action-button.secondary:hover {
      background: #f5f5f5;
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .alternative-option {
      text-align: center;
      padding: 16px;
      background: #e8f4f8;
      border: 1px solid #b3d9e6;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .profile-preview-container {
        padding: 16px;
      }
      
      .profile-info {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .profile-actions {
        flex-direction: column;
      }
      
      .action-button {
        width: 100%;
      }
    }
  `]
})
export class ProfilePreviewComponent {
  @Output() skipRequested = new EventEmitter<void>();
  @Output() personalizeRequested = new EventEmitter<{role: string, businessType: string}>();

  userProfileTestingService = inject(UserProfileTestingService);
  
  profileData: any = {};
  selectedRole = '';
  selectedBusinessType = '';

  ngOnInit() {
    this.profileData = this.userProfileTestingService.getUserProfileData();
    this.selectedRole = this.profileData.role || '';
    this.selectedBusinessType = this.profileData.business_type || '';
  }

  getFullName(): string {
    const first = this.profileData.first_name || '';
    const last = this.profileData.last_name || '';
    return `${first} ${last}`.trim();
  }

  onRoleChange(): void {
    console.log('Role changed to:', this.selectedRole);
  }

  onBusinessTypeChange(): void {
    console.log('Business type changed to:', this.selectedBusinessType);
  }

  canProceed(): boolean {
    return !!(this.selectedRole && this.selectedBusinessType);
  }

  getRoleLabel(): string {
    return this.userProfileTestingService.getRoleLabel(this.selectedRole);
  }

  getBusinessTypeLabel(): string {
    return this.userProfileTestingService.getBusinessTypeLabel(this.selectedBusinessType);
  }

  skipPersonalization(): void {
    this.skipRequested.emit();
  }

  proceedWithPersonalization(): void {
    if (this.canProceed()) {
      this.personalizeRequested.emit({
        role: this.selectedRole,
        businessType: this.selectedBusinessType
      });
    }
  }
}