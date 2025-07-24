import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileTestingService } from '../../../services/user-profile-testing.service';
import { FeatureFlagService } from '../../../services/feature-flag.service';

@Component({
  selector: 'app-floating-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-button-container">
      <!-- Smart status indicator when testing mode is active -->
      <div class="status-popup" [class.show]="showStatusPopup" *ngIf="isTestingMode()">
        <div class="status-header">
          <span class="status-title">🧪 Testing Mode Active</span>
          <button class="close-popup" (click)="hideStatusPopup()">×</button>
        </div>
        <div class="current-scenario">
          <div class="scenario-badge" [class]="getScenarioClass()">
            {{ getCurrentScenario() }}
          </div>
        </div>
        <div class="cookie-values">
          <div class="cookie-section">
            <h4>Profile</h4>
            <div class="cookie-item">
              <span class="cookie-label">Name:</span>
              <span class="cookie-value">{{ getProfileValue('first_name') }} {{ getProfileValue('last_name') }}</span>
            </div>
            <div class="cookie-item">
              <span class="cookie-label">Email:</span>
              <span class="cookie-value">{{ getProfileValue('email') }}</span>
            </div>
            <div class="cookie-item">
              <span class="cookie-label">Company:</span>
              <span class="cookie-value">{{ getProfileValue('company_name') }}</span>
            </div>
          </div>
          <div class="cookie-section">
            <h4>Settings</h4>
            <div class="cookie-item">
              <span class="cookie-label">Role:</span>
              <span class="cookie-value">{{ getDisplayLabel('user_role', getProfileValue('user_role')) }}</span>
            </div>
            <div class="cookie-item">
              <span class="cookie-label">Business:</span>
              <span class="cookie-value">{{ getDisplayLabel('business_type', getProfileValue('business_type')) }}</span>
            </div>
            <div class="cookie-item">
              <span class="cookie-label">Package:</span>
              <span class="cookie-value">{{ getDisplayLabel('package', getProfileValue('package')) }}</span>
            </div>
            <div class="cookie-item">
              <span class="cookie-label">Status:</span>
              <span class="cookie-value">{{ getDisplayLabel('package_status', getProfileValue('package_status')) }}</span>
            </div>
            <div class="cookie-item">
              <span class="cookie-label">Frequency:</span>
              <span class="cookie-value">{{ getDisplayLabel('payment_frequency', getProfileValue('payment_frequency')) }}</span>
            </div>
            <div class="cookie-item">
              <span class="cookie-label">Payment:</span>
              <span class="cookie-value">{{ getDisplayLabel('payment_method', getProfileValue('payment_method')) }}</span>
            </div>
          </div>
        </div>
        <div class="active-flags">
          <div class="flag-summary" *ngFor="let flag of getActiveFlagsSummary()">
            <span class="flag-name">{{ flag.name }}</span>
            <span class="flag-value">{{ flag.value }}</span>
          </div>
        </div>
        <div class="quick-scenarios">
          <button 
            class="scenario-quick-btn" 
            *ngFor="let scenario of getQuickScenarios()"
            (click)="quickApplyScenario(scenario.id)"
            [title]="scenario.description || scenario.name">
            {{ getShortScenarioName(scenario) }}
          </button>
        </div>
        <div class="popup-actions">
          <button class="open-settings-btn" (click)="openModalFromPopup()">
            <span class="material-icons">settings</span>
            Open Full Settings
          </button>
        </div>
      </div>

      <!-- Main floating button -->
      <button 
        class="floating-button"
        [class.testing-active]="isTestingMode()"
        (click)="toggleButton()"
        [title]="getButtonTitle()"
        [attr.aria-label]="getButtonTitle()">
        <span class="material-icons">{{ getButtonIcon() }}</span>
        <div class="pulse" *ngIf="isTestingMode()"></div>
      </button>

      <!-- Testing mode badge -->
      <div class="testing-badge" *ngIf="isTestingMode()" (click)="toggleStatusPopup()">
        <span class="badge-text">{{ getCurrentScenario() }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./floating-button.component.scss'],
})
export class FloatingButtonComponent {
  private featureFlagService = inject(FeatureFlagService);
  showStatusPopup = false;

  constructor(private userProfileTestingService: UserProfileTestingService) {}

  openModal() {
    this.userProfileTestingService.openModal();
  }

  openModalFromPopup() {
    this.hideStatusPopup();
    this.openModal();
  }

  // Smart button behavior
  toggleButton() {
    if (this.isTestingMode()) {
      this.toggleStatusPopup();
    } else {
      this.openModal();
    }
  }

  toggleStatusPopup() {
    this.showStatusPopup = !this.showStatusPopup;
  }

  hideStatusPopup() {
    this.showStatusPopup = false;
  }

  // Testing mode detection
  isTestingMode(): boolean {
    const state = this.userProfileTestingService.getCurrentTestingState();
    return state.user_role !== 'any' || state.business_type !== 'any' || state.package !== 'any';
  }

  // Dynamic button properties
  getButtonIcon(): string {
    return this.isTestingMode() ? 'bug_report' : 'science';
  }

  getButtonTitle(): string {
    if (this.isTestingMode()) {
      return `Testing Mode: ${this.getCurrentScenario()} - Click for options`;
    }
    return 'Open Feature Flag Testing';
  }

  // Scenario detection and management
  getCurrentScenario(): string {
    const state = this.userProfileTestingService.getCurrentTestingState();
    
    // Detect common scenarios
    if (state.user_role === 'student') return 'Student User';
    if (state.user_role === 'owner' && state.business_type === 'service_business' && state.package === 'free_trial') {
      return 'New Business Owner';
    }
    if (state.user_role === 'accountant' && state.package === 'pro') {
      return 'Experienced Accountant';
    }
    if ((state.business_type === 'manufacturing' || state.package === 'pro_business')) {
      return 'Enterprise Client';
    }
    
    // Generic description
    const parts = [];
    if (state.user_role !== 'any') parts.push(this.userProfileTestingService.getRoleLabel(state.user_role));
    if (state.business_type !== 'any') parts.push(this.userProfileTestingService.getBusinessTypeLabel(state.business_type));
    if (state.package !== 'any') parts.push(state.package.replace('_', ' '));
    
    return parts.length > 0 ? parts.join(' + ') : 'Custom';
  }

  getScenarioClass(): string {
    const scenario = this.getCurrentScenario();
    if (scenario.includes('Student')) return 'scenario-student';
    if (scenario.includes('Owner')) return 'scenario-owner';
    if (scenario.includes('Accountant')) return 'scenario-accountant';
    if (scenario.includes('Enterprise')) return 'scenario-enterprise';
    return 'scenario-custom';
  }

  // Active flags summary for popup
  getActiveFlagsSummary() {
    return this.featureFlagService.getAllFlags()
      .filter(flag => !flag.isDefault)
      .map(flag => ({
        name: flag.name.replace('Dashboard Layout Variant', 'Layout')
                    .replace('Premium Features Visibility', 'Premium')
                    .replace('Onboarding Flow Variant', 'Onboarding'),
        value: this.formatFlagValue(flag.value)
      }))
      .slice(0, 3); // Show max 3 active flags
  }

  private formatFlagValue(value: unknown): string {
    if (typeof value === 'boolean') {
      return value ? 'ON' : 'OFF';
    }
    if (typeof value === 'string') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return String(value);
  }

  // Quick scenario switching
  quickApplyScenario(scenarioId: string) {
    this.hideStatusPopup();
    this.userProfileTestingService.applyScenario(scenarioId);
    // Removed excessive logging for performance
  }

  // Get scenarios for quick access (limit to first 6)
  getQuickScenarios() {
    return this.userProfileTestingService.getAllScenarios().slice(0, 6);
  }

  // Get short name for scenario button
  getShortScenarioName(scenario: any): string {
    // For built-in scenarios, use short names
    const shortNames: Record<string, string> = {
      'student-user': 'Student',
      'new-business-owner': 'Owner',
      'experienced-accountant': 'Accountant',
      'enterprise-client': 'Enterprise'
    };
    
    if (shortNames[scenario.id]) {
      return shortNames[scenario.id];
    }
    
    // For custom scenarios, use first word or truncate
    const name = scenario.name;
    const firstWord = name.split(' ')[0];
    return firstWord.length > 10 ? firstWord.substring(0, 8) + '...' : firstWord;
  }

  // Get profile value from current testing state
  getProfileValue(field: string): string {
    const state = this.userProfileTestingService.getCurrentTestingState();
    return (state as any)[field] || '';
  }

  // Get display label for dropdown values
  getDisplayLabel(field: string, value: string): string {
    const options = (this.userProfileTestingService.dropdownOptions as any)[field];
    if (!options) return value;
    
    const option = options.find((opt: any) => opt.value === value);
    return option ? option.label : value;
  }
} 