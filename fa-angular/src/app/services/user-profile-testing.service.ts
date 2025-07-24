import { Injectable, signal, inject } from '@angular/core';
import { FEATURE_FLAG_REGISTRY, FeatureFlagDefinition } from '../config/feature-flag-registry';

export interface UserProfileTestingState {
  user_role: string;
  business_type: string;
  package: string;
  package_status: string;
  payment_frequency: string;
  payment_method: string;
  // User Profile Data from Signup
  email?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  // Exit Survey Data
  exit_survey_reason_id?: string;
  exit_survey_reason_text?: string;
  exit_survey_other_text?: string;
  exit_survey_action?: string;
  exit_survey_timestamp?: string;
  exit_survey_page?: string;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface CustomScenario {
  id: string;
  name: string;
  description?: string;
  config: Partial<UserProfileTestingState>;
  createdAt: string;
}

export interface ManagedFeatureFlag {
  id: string;
  serial: number;
  descriptive_id: string;
  name: string;
  description: string;
  category: 'ui' | 'behavior' | 'access' | 'flow' | 'integration' | 'experiment';
  defaultValue: boolean | string | number;
  archived: boolean;
  archivedDate?: string;
  createdDate: string;
  conditions: { cookieField: string; operator: string; value: any; result: any }[];
}

export interface FlagChangeInstruction {
  type: 'create' | 'update' | 'archive' | 'unarchive';
  flag: ManagedFeatureFlag;
  timestamp: string;
  changes?: Partial<ManagedFeatureFlag>;
}

@Injectable({
  providedIn: 'root',
})
export class UserProfileTestingService {
  // Default state
  private defaultState: UserProfileTestingState = {
    user_role: 'any',
    business_type: 'any',
    package: 'any',
    package_status: 'any',
    payment_frequency: 'any',
    payment_method: 'any',
    // User Profile defaults
    email: 'user@company.com',
    first_name: 'Somchai',
    last_name: 'Superporn',
    company_name: 'Thongchai Sausages',
    // Exit Survey defaults
    exit_survey_reason_id: undefined,
    exit_survey_reason_text: undefined,
    exit_survey_other_text: undefined,
    exit_survey_action: undefined,
    exit_survey_timestamp: undefined,
    exit_survey_page: undefined,
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
      { value: 'accountant', label: 'Accountant' },
      { value: 'staff', label: 'Staff' },
      { value: 'accounting_firm', label: 'Accounting Firm/Freelance Accountant' },
      { value: 'student', label: 'Student' },
    ],
    business_type: [
      { value: 'any', label: 'Any' },
      { value: 'service_business', label: 'Service business' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'ecommerce_seller', label: 'E-Commerce seller on Shopee / Lazada' },
      { value: 'restaurant_cafe', label: 'Restaurant / Cafe' },
      { value: 'merchandising', label: 'Merchandising business' },
      { value: 'hotel_accommodation', label: 'Hotel / Accommodation service' },
      { value: 'import_export', label: 'Import-Export business' },
      { value: 'construction', label: 'Construction' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'property_management', label: 'Property management' },
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
  private readonly SCENARIOS_COOKIE_NAME = 'user_profile_testing_scenarios';
  private readonly COOKIE_EXPIRY_DAYS = 30;

  // Default scenarios that are loaded as editable custom scenarios
  private getDefaultScenarios(): CustomScenario[] {
    return [
      {
        id: 'student-user',
        name: 'Student User',
        description: 'New user learning accounting basics',
        config: {
          user_role: 'student',
          package: 'free_trial'
        },
        createdAt: new Date().toISOString()
      },
      {
        id: 'new-business-owner',
        name: 'New Business Owner',
        description: 'Small business owner getting started',
        config: {
          user_role: 'owner',
          business_type: 'service_business',
          package: 'free_trial'
        },
        createdAt: new Date().toISOString()
      },
      {
        id: 'experienced-accountant',
        name: 'Experienced Accountant',
        description: 'Professional accountant with Pro subscription',
        config: {
          user_role: 'accountant',
          business_type: 'service_business',
          package: 'pro',
          package_status: 'active',
          payment_frequency: 'annual'
        },
        createdAt: new Date().toISOString()
      },
      {
        id: 'enterprise-client',
        name: 'Enterprise Client',
        description: 'Large business with advanced needs',
        config: {
          user_role: 'owner',
          business_type: 'manufacturing',
          package: 'pro_business',
          package_status: 'active'
        },
        createdAt: new Date().toISOString()
      }
    ];
  }

  // Custom scenarios signal
  customScenarios = signal<CustomScenario[]>([]);

  // Managed feature flags signal (separate from registry)
  managedFlags = signal<ManagedFeatureFlag[]>([]);
  
  // Flag change instructions queue
  flagChangeInstructions = signal<FlagChangeInstruction[]>([]);

  constructor() {
    // Load saved state from cookies on service initialization
    this.loadStateFromCookies();
    this.loadScenariosFromCookies();
    this.loadManagedFlagsFromCookies();
    this.loadFlagChangeInstructionsFromCookies();
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

  // Update a specific field in the testing state (only for dropdown fields)
  updateField(field: keyof Pick<UserProfileTestingState, 'user_role' | 'business_type' | 'package' | 'package_status' | 'payment_frequency' | 'payment_method'>, value: string) {
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
    
    // Also clear company setup completion cookie
    this.deleteCookie('flowaccount_setup_completed');
    
    // Clear localStorage data that might affect company setup
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('flowaccount_company_setup');
    }
    
    console.log('🧪 User profile testing cookies cleared (including company setup)');
    this.logCurrentState();
    
    // Force a page reload to ensure all services pick up the cleared state
    setTimeout(() => {
      console.log('🧪 Reloading page to refresh all service states...');
      window.location.reload();
    }, 500);
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

  // Store exit survey response
  storeExitSurveyResponse(reasonData: {
    reasonId: string;
    reason: string;
    otherText: string;
    action: 'confirm' | 'stay';
    page?: string;
  }) {
    console.log('🧪 === STORING EXIT SURVEY RESPONSE ===');
    console.log('🧪 Exit survey data received:', reasonData);
    
    this.testingState.update(state => ({
      ...state,
      exit_survey_reason_id: reasonData.reasonId,
      exit_survey_reason_text: reasonData.reason,
      exit_survey_other_text: reasonData.otherText || undefined,
      exit_survey_action: reasonData.action,
      exit_survey_timestamp: new Date().toISOString(),
      exit_survey_page: reasonData.page || 'checkout',
    }));
    
    // Save the updated state to cookies immediately
    this.saveState();
    
    console.log('🧪 Exit survey response stored and saved to cookies');
    console.log('🧪 === END STORING EXIT SURVEY RESPONSE ===');
  }

  // Get exit survey data
  getExitSurveyData() {
    const state = this.testingState();
    const exitData = {
      reasonId: state.exit_survey_reason_id,
      reason: state.exit_survey_reason_text,
      otherText: state.exit_survey_other_text,
      action: state.exit_survey_action,
      timestamp: state.exit_survey_timestamp,
      page: state.exit_survey_page,
    };
    
    console.log('🧪 Exit survey data requested:', exitData);
    return exitData;
  }

  // Clear exit survey data only
  clearExitSurveyData() {
    console.log('🧪 Clearing exit survey data from user profile testing state');
    
    this.testingState.update(state => ({
      ...state,
      exit_survey_reason_id: undefined,
      exit_survey_reason_text: undefined,
      exit_survey_other_text: undefined,
      exit_survey_action: undefined,
      exit_survey_timestamp: undefined,
      exit_survey_page: undefined,
    }));
    
    this.saveState();
    console.log('🧪 Exit survey data cleared and state saved');
  }

  // Update user profile data from signup
  updateUserProfileData(profileData: {
    email?: string;
    first_name?: string;
    last_name?: string;
    company_name?: string;
    role?: string;
    business_type?: string;
  }) {
    console.log('🧪 === UPDATING USER PROFILE DATA ===');
    console.log('🧪 Profile data received:', profileData);
    
    this.testingState.update(state => ({
      ...state,
      // Update user profile fields
      email: profileData.email || state.email,
      first_name: profileData.first_name || state.first_name,
      last_name: profileData.last_name || state.last_name,
      company_name: profileData.company_name || state.company_name,
      // Update dropdown fields if provided
      user_role: profileData.role || state.user_role,
      business_type: profileData.business_type || state.business_type,
    }));
    
    // Save the updated state to cookies immediately
    this.saveState();
    
    console.log('🧪 User profile data updated and saved to cookies');
    console.log('🧪 === END UPDATING USER PROFILE DATA ===');
  }

  // Get current user profile data in format expected by components
  getUserProfileData() {
    const state = this.testingState();
    return {
      email: state.email,
      first_name: state.first_name,
      last_name: state.last_name,
      company_name: state.company_name,
      role: state.user_role !== 'any' ? state.user_role : undefined,
      business_type: state.business_type !== 'any' ? state.business_type : undefined,
    };
  }

  // Check if user profile data is available (either from testing or real signup)
  hasUserProfileData(): boolean {
    const state = this.testingState();
    const hasTestingData = state.user_role !== 'any' && state.business_type !== 'any';
    const hasBasicData = !!(state.email && state.first_name);
    
    console.log('🧪 Checking user profile data availability:');
    console.log('🧪 - Has testing data:', hasTestingData);
    console.log('🧪 - Has basic data:', hasBasicData);
    console.log('🧪 - Result:', hasTestingData || hasBasicData);
    
    return hasTestingData || hasBasicData;
  }

  // Get role label for display
  getRoleLabel(value?: string): string {
    if (!value || value === 'any') return '';
    const role = this.dropdownOptions.user_role.find(r => r.value === value);
    return role ? role.label : value;
  }

  // Get business type label for display
  getBusinessTypeLabel(value?: string): string {
    if (!value || value === 'any') return '';
    const businessType = this.dropdownOptions.business_type.find(bt => bt.value === value);
    return businessType ? businessType.label : value;
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
      exit_survey: {
        reason_id: state.exit_survey_reason_id,
        reason_text: state.exit_survey_reason_text,
        other_text: state.exit_survey_other_text,
        action: state.exit_survey_action,
        timestamp: state.exit_survey_timestamp,
        page: state.exit_survey_page,
      }
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
    return this.testingState();
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
      business_type: 'service_business',
      package: 'pro',
      package_status: 'active',
      payment_frequency: 'monthly',
      payment_method: 'credit_card',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      company_name: 'Test Company'
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

  // ============= CUSTOM SCENARIO MANAGEMENT =============
  
  // Get all scenarios (now all scenarios are editable custom scenarios)
  getAllScenarios(): CustomScenario[] {
    return this.customScenarios();
  }

  // Load scenarios from cookies
  private loadScenariosFromCookies() {
    console.log('🧪 Loading custom scenarios from cookies');
    const savedScenarios = this.getCookie(this.SCENARIOS_COOKIE_NAME);
    
    if (savedScenarios) {
      try {
        const parsed = JSON.parse(savedScenarios);
        this.customScenarios.set(parsed);
        console.log('🧪 Loaded custom scenarios:', parsed);
      } catch (error) {
        console.warn('🧪 Failed to parse saved scenarios:', error);
        // Load default scenarios on error
        this.customScenarios.set(this.getDefaultScenarios());
      }
    } else {
      console.log('🧪 No saved scenarios found, loading defaults');
      // Load default scenarios if no saved scenarios exist
      this.customScenarios.set(this.getDefaultScenarios());
    }
  }

  // Save scenarios to cookies
  private saveScenariosToCookies() {
    const scenarios = this.customScenarios();
    const json = JSON.stringify(scenarios);
    this.setCookie(this.SCENARIOS_COOKIE_NAME, json, this.COOKIE_EXPIRY_DAYS);
    console.log('🧪 Saved custom scenarios to cookies:', scenarios);
  }

  // Apply a scenario
  applyScenario(scenarioId: string) {
    const scenario = this.getAllScenarios().find(s => s.id === scenarioId);
    if (!scenario) {
      console.warn('🧪 Scenario not found:', scenarioId);
      return;
    }

    console.log('🧪 Applying scenario:', scenario.name);
    
    // Reset to defaults first
    this.resetToDefaults();
    
    // Apply scenario config
    this.testingState.update(state => ({
      ...state,
      ...scenario.config
    }));
    
    this.saveState();
    this.logCurrentState();
  }

  // Create a new custom scenario
  createScenario(name: string, description: string = ''): string {
    const id = `custom-${Date.now()}`;
    const currentState = this.testingState();
    
    // Extract only the dropdown fields for the scenario
    const config: Partial<UserProfileTestingState> = {
      user_role: currentState.user_role !== 'any' ? currentState.user_role : undefined,
      business_type: currentState.business_type !== 'any' ? currentState.business_type : undefined,
      package: currentState.package !== 'any' ? currentState.package : undefined,
      package_status: currentState.package_status !== 'any' ? currentState.package_status : undefined,
      payment_frequency: currentState.payment_frequency !== 'any' ? currentState.payment_frequency : undefined,
      payment_method: currentState.payment_method !== 'any' ? currentState.payment_method : undefined,
    };
    
    // Remove undefined values
    Object.keys(config).forEach(key => {
      if (config[key as keyof UserProfileTestingState] === undefined) {
        delete config[key as keyof UserProfileTestingState];
      }
    });
    
    const newScenario: CustomScenario = {
      id,
      name,
      description,
      config,
      createdAt: new Date().toISOString()
    };
    
    this.customScenarios.update(scenarios => [...scenarios, newScenario]);
    this.saveScenariosToCookies();
    
    console.log('🧪 Created new scenario:', newScenario);
    return id;
  }

  // Update an existing custom scenario
  updateScenario(id: string, updates: { name?: string; description?: string; config?: Partial<UserProfileTestingState> }) {
    const scenarios = this.customScenarios();
    const index = scenarios.findIndex(s => s.id === id);
    
    if (index === -1) {
      console.warn('🧪 Cannot update scenario - not found:', id);
      return;
    }
    
    const updatedScenario = {
      ...scenarios[index],
      ...updates,
      config: updates.config || scenarios[index].config
    };
    
    this.customScenarios.update(scenarios => {
      const newScenarios = [...scenarios];
      newScenarios[index] = updatedScenario;
      return newScenarios;
    });
    
    this.saveScenariosToCookies();
    console.log('🧪 Updated scenario:', updatedScenario);
  }

  // Delete a custom scenario
  deleteScenario(id: string) {
    this.customScenarios.update(scenarios => 
      scenarios.filter(s => s.id !== id)
    );
    this.saveScenariosToCookies();
    console.log('🧪 Deleted scenario:', id);
  }

  // Check if current state matches a scenario
  getCurrentScenarioId(): string | null {
    const currentState = this.testingState();
    const scenarios = this.getAllScenarios();
    
    for (const scenario of scenarios) {
      let matches = true;
      
      for (const [key, value] of Object.entries(scenario.config)) {
        if (currentState[key as keyof UserProfileTestingState] !== value) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        return scenario.id;
      }
    }
    
    return null;
  }

  // ============= FEATURE FLAG MANAGEMENT =============

  // Load managed flags from cookies
  private loadManagedFlagsFromCookies() {
    console.log('🧪 Loading managed flags from cookies');
    const savedFlags = this.getCookie('user_profile_testing_managed_flags');
    
    if (savedFlags) {
      try {
        const parsed = JSON.parse(savedFlags);
        this.managedFlags.set(parsed);
        console.log('🧪 Loaded managed flags:', parsed);
      } catch (error) {
        console.warn('🧪 Failed to parse saved managed flags:', error);
        this.managedFlags.set([]);
      }
    } else {
      console.log('🧪 No saved managed flags found');
      this.managedFlags.set([]);
    }
  }

  // Save managed flags to cookies
  private saveManagedFlagsToCookies() {
    const flags = this.managedFlags();
    const json = JSON.stringify(flags);
    this.setCookie('user_profile_testing_managed_flags', json, this.COOKIE_EXPIRY_DAYS);
    console.log('🧪 Saved managed flags to cookies:', flags);
  }

  // Load flag change instructions from cookies
  private loadFlagChangeInstructionsFromCookies() {
    console.log('🧪 Loading flag change instructions from cookies');
    const savedInstructions = this.getCookie('user_profile_testing_flag_instructions');
    
    if (savedInstructions) {
      try {
        const parsed = JSON.parse(savedInstructions);
        this.flagChangeInstructions.set(parsed);
        console.log('🧪 Loaded flag change instructions:', parsed);
      } catch (error) {
        console.warn('🧪 Failed to parse saved flag change instructions:', error);
        this.flagChangeInstructions.set([]);
      }
    } else {
      console.log('🧪 No saved flag change instructions found');
      this.flagChangeInstructions.set([]);
    }
  }

  // Save flag change instructions to cookies
  private saveFlagChangeInstructionsToCookies() {
    const instructions = this.flagChangeInstructions();
    const json = JSON.stringify(instructions);
    this.setCookie('user_profile_testing_flag_instructions', json, this.COOKIE_EXPIRY_DAYS);
    console.log('🧪 Saved flag change instructions to cookies:', instructions);
  }

  // Get next serial number for flags (ensures uniqueness)
  getNextFlagSerial(): number {
    const currentFlags = this.managedFlags();
    const existingSerials = new Set(currentFlags.map(f => f.serial).filter(s => s !== undefined));
    
    // Start at 1000, increment by 1 until we find an unused serial
    let serial = 1000;
    while (existingSerials.has(serial)) {
      serial++;
    }
    
    console.log('🧪 Generated unique serial:', serial, 'from existing:', Array.from(existingSerials));
    return serial;
  }

  // Create a new managed feature flag
  createManagedFlag(
    descriptiveId: string,
    name: string,
    description: string,
    category: 'ui' | 'behavior' | 'access' | 'flow' | 'integration' | 'experiment',
    defaultValue: boolean | string | number,
    conditions: { cookieField: string; operator: string; value: any; result: any }[]
  ): string {
    const serial = this.getNextFlagSerial();
    const id = `${serial}_${descriptiveId}`;
    const now = new Date().toISOString();
    
    const newFlag: ManagedFeatureFlag = {
      id,
      serial,
      descriptive_id: descriptiveId,
      name,
      description,
      category,
      defaultValue,
      archived: false,
      createdDate: now,
      conditions
    };

    // Add to managed flags
    this.managedFlags.update(flags => [...flags, newFlag]);
    this.saveManagedFlagsToCookies();

    // Create change instruction
    const instruction: FlagChangeInstruction = {
      type: 'create',
      flag: newFlag,
      timestamp: now
    };

    this.flagChangeInstructions.update(instructions => [...instructions, instruction]);
    this.saveFlagChangeInstructionsToCookies();

    console.log('🧪 Created new managed flag:', newFlag);
    console.log('🧪 Added change instruction:', instruction);

    return id;
  }

  // Update a managed feature flag
  updateManagedFlag(id: string, updates: Partial<ManagedFeatureFlag>) {
    const flags = this.managedFlags();
    const index = flags.findIndex(f => f.id === id);
    
    if (index === -1) {
      console.warn('🧪 Cannot update flag - not found:', id);
      return;
    }

    const oldFlag = flags[index];
    const updatedFlag = { ...oldFlag, ...updates };

    this.managedFlags.update(flags => {
      const newFlags = [...flags];
      newFlags[index] = updatedFlag;
      return newFlags;
    });

    this.saveManagedFlagsToCookies();

    // Create change instruction
    const instruction: FlagChangeInstruction = {
      type: 'update',
      flag: updatedFlag,
      timestamp: new Date().toISOString(),
      changes: updates
    };

    this.flagChangeInstructions.update(instructions => [...instructions, instruction]);
    this.saveFlagChangeInstructionsToCookies();

    console.log('🧪 Updated managed flag:', updatedFlag);
    console.log('🧪 Added change instruction:', instruction);
  }

  // Archive a managed feature flag
  archiveManagedFlag(id: string) {
    this.updateManagedFlag(id, {
      archived: true,
      archivedDate: new Date().toISOString()
    });

    // Generate a separate change instruction for archiving
    const flag = this.managedFlags().find(f => f.id === id);
    if (flag) {
      const instruction: FlagChangeInstruction = {
        type: 'archive',
        flag,
        timestamp: new Date().toISOString()
      };

      this.flagChangeInstructions.update(instructions => [...instructions, instruction]);
      this.saveFlagChangeInstructionsToCookies();
    }
  }

  // Unarchive a managed feature flag
  unarchiveManagedFlag(id: string) {
    this.updateManagedFlag(id, {
      archived: false,
      archivedDate: undefined
    });

    // Generate a separate change instruction for unarchiving
    const flag = this.managedFlags().find(f => f.id === id);
    if (flag) {
      const instruction: FlagChangeInstruction = {
        type: 'unarchive',
        flag,
        timestamp: new Date().toISOString()
      };

      this.flagChangeInstructions.update(instructions => [...instructions, instruction]);
      this.saveFlagChangeInstructionsToCookies();
    }
  }

  // Get all managed flags (active + archived)
  getAllManagedFlags(): ManagedFeatureFlag[] {
    return this.managedFlags();
  }

  // Get active managed flags only
  getActiveManagedFlags(): ManagedFeatureFlag[] {
    return this.managedFlags().filter(f => !f.archived);
  }

  // Get archived managed flags only
  getArchivedManagedFlags(): ManagedFeatureFlag[] {
    return this.managedFlags().filter(f => f.archived);
  }

  // Get all flags from registry (includes both managed and registry-defined flags)
  getAllRegistryFlags(): FeatureFlagDefinition[] {
    return FEATURE_FLAG_REGISTRY;
  }

  // Clear all change instructions (after they've been applied)
  clearFlagChangeInstructions() {
    this.flagChangeInstructions.set([]);
    this.saveFlagChangeInstructionsToCookies();
    console.log('🧪 Cleared all flag change instructions');
  }

  // Export change instructions as a formatted document
  exportFlagChangeInstructions(): string {
    const instructions = this.flagChangeInstructions();
    if (instructions.length === 0) {
      return 'No pending flag changes.';
    }

    let output = '# Feature Flag Change Instructions\n\n';
    output += `Generated: ${new Date().toISOString()}\n\n`;

    instructions.forEach((instruction, index) => {
      const { type, flag, timestamp, changes } = instruction;
      
      output += `## ${index + 1}. ${type.toUpperCase()} Flag: '${flag.descriptive_id}'\n`;
      output += `**ID**: ${flag.id}  \n`;
      output += `**Timestamp**: ${timestamp}  \n`;
      output += `**Name**: ${flag.name}  \n`;
      output += `**Description**: ${flag.description}  \n`;
      output += `**Category**: ${flag.category}  \n`;
      output += `**Default Value**: ${JSON.stringify(flag.defaultValue)}  \n`;
      output += `**Archived**: ${flag.archived}  \n`;

      if (type === 'create') {
        output += '\n### Registry Entry to Add:\n';
        output += '```typescript\n';
        output += `{\n`;
        output += `  id: '${flag.id}',\n`;
        output += `  serial: ${flag.serial},\n`;
        output += `  descriptive_id: '${flag.descriptive_id}',\n`;
        output += `  name: '${flag.name}',\n`;
        output += `  description: '${flag.description}',\n`;
        output += `  category: '${flag.category}',\n`;
        output += `  defaultValue: ${JSON.stringify(flag.defaultValue)},\n`;
        output += `  archived: ${flag.archived},\n`;
        output += `  createdDate: '${flag.createdDate}',\n`;
        output += `  conditions: ${JSON.stringify(flag.conditions, null, 4)}\n`;
        output += `}\n`;
        output += '```\n\n';

        output += '### Service Method to Add:\n';
        output += '```typescript\n';
        const methodName = this.generateMethodName(flag.descriptive_id, flag.defaultValue);
        output += `${methodName}(): ${typeof flag.defaultValue} {\n`;
        output += `  return this.getFlag<${typeof flag.defaultValue}>('${flag.id}');\n`;
        output += `}\n`;
        output += '```\n\n';
      }

      if (type === 'update' && changes) {
        output += '\n### Changes to Apply:\n';
        Object.entries(changes).forEach(([key, value]) => {
          output += `- **${key}**: ${JSON.stringify(value)}\n`;
        });
        output += '\n';
      }

      if (type === 'archive') {
        output += '\n### Archive Actions:\n';
        output += '1. Set `archived: true` in registry\n';
        output += '2. Add deprecation warning to service method\n';
        output += '3. Scan codebase for usage and create cleanup task\n\n';
      }

      if (type === 'unarchive') {
        output += '\n### Unarchive Actions:\n';
        output += '1. Set `archived: false` in registry\n';
        output += '2. Remove deprecation warning from service method\n\n';
      }

      output += '---\n\n';
    });

    return output;
  }

  // Helper method to generate service method names
  private generateMethodName(descriptiveId: string, defaultValue: boolean | string | number): string {
    const camelCase = descriptiveId.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    if (typeof defaultValue === 'boolean') {
      return defaultValue ? `is${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}` 
                         : `should${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`;
    } else {
      return `get${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`;
    }
  }
} 