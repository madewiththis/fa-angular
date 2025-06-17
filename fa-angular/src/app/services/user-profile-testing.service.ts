import { Injectable, signal } from '@angular/core';

export interface UserProfileTestingState {
  user_role: string;
  package: string;
  package_status: string;
  payment_frequency: string;
  payment_method: string;
}

export interface DropdownOption {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserProfileTestingService {
  // Default state
  private defaultState: UserProfileTestingState = {
    user_role: 'any',
    package: 'any',
    package_status: 'any',
    payment_frequency: 'any',
    payment_method: 'any',
  };

  // Current state signal
  testingState = signal<UserProfileTestingState>({ ...this.defaultState });

  // Modal visibility signal
  isModalOpen = signal(false);

  // Dropdown options
  readonly dropdownOptions = {
    user_role: [
      { value: 'any', label: 'Any' },
      { value: 'owner', label: 'Owner' },
      { value: 'staff', label: 'Staff' },
      { value: 'accounting', label: 'Accounting' },
      { value: 'firm', label: 'Firm' },
      { value: 'freelance_accountant', label: 'Freelance Accountant' },
      { value: 'student', label: 'Student' },
    ],
    package: [
      { value: 'any', label: 'Any' },
      { value: 'free_trial', label: 'Free Trial' },
      { value: 'standard', label: 'Standard' },
      { value: 'pro', label: 'Pro' },
      { value: 'pro_business', label: 'Pro Business' },
    ],
    package_status: [
      { value: 'any', label: 'Any' },
      { value: 'active', label: 'Active' },
      { value: 'expired', label: 'Expired' },
      { value: 'expiring', label: 'Expiring' },
    ],
    payment_frequency: [
      { value: 'any', label: 'Any' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'annual', label: 'Annual' },
    ],
    payment_method: [
      { value: 'any', label: 'Any' },
      { value: 'credit_card', label: 'Credit Card' },
      { value: 'bank_transfer', label: 'Bank Transfer' },
      { value: 'qr_code', label: 'QR Code' },
    ],
  };

  private readonly COOKIE_NAME = 'user_profile_testing_state';
  private readonly COOKIE_EXPIRY_DAYS = 30;

  constructor() {
    // Load saved state from cookies on service initialization
    this.loadStateFromCookies();
    console.log('🧪 User Profile Testing Service initialized');
    this.logCurrentState();
  }

  // Open modal
  openModal() {
    // Reload state from cookies when opening modal to ensure it's current
    this.loadStateFromCookies();
    this.isModalOpen.set(true);
    console.log('🧪 User Profile Testing modal opened');
    this.logCurrentState();
  }

  // Close modal
  closeModal() {
    this.isModalOpen.set(false);
    console.log('🧪 User Profile Testing modal closed');
  }

  // Update a specific field in the testing state
  updateField(field: keyof UserProfileTestingState, value: string) {
    const oldValue = this.testingState()[field];
    this.testingState.update(state => ({
      ...state,
      [field]: value,
    }));
    console.log(`🧪 Field updated: ${field} changed from "${oldValue}" to "${value}"`);
    this.logCurrentState();
  }

  // Reset to defaults
  resetToDefaults() {
    this.testingState.set({ ...this.defaultState });
    console.log('🧪 Testing state reset to defaults');
    this.logCurrentState();
  }

  // Clear cookies (remove from browser cookies)
  clearCookies() {
    this.deleteCookie(this.COOKIE_NAME);
    this.resetToDefaults();
    console.log('🧪 User profile testing cookies cleared');
    this.logCurrentState();
  }

  // Save current state to cookies
  saveState() {
    const currentState = this.testingState();
    const stateJson = JSON.stringify(currentState);
    console.log('🧪 === SAVING STATE TO COOKIES ===');
    console.log('🧪 Current state to save:', currentState);
    console.log('🧪 JSON to save:', stateJson);
    
    this.setCookie(this.COOKIE_NAME, stateJson, this.COOKIE_EXPIRY_DAYS);
    console.log('🧪 Testing state saved to cookies');
    
    // Immediately test if we can read it back
    const readBack = this.getCookie(this.COOKIE_NAME);
    console.log('🧪 Read back immediately:', readBack);
    
    this.logCurrentState();
    console.log('🧪 === END SAVING STATE ===');
  }

  // Load state from cookies
  private loadStateFromCookies() {
    console.log('🧪 === LOADING STATE FROM COOKIES ===');
    const savedState = this.getCookie(this.COOKIE_NAME);
    console.log('🧪 Raw cookie value:', savedState);
    
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        console.log('🧪 Parsed state from cookie:', parsedState);
        
        const newState = { ...this.defaultState, ...parsedState };
        console.log('🧪 Merged state (default + parsed):', newState);
        
        this.testingState.set(newState);
        console.log('🧪 State signal updated to:', this.testingState());
      } catch (error) {
        console.warn('🧪 Failed to parse saved user profile testing state:', error);
        console.log('🧪 Using default state instead');
        this.testingState.set({ ...this.defaultState });
      }
    } else {
      console.log('🧪 No saved testing state found in cookies, using defaults');
      this.testingState.set({ ...this.defaultState });
    }
    console.log('🧪 === END LOADING STATE ===');
  }

  // Save and close modal
  saveAndClose() {
    this.saveState();
    this.closeModal();
    console.log('🧪 Testing state saved and modal closed');
  }

  // Log current state for debugging
  private logCurrentState() {
    const state = this.testingState();
    console.log('🧪 Current User Profile Testing State:', {
      user_role: state.user_role,
      package: state.package,
      package_status: state.package_status,
      payment_frequency: state.payment_frequency,
      payment_method: state.payment_method,
    });
  }

  // Cookie utility methods
  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    document.cookie = cookieString;
    console.log(`🧪 Cookie set: ${name} = ${value}`);
    console.log(`🧪 Full cookie string: ${cookieString}`);
    
    // Verify cookie was set
    const verification = this.getCookie(name);
    console.log(`🧪 Cookie verification: ${verification ? 'SUCCESS' : 'FAILED'}`);
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    console.log(`🧪 All cookies: ${document.cookie}`);
    console.log(`🧪 Looking for cookie: ${name}`);
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(cookie.substring(nameEQ.length));
        console.log(`🧪 Cookie found: ${name} = ${value}`);
        return value;
      }
    }
    console.log(`🧪 Cookie not found: ${name}`);
    return null;
  }

  private deleteCookie(name: string): void {
    // Try multiple deletion methods to ensure it works
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    document.cookie = `${name}=;max-age=0;path=/;`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
    
    console.log(`🧪 Cookie deletion attempted: ${name}`);
    
    // Verify deletion
    const verification = this.getCookie(name);
    console.log(`🧪 Cookie deletion verification: ${verification ? 'FAILED - still exists' : 'SUCCESS - deleted'}`);
  }

  // Public method to get current state for other components
  getCurrentTestingState(): UserProfileTestingState {
    const state = this.testingState();
    console.log('🧪 Testing state requested by external component:', state);
    return state;
  }

  // Debug method to check cookie state
  debugCookies(): void {
    console.log('🧪 === COOKIE DEBUG ===');
    console.log('🧪 Current state:', this.testingState());
    console.log('🧪 All browser cookies:', document.cookie);
    const savedCookie = this.getCookie(this.COOKIE_NAME);
    console.log('🧪 Saved cookie value:', savedCookie);
    if (savedCookie) {
      try {
        const parsed = JSON.parse(savedCookie);
        console.log('🧪 Parsed cookie data:', parsed);
      } catch (e) {
        console.log('🧪 Error parsing cookie:', e);
      }
    }
    console.log('🧪 === END DEBUG ===');
  }

  // Test method to manually set a test state and save it
  testCookieSave(): void {
    console.log('🧪 === TESTING COOKIE SAVE ===');
    const testState: UserProfileTestingState = {
      user_role: 'owner',
      package: 'pro',
      package_status: 'active',
      payment_frequency: 'monthly',
      payment_method: 'credit_card'
    };
    
    console.log('🧪 Setting test state:', testState);
    this.testingState.set(testState);
    
    console.log('🧪 Saving test state...');
    this.saveState();
    
    console.log('🧪 Resetting to defaults...');
    this.testingState.set({ ...this.defaultState });
    
    console.log('🧪 Current state after reset:', this.testingState());
    
    console.log('🧪 Loading from cookies...');
    this.loadStateFromCookies();
    
    console.log('🧪 Final state after load:', this.testingState());
    console.log('🧪 === END TEST ===');
  }
} 