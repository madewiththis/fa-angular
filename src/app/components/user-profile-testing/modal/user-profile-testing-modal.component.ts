import { Component, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileTestingService, UserProfileTestingState } from '../../../services/user-profile-testing.service';
import { FeatureFlagService } from '../../../services/feature-flag.service';

@Component({
  selector: 'app-user-profile-testing-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Modal overlay -->
    <div class="modal-overlay" *ngIf="userProfileTestingService.isModalOpen()" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Feature Flag Testing</h2>
          
          <!-- Tab Navigation -->
          <div class="tab-navigation">
            <button 
              class="tab-button"
              [class.active]="activeTab === 'testing'"
              (click)="setActiveTab('testing')">
              Testing
            </button>
            <button 
              class="tab-button"
              [class.active]="activeTab === 'flags'"
              (click)="setActiveTab('flags')">
              Feature Flags
            </button>
            <button 
              class="tab-button"
              [class.active]="activeTab === 'instructions'"
              (click)="setActiveTab('instructions')"
              [class.has-changes]="hasInstructions()">
              Changes
              <span class="change-count" *ngIf="getInstructionCount() > 0">{{ getInstructionCount() }}</span>
            </button>
          </div>
          
          <button class="close-button" (click)="closeModal()" aria-label="Close modal">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Testing Tab -->
          <div class="tab-content" *ngIf="activeTab === 'testing'">
            <!-- Two-panel layout -->
            <div class="panel-container">
            <!-- Left Panel: Live Feature Flag Status -->
            <div class="left-panel">
              <div class="panel-header">
                <h3>🏁 Active Feature Flags</h3>
                <p class="panel-subtitle">Live status based on current settings</p>
              </div>
              
              <div class="flag-status-container">
                <div *ngFor="let flag of getAllFlags()" 
                     class="flag-card" 
                     [class.flag-default]="flag.isDefault"
                     [class.flag-triggered]="!flag.isDefault">
                  <div class="flag-header">
                    <span class="flag-name">{{ flag.name }}</span>
                    <span class="flag-value" [class.value-default]="flag.isDefault">
                      {{ formatFlagValue(flag.value) }}
                    </span>
                  </div>
                  <div class="flag-description">{{ flag.description }}</div>
                  <div class="flag-explanation" *ngIf="!flag.isDefault">
                    {{ getFlagExplanation(flag.id) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Panel: Cookie Controls -->
            <div class="right-panel">
              <div class="panel-header">
                <h3>⚙️ User Profile Settings</h3>
                <p class="panel-subtitle">Modify to trigger different feature flags</p>
              </div>
              
              <!-- Scenario Management -->
              <div class="scenarios-section">
                <div class="scenarios-header">
                  <h4>Scenarios</h4>
                  <button class="btn-add-scenario" (click)="startCreateScenario()" title="Create new scenario from current settings">
                    <span class="material-icons">add</span>
                  </button>
                </div>
                
                <!-- Create New Scenario Form -->
                <div class="create-scenario-form" *ngIf="isCreatingScenario">
                  <input 
                    type="text" 
                    class="scenario-name-input"
                    [(ngModel)]="newScenarioName"
                    placeholder="Scenario name"
                    (keyup.enter)="createScenario()"
                    (keyup.escape)="cancelCreateScenario()">
                  <input 
                    type="text" 
                    class="scenario-desc-input"
                    [(ngModel)]="newScenarioDescription"
                    placeholder="Description (optional)"
                    (keyup.enter)="createScenario()"
                    (keyup.escape)="cancelCreateScenario()">
                  <div class="scenario-form-actions">
                    <button class="btn-save" (click)="createScenario()">Save</button>
                    <button class="btn-cancel" (click)="cancelCreateScenario()">Cancel</button>
                  </div>
                </div>
                
                <!-- Edit Scenario Form -->
                <div class="edit-scenario-form" *ngIf="isEditingScenario">
                  <h4>Edit Scenario</h4>
                  <input 
                    type="text" 
                    class="scenario-name-input"
                    [(ngModel)]="editScenarioName"
                    placeholder="Scenario name"
                    (keyup.enter)="saveEditedScenario()"
                    (keyup.escape)="cancelEditScenario()">
                  <input 
                    type="text" 
                    class="scenario-desc-input"
                    [(ngModel)]="editScenarioDescription"
                    placeholder="Description (optional)"
                    (keyup.enter)="saveEditedScenario()"
                    (keyup.escape)="cancelEditScenario()">
                  <div class="scenario-form-actions">
                    <button class="btn-save" (click)="saveEditedScenario()">Save Changes</button>
                    <button class="btn-cancel" (click)="cancelEditScenario()">Cancel</button>
                  </div>
                </div>
                
                <!-- Scenario List -->
                <div class="scenario-list">
                  <div 
                    *ngFor="let scenario of getAllScenarios()" 
                    class="scenario-item"
                    [class.scenario-active]="isScenarioActive(scenario)"
                    [class.scenario-custom]="true">
                    
                    <div class="scenario-info" (click)="applyScenario(scenario.id)">
                      <div class="scenario-name">
                        {{ scenario.name }}
                      </div>
                      <div class="scenario-description" *ngIf="scenario.description">
                        {{ scenario.description }}
                      </div>
                    </div>
                    
                    <div class="scenario-actions">
                      <button class="btn-icon" (click)="startEditScenario(scenario)" title="Edit scenario">
                        <span class="material-icons">edit</span>
                      </button>
                      <button class="btn-icon" (click)="deleteScenario(scenario)" title="Delete scenario">
                        <span class="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Manual Controls -->
              <div class="controls-section">
                <div class="form-group">
                  <label for="user_role">User Role</label>
                  <select id="user_role" [(ngModel)]="userRole">
                    <option *ngFor="let option of userProfileTestingService.dropdownOptions.user_role" 
                            [value]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="business_type">Business Type</label>
                  <select id="business_type" [(ngModel)]="businessType">
                    <option *ngFor="let option of userProfileTestingService.dropdownOptions.business_type" 
                            [value]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="package">Package</label>
                  <select id="package" [(ngModel)]="package">
                    <option *ngFor="let option of userProfileTestingService.dropdownOptions.package" 
                            [value]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="package_status">Package Status</label>
                  <select id="package_status" [(ngModel)]="packageStatus">
                    <option *ngFor="let option of userProfileTestingService.dropdownOptions.package_status" 
                            [value]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="payment_frequency">Payment Frequency</label>
                  <select id="payment_frequency" [(ngModel)]="paymentFrequency">
                    <option *ngFor="let option of userProfileTestingService.dropdownOptions.payment_frequency" 
                            [value]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="payment_method">Payment Method</label>
                  <select id="payment_method" [(ngModel)]="paymentMethod">
                    <option *ngFor="let option of userProfileTestingService.dropdownOptions.payment_method" 
                            [value]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            </div>
          </div>

          <!-- Feature Flags Tab -->
          <div class="tab-content" *ngIf="activeTab === 'flags'">
            <div class="flags-tab-container">
              <div class="flags-header">
                <h3>🚩 Feature Flag Management</h3>
                <button class="btn-create-flag" (click)="startCreateFlag()">
                  <span class="material-icons">add</span>
                  Create Flag
                </button>
              </div>

              <!-- Show Archived Toggle -->
              <div class="flags-controls">
                <label class="toggle-archived">
                  <input type="checkbox" [(ngModel)]="showArchivedFlags" (change)="onShowArchivedChange()">
                  Show Archived Flags ({{ getArchivedFlagCount() }})
                </label>
              </div>

              <!-- Create Flag Form -->
              <div class="create-flag-form" *ngIf="isCreatingFlag">
                <h4>Create New Feature Flag</h4>
                
                <div class="form-row">
                  <div class="form-group">
                    <label>Descriptive ID *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="newFlag.descriptive_id"
                      placeholder="e.g., checkout_flow_simplified"
                      (blur)="generateFlagPreview()">
                    <small>Will generate: {{ getNextSerial() }}_{{ newFlag.descriptive_id || 'your_flag_name' }}</small>
                  </div>
                  
                  <div class="form-group">
                    <label>Category *</label>
                    <select [(ngModel)]="newFlag.category">
                      <option value="">Select Category</option>
                      <option value="ui">UI - Interface changes</option>
                      <option value="behavior">Behavior - Logic changes</option>
                      <option value="access">Access - Permission controls</option>
                      <option value="flow">Flow - User journey changes</option>
                      <option value="integration">Integration - External services</option>
                      <option value="experiment">Experiment - A/B testing</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="newFlag.name"
                    placeholder="e.g., Checkout Flow - Simplified Version">
                </div>

                <div class="form-group">
                  <label>Description *</label>
                  <textarea 
                    [(ngModel)]="newFlag.description"
                    placeholder="Describe what this flag controls and when it should be used"
                    rows="2"></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Return Type *</label>
                    <select [(ngModel)]="newFlag.defaultValueType" (change)="onDefaultValueTypeChange()">
                      <option value="">What type of value does this flag return?</option>
                      <option value="boolean">Boolean (true/false)</option>
                      <option value="string">String (text options)</option>
                      <option value="number">Number (numeric values)</option>
                    </select>
                  </div>
                  
                  <div class="form-group" *ngIf="newFlag.defaultValueType">
                    <label>Default Value (when no conditions match)</label>
                    <input 
                      *ngIf="newFlag.defaultValueType === 'boolean'"
                      type="checkbox" 
                      [(ngModel)]="newFlag.defaultValue">
                    <input 
                      *ngIf="newFlag.defaultValueType === 'string'"
                      type="text" 
                      [(ngModel)]="newFlag.defaultValue"
                      placeholder="default">
                    <input 
                      *ngIf="newFlag.defaultValueType === 'number'"
                      type="number" 
                      [(ngModel)]="newFlag.defaultValue"
                      placeholder="0">
                  </div>
                </div>

                <!-- Conditions Builder -->
                <div class="conditions-section">
                  <h5>Conditions</h5>
                  <div class="condition-list">
                    <div 
                      *ngFor="let condition of newFlag.conditions; let i = index" 
                      class="condition-item">
                      
                      <select [(ngModel)]="condition.cookieField" class="condition-field">
                        <option value="">Select Field</option>
                        <option value="user_role">User Role</option>
                        <option value="business_type">Business Type</option>
                        <option value="package">Package</option>
                        <option value="package_status">Package Status</option>
                        <option value="payment_frequency">Payment Frequency</option>
                        <option value="payment_method">Payment Method</option>
                      </select>

                      <select [(ngModel)]="condition.operator" class="condition-operator">
                        <option value="equals">equals</option>
                        <option value="includes">includes</option>
                        <option value="not_equals">not equals</option>
                      </select>

                      <select 
                        [(ngModel)]="condition.value" 
                        class="condition-value">
                        <option value="">Select Value</option>
                        <option 
                          *ngFor="let option of getFieldOptions(condition.cookieField)" 
                          [value]="option.value">
                          {{ option.label }}
                        </option>
                      </select>

                      <input 
                        type="text" 
                        [(ngModel)]="condition.result" 
                        placeholder="Return this value"
                        class="condition-result"
                        title="What value should the flag return when this condition matches?">

                      <button type="button" (click)="removeCondition(i)" class="btn-remove-condition">
                        <span class="material-icons">remove</span>
                      </button>
                    </div>
                  </div>
                  
                  <button type="button" (click)="addCondition()" class="btn-add-condition">
                    <span class="material-icons">add</span>
                    Add Condition
                  </button>
                </div>

                <div class="form-actions">
                  <button type="button" (click)="createFlag()" class="btn-save" [disabled]="!isNewFlagValid()">
                    Create Flag
                  </button>
                  <button type="button" (click)="cancelCreateFlag()" class="btn-cancel">
                    Cancel
                  </button>
                </div>
              </div>

              <!-- Flags List -->
              <div class="flags-list">
                <div 
                  *ngFor="let flag of getDisplayedFlags()" 
                  class="flag-item"
                  [class.flag-archived]="flag.archived">
                  
                  <div class="flag-info" (click)="toggleFlagExpansion(flag.id)">
                    <div class="flag-header">
                      <span class="flag-id">{{ flag.id }}</span>
                      <span class="flag-category">{{ flag.category }}</span>
                      <span class="flag-status" *ngIf="flag.archived">ARCHIVED</span>
                      <span class="expand-icon" [class.expanded]="isFlagExpanded(flag.id)">
                        <span class="material-icons">{{ isFlagExpanded(flag.id) ? 'expand_less' : 'expand_more' }}</span>
                      </span>
                    </div>
                    <div class="flag-name">{{ flag.name }}</div>
                    <div class="flag-description">{{ flag.description }}</div>
                    <div class="flag-meta">
                      Default: {{ flag.defaultValue }} | 
                      Conditions: {{ flag.conditions.length }} |
                      Created: {{ formatDate(flag.createdDate) }}
                      <span *ngIf="flag.archivedDate"> | Archived: {{ formatDate(flag.archivedDate) }}</span>
                    </div>
                    
                    <!-- Expandable conditions section -->
                    <div class="flag-conditions" *ngIf="isFlagExpanded(flag.id) && flag.conditions.length > 0">
                      <h4>Conditions ({{ flag.conditions.length }})</h4>
                      <div class="condition-item" *ngFor="let condition of flag.conditions; let i = index">
                        <div class="condition-logic">
                          <span class="condition-field">{{ condition.cookieField }}</span>
                          <span class="condition-operator">{{ condition.operator }}</span>
                          <span class="condition-value">"{{ condition.value }}"</span>
                          <span class="condition-arrow">→</span>
                          <span class="condition-result">"{{ condition.result }}"</span>
                        </div>
                      </div>
                      <div class="conditions-note">
                        <small><strong>Logic:</strong> Returns the result from the FIRST matching condition, or default value if none match.</small>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flag-actions">
                    <button 
                      *ngIf="!flag.archived" 
                      (click)="archiveFlag(flag.id)" 
                      class="btn-icon btn-archive"
                      title="Archive flag">
                      <span class="material-icons">archive</span>
                    </button>
                    <button 
                      *ngIf="flag.archived" 
                      (click)="unarchiveFlag(flag.id)" 
                      class="btn-icon btn-unarchive"
                      title="Restore flag">
                      <span class="material-icons">unarchive</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Change Instructions Tab -->
          <div class="tab-content" *ngIf="activeTab === 'instructions'">
            <div class="instructions-tab-container">
              <div class="instructions-header">
                <h3>📋 Pending Changes</h3>
                <div class="instructions-actions">
                  <button (click)="exportInstructions()" class="btn-export">
                    <span class="material-icons">download</span>
                    Export Instructions
                  </button>
                  <button (click)="clearInstructions()" class="btn-clear" [disabled]="getInstructionCount() === 0">
                    <span class="material-icons">clear_all</span>
                    Clear All
                  </button>
                </div>
              </div>

              <div class="instructions-content" *ngIf="getInstructionCount() > 0; else noInstructions">
                <div class="instruction-preview">
                  <pre>{{ getInstructionsPreview() }}</pre>
                </div>
              </div>

              <ng-template #noInstructions>
                <div class="no-instructions">
                  <span class="material-icons">check_circle</span>
                  <p>No pending changes</p>
                  <small>Create or modify feature flags to generate change instructions</small>
                </div>
              </ng-template>
            </div>
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

  `,
  styleUrls: ['./user-profile-testing-modal.component.scss'],
})
export class UserProfileTestingModalComponent {
  private featureFlagService = inject(FeatureFlagService);

  constructor(
    public userProfileTestingService: UserProfileTestingService,
    private cdr: ChangeDetectorRef
  ) {}

  currentState() {
    return this.userProfileTestingService.testingState();
  }

  // Properties for ngModel binding
  get userRole() {
    return this.userProfileTestingService.testingState().user_role;
  }
  set userRole(value: string) {
    console.log('🧪 Modal set userRole:', value);
    this.userProfileTestingService.updateField('user_role', value);
    // Removed excessive logging for performance
    this.cdr.detectChanges();
  }

  get businessType() {
    return this.userProfileTestingService.testingState().business_type;
  }
  set businessType(value: string) {
    console.log('🧪 Modal set businessType:', value);
    this.userProfileTestingService.updateField('business_type', value);
    // Removed excessive logging for performance
    this.cdr.detectChanges();
  }

  get package() {
    return this.userProfileTestingService.testingState().package;
  }
  set package(value: string) {
    console.log('🧪 Modal set package:', value);
    this.userProfileTestingService.updateField('package', value);
    // Removed excessive logging for performance
    this.cdr.detectChanges();
  }

  get packageStatus() {
    return this.userProfileTestingService.testingState().package_status;
  }
  set packageStatus(value: string) {
    console.log('🧪 Modal set packageStatus:', value);
    this.userProfileTestingService.updateField('package_status', value);
    // Removed excessive logging for performance
    this.cdr.detectChanges();
  }

  get paymentFrequency() {
    return this.userProfileTestingService.testingState().payment_frequency;
  }
  set paymentFrequency(value: string) {
    console.log('🧪 Modal set paymentFrequency:', value);
    this.userProfileTestingService.updateField('payment_frequency', value);
    // Removed excessive logging for performance
    this.cdr.detectChanges();
  }

  get paymentMethod() {
    return this.userProfileTestingService.testingState().payment_method;
  }
  set paymentMethod(value: string) {
    console.log('🧪 Modal set paymentMethod:', value);
    this.userProfileTestingService.updateField('payment_method', value);
    // Removed excessive logging for performance
    this.cdr.detectChanges();
  }

  onFieldChange(field: keyof UserProfileTestingState, event: Event) {
    const target = event.target as HTMLSelectElement;
    // Only update if it's a dropdown field (not exit survey fields)
    if (['user_role', 'business_type', 'package', 'package_status', 'payment_frequency', 'payment_method'].includes(field)) {
      this.userProfileTestingService.updateField(field as any, target.value);
    }
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

  getDisplayLabel(field: keyof Pick<UserProfileTestingState, 'user_role' | 'business_type' | 'package' | 'package_status' | 'payment_frequency' | 'payment_method'>, value: string): string {
    const options = this.userProfileTestingService.dropdownOptions[field];
    const option = options.find((opt: any) => opt.value === value);
    return option ? option.label : value;
  }

  // New methods for feature flag integration
  getAllFlags() {
    return this.featureFlagService.getAllFlags();
  }

  getFlagExplanation(flagId: string): string {
    const explanation = this.featureFlagService.getFlagExplanation(flagId);
    return explanation.reason;
  }

  formatFlagValue(value: unknown): string {
    if (typeof value === 'boolean') {
      return value ? 'ON' : 'OFF';
    }
    return String(value);
  }

  // Tab Management
  activeTab: 'testing' | 'flags' | 'instructions' = 'testing';
  
  // Scenario Management Properties
  isCreatingScenario = false;
  isEditingScenario = false;
  editingScenarioId: string | null = null;
  newScenarioName = '';
  newScenarioDescription = '';
  editScenarioName = '';
  editScenarioDescription = '';

  // Feature Flag Management Properties
  showArchivedFlags = false;
  isCreatingFlag = false;
  expandedFlags = new Set<string>(); // Track which flags are expanded
  newFlag = {
    descriptive_id: '',
    name: '',
    description: '',
    category: '' as 'ui' | 'behavior' | 'access' | 'flow' | 'integration' | 'experiment' | '',
    defaultValue: false as boolean | string | number,
    defaultValueType: '' as 'boolean' | 'string' | 'number' | '',
    conditions: [] as { cookieField: string; operator: string; value: any; result: any }[]
  };

  // Apply a scenario
  applyScenario(scenarioId: string) {
    this.userProfileTestingService.applyScenario(scenarioId);
    // Removed excessive logging for performance
    this.cdr.detectChanges();
  }

  // Get all scenarios
  getAllScenarios() {
    return this.userProfileTestingService.getAllScenarios();
  }

  // Check if a scenario is currently active
  isScenarioActive(scenario: any): boolean {
    return this.userProfileTestingService.getCurrentScenarioId() === scenario.id;
  }

  // Start creating a new scenario
  startCreateScenario() {
    this.isCreatingScenario = true;
    this.newScenarioName = '';
    this.newScenarioDescription = '';
  }

  // Cancel creating scenario
  cancelCreateScenario() {
    this.isCreatingScenario = false;
    this.newScenarioName = '';
    this.newScenarioDescription = '';
  }

  // Create a new scenario
  createScenario() {
    if (!this.newScenarioName.trim()) {
      alert('Please enter a scenario name');
      return;
    }

    this.userProfileTestingService.createScenario(
      this.newScenarioName.trim(),
      this.newScenarioDescription.trim()
    );

    this.cancelCreateScenario();
    this.cdr.detectChanges();
  }

  // Start editing a scenario
  startEditScenario(scenario: any) {
    this.isEditingScenario = true;
    this.editingScenarioId = scenario.id;
    this.editScenarioName = scenario.name;
    this.editScenarioDescription = scenario.description || '';
  }

  // Cancel editing scenario
  cancelEditScenario() {
    this.isEditingScenario = false;
    this.editingScenarioId = null;
    this.editScenarioName = '';
    this.editScenarioDescription = '';
  }

  // Save edited scenario
  saveEditedScenario() {
    if (!this.editScenarioName.trim()) {
      alert('Please enter a scenario name');
      return;
    }

    this.userProfileTestingService.updateScenario(
      this.editingScenarioId!,
      {
        name: this.editScenarioName.trim(),
        description: this.editScenarioDescription.trim()
      }
    );

    this.cancelEditScenario();
    this.cdr.detectChanges();
  }

  // Delete a scenario
  deleteScenario(scenario: any) {
    if (confirm(`Delete scenario "${scenario.name}"?`)) {
      this.userProfileTestingService.deleteScenario(scenario.id);
      this.cdr.detectChanges();
    }
  }

  // ============= TAB MANAGEMENT =============
  
  setActiveTab(tab: 'testing' | 'flags' | 'instructions') {
    this.activeTab = tab;
  }

  // ============= FEATURE FLAG MANAGEMENT =============

  // Tab helper methods
  hasInstructions(): boolean {
    return this.userProfileTestingService.flagChangeInstructions().length > 0;
  }

  getInstructionCount(): number {
    return this.userProfileTestingService.flagChangeInstructions().length;
  }

  // Archived flags toggle
  getArchivedFlagCount(): number {
    return this.userProfileTestingService.getAllRegistryFlags().filter(f => f.archived).length;
  }

  onShowArchivedChange() {
    // React to checkbox change if needed
  }

  // Flag creation methods
  startCreateFlag() {
    this.isCreatingFlag = true;
    this.resetNewFlag();
  }

  cancelCreateFlag() {
    this.isCreatingFlag = false;
    this.resetNewFlag();
  }

  resetNewFlag() {
    this.newFlag = {
      descriptive_id: '',
      name: '',
      description: '',
      category: '' as 'ui' | 'behavior' | 'access' | 'flow' | 'integration' | 'experiment' | '',
      defaultValue: false,
      defaultValueType: '',
      conditions: []
    };
  }

  generateFlagPreview() {
    // Called when descriptive ID changes - could add validation here
  }

  getNextSerial(): number {
    return this.userProfileTestingService.getNextFlagSerial();
  }

  onDefaultValueTypeChange() {
    // Reset default value when type changes
    switch (this.newFlag.defaultValueType) {
      case 'boolean':
        this.newFlag.defaultValue = false;
        break;
      case 'string':
        this.newFlag.defaultValue = '';
        break;
      case 'number':
        this.newFlag.defaultValue = 0;
        break;
    }
  }

  // Conditions management
  addCondition() {
    this.newFlag.conditions.push({
      cookieField: '',
      operator: 'equals',
      value: '',
      result: ''
    });
  }

  removeCondition(index: number) {
    this.newFlag.conditions.splice(index, 1);
  }

  // Get dropdown options for condition fields
  getFieldOptions(fieldName: string) {
    switch (fieldName) {
      case 'user_role':
        return this.userProfileTestingService.dropdownOptions.user_role;
      case 'business_type':
        return this.userProfileTestingService.dropdownOptions.business_type;
      case 'package':
        return this.userProfileTestingService.dropdownOptions.package;
      case 'package_status':
        return this.userProfileTestingService.dropdownOptions.package_status;
      case 'payment_frequency':
        return this.userProfileTestingService.dropdownOptions.payment_frequency;
      case 'payment_method':
        return this.userProfileTestingService.dropdownOptions.payment_method;
      default:
        return [];
    }
  }

  // Validation
  isNewFlagValid(): boolean {
    return !!(
      this.newFlag.descriptive_id.trim() &&
      this.newFlag.name.trim() &&
      this.newFlag.description.trim() &&
      this.newFlag.category &&
      this.newFlag.defaultValueType
    );
  }

  // Create flag
  createFlag() {
    if (!this.isNewFlagValid()) {
      alert('Please fill in all required fields');
      return;
    }

    this.userProfileTestingService.createManagedFlag(
      this.newFlag.descriptive_id,
      this.newFlag.name,
      this.newFlag.description,
      this.newFlag.category as 'ui' | 'behavior' | 'access' | 'flow' | 'integration' | 'experiment',
      this.newFlag.defaultValue,
      this.newFlag.conditions
    );

    this.cancelCreateFlag();
    this.cdr.detectChanges();
  }

  // Display flags
  getDisplayedFlags() {
    // Get all flags from registry (both managed and registry-defined)
    const allFlags = this.userProfileTestingService.getAllRegistryFlags();
    if (this.showArchivedFlags) {
      return allFlags;
    } else {
      return allFlags.filter(f => !f.archived);
    }
  }

  // Archive/Unarchive
  archiveFlag(id: string) {
    if (confirm('Archive this flag? It will be marked as deprecated but remain in the registry.')) {
      this.userProfileTestingService.archiveManagedFlag(id);
      this.cdr.detectChanges();
    }
  }

  unarchiveFlag(id: string) {
    this.userProfileTestingService.unarchiveManagedFlag(id);
    this.cdr.detectChanges();
  }

  // Utilities
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  // ============= INSTRUCTIONS MANAGEMENT =============

  getInstructionsPreview(): string {
    return this.userProfileTestingService.exportFlagChangeInstructions();
  }

  exportInstructions() {
    const instructions = this.userProfileTestingService.exportFlagChangeInstructions();
    const blob = new Blob([instructions], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feature-flag-changes-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  clearInstructions() {
    if (confirm('Clear all pending change instructions? This cannot be undone.')) {
      this.userProfileTestingService.clearFlagChangeInstructions();
      this.cdr.detectChanges();
    }
  }

  // Flag expansion methods
  toggleFlagExpansion(flagId: string) {
    if (this.expandedFlags.has(flagId)) {
      this.expandedFlags.delete(flagId);
    } else {
      this.expandedFlags.add(flagId);
    }
  }

  isFlagExpanded(flagId: string): boolean {
    return this.expandedFlags.has(flagId);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.userProfileTestingService.isModalOpen()) {
      this.closeModal();
    }
  }
} 