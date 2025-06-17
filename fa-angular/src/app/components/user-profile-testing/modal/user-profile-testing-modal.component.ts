import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileTestingService, UserProfileTestingState } from '../../../services/user-profile-testing.service';

@Component({
  selector: 'app-user-profile-testing-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Modal overlay -->
    <div class="modal-overlay" *ngIf="userProfileTestingService.isModalOpen()" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">User Profile Testing</h2>
          <button class="close-button" (click)="closeModal()" aria-label="Close modal">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="user_role">User Role</label>
            <select 
              id="user_role"
              [(ngModel)]="userRole">
              <option 
                *ngFor="let option of userProfileTestingService.dropdownOptions.user_role" 
                [value]="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="package">Package</label>
            <select 
              id="package"
              [(ngModel)]="package">
              <option 
                *ngFor="let option of userProfileTestingService.dropdownOptions.package" 
                [value]="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="package_status">Package Status</label>
            <select 
              id="package_status"
              [(ngModel)]="packageStatus">
              <option 
                *ngFor="let option of userProfileTestingService.dropdownOptions.package_status" 
                [value]="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="payment_frequency">Payment Frequency</label>
            <select 
              id="payment_frequency"
              [(ngModel)]="paymentFrequency">
              <option 
                *ngFor="let option of userProfileTestingService.dropdownOptions.payment_frequency" 
                [value]="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="payment_method">Payment Method</label>
            <select 
              id="payment_method"
              [(ngModel)]="paymentMethod">
              <option 
                *ngFor="let option of userProfileTestingService.dropdownOptions.payment_method" 
                [value]="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="resetToDefaults()">
            Reset to Defaults
          </button>
          <button class="btn btn-warning" (click)="clearCookies()">
            Clear Cookies
          </button>
          <button class="btn btn-info" (click)="debugCookies()">
            Debug
          </button>
          <button class="btn btn-primary" (click)="saveAndClose()">
            Save & Close
          </button>
        </div>
      </div>
    </div>

    <!-- Profile display in bottom right corner -->
    <div class="profile-display">
      <div class="profile-content">
        <div class="profile-line">Role: {{ getDisplayLabel('user_role', userRole) }}</div>
        <div class="profile-line">Package: {{ getDisplayLabel('package', package) }}</div>
        <div class="profile-line">Status: {{ getDisplayLabel('package_status', packageStatus) }}</div>
        <div class="profile-line">Frequency: {{ getDisplayLabel('payment_frequency', paymentFrequency) }}</div>
        <div class="profile-line">Payment: {{ getDisplayLabel('payment_method', paymentMethod) }}</div>
      </div>
    </div>
  `,
  styleUrls: ['./user-profile-testing-modal.component.scss'],
})
export class UserProfileTestingModalComponent {
  constructor(
    public userProfileTestingService: UserProfileTestingService,
    private cdr: ChangeDetectorRef
  ) {}

  currentState() {
    const state = this.userProfileTestingService.testingState();
    console.log('🧪 Modal currentState() called:', state);
    return state;
  }

  // Properties for ngModel binding
  get userRole() {
    const value = this.userProfileTestingService.testingState().user_role;
    console.log('🧪 Modal get userRole:', value);
    return value;
  }
  set userRole(value: string) {
    console.log('🧪 Modal set userRole:', value);
    this.userProfileTestingService.updateField('user_role', value);
    this.cdr.detectChanges();
  }

  get package() {
    const value = this.userProfileTestingService.testingState().package;
    console.log('🧪 Modal get package:', value);
    return value;
  }
  set package(value: string) {
    console.log('🧪 Modal set package:', value);
    this.userProfileTestingService.updateField('package', value);
    this.cdr.detectChanges();
  }

  get packageStatus() {
    const value = this.userProfileTestingService.testingState().package_status;
    console.log('🧪 Modal get packageStatus:', value);
    return value;
  }
  set packageStatus(value: string) {
    console.log('🧪 Modal set packageStatus:', value);
    this.userProfileTestingService.updateField('package_status', value);
    this.cdr.detectChanges();
  }

  get paymentFrequency() {
    const value = this.userProfileTestingService.testingState().payment_frequency;
    console.log('🧪 Modal get paymentFrequency:', value);
    return value;
  }
  set paymentFrequency(value: string) {
    console.log('🧪 Modal set paymentFrequency:', value);
    this.userProfileTestingService.updateField('payment_frequency', value);
    this.cdr.detectChanges();
  }

  get paymentMethod() {
    const value = this.userProfileTestingService.testingState().payment_method;
    console.log('🧪 Modal get paymentMethod:', value);
    return value;
  }
  set paymentMethod(value: string) {
    console.log('🧪 Modal set paymentMethod:', value);
    this.userProfileTestingService.updateField('payment_method', value);
    this.cdr.detectChanges();
  }

  onFieldChange(field: keyof UserProfileTestingState, event: Event) {
    const target = event.target as HTMLSelectElement;
    this.userProfileTestingService.updateField(field, target.value);
  }

  closeModal() {
    this.userProfileTestingService.closeModal();
  }

  resetToDefaults() {
    this.userProfileTestingService.resetToDefaults();
  }

  clearCookies() {
    this.userProfileTestingService.clearCookies();
  }

  saveAndClose() {
    this.userProfileTestingService.saveAndClose();
  }

  debugCookies() {
    this.userProfileTestingService.debugCookies();
  }

  getDisplayLabel(field: keyof UserProfileTestingState, value: string): string {
    const options = this.userProfileTestingService.dropdownOptions[field];
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    if (this.userProfileTestingService.isModalOpen()) {
      this.closeModal();
    }
  }
} 