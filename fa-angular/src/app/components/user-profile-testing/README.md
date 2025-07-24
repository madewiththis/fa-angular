# 🧪 User Profile Testing System - Complete Guide

## Overview

The FlowAccount prototype features a comprehensive **User Profile Testing System** that enables dynamic UI/UX testing by simulating different user scenarios. This system allows stakeholders to experience different versions of the application by setting user profile conditions that trigger various feature combinations throughout the app.

**Key Concept**: This is one integrated testing system where user profile conditions (stored as cookies) automatically trigger different app behaviors through conditional feature logic. The "feature flags" are simply the mechanism that creates different user experiences - not a separate system.

## System Architecture

This is **one integrated testing system** with these components working together:

```
src/app/components/user-profile-testing/    # 🎯 MAIN SYSTEM
├── modal/                                  # Testing interface & controls
├── floating-button/                        # Status indicator & quick scenarios
├── user-profile-testing.service.ts        # 📊 USER STATE (cookies & scenarios)
└── README.md                              # This documentation

Supporting Infrastructure:
├── services/feature-flag.service.ts       # 🔧 CONDITIONAL LOGIC ENGINE  
└── config/feature-flag-registry.ts        # 📋 BEHAVIOR DEFINITIONS
```

### How It All Works Together

1. **User Profile Testing Service** = Sets the testing scenario (user_role, business_type, package, etc.)
2. **Feature Flag Registry** = Defines what should happen in different scenarios
3. **Feature Flag Service** = Evaluates conditions and returns the appropriate behavior
4. **Components** = Use the results to show different UI/UX variations

**It's one system**: Change user profile → Automatic behavior changes throughout the app

## 🎯 How User Profile Testing Works

### 1. **Set User Scenario**

You define what type of user to simulate using the testing interface:

```typescript
// Example: Simulate a student user
user_role: 'student'
business_type: 'any'
package: 'free_trial'
package_status: 'active'
```

### 2. **Scenario Triggers Behaviors**

The system automatically determines what the user should experience based on predefined rules:

```typescript
// Rule: Students get simplified dashboard
{
  condition: user_role === 'student'
  → result: dashboard_layout = 'simplified'
}

// Rule: Pro users get premium features  
{
  condition: package === 'pro' && package_status === 'active'
  → result: show_premium_features = true
}
```

### 3. **App Adapts Automatically**

Components throughout the app check these conditions and show appropriate UI:

```typescript
// Dashboard adapts to user scenario
@switch (getDashboardLayout()) {
  @case ('simplified') { <app-simple-dashboard /> }    // Student experience
  @case ('advanced') { <app-advanced-dashboard /> }    // Owner experience
  @default { <app-standard-dashboard /> }              // Default experience
}
```

### 4. **Available User Profile Dimensions**

You can mix and match these to create different scenarios:

**Core Profile Fields**:
- **`user_role`**: owner, accountant, staff, student, accounting_firm
- **`business_type`**: service_business, freelance, ecommerce_seller, manufacturing, etc.
- **`package`**: free_trial, standard, pro, pro_business
- **`package_status`**: active, expired, expiring
- **`payment_frequency`**: monthly, annual
- **`payment_method`**: credit_card, bank_transfer, qr_code

**User Information Fields**:
- **`first_name`**: User's first name (default: "Somchai")
- **`last_name`**: User's last name (default: "Superporn")
- **`email`**: User's email address (default: "user@company.com")
- **`company_name`**: Company name (default: "Thongchai Sausages")

**Additional Context Fields**:
- **`exit_survey_reason_id`**: Exit survey tracking for checkout abandonment analysis

## 🎮 Testing Interface

### Three-Tab Modal System

Access via the floating button (🧪 icon) in the bottom-right corner. The modal features three comprehensive tabs:

#### **🧪 Testing Tab - Two-Panel Layout**

**Left Panel: Live Feature Flag Status**
- **Real-time Display**: Shows all active flags with current values
- **Color Coding**: 
  - 🟢 Green: Actively triggered flags
  - ⚪ Gray: Default values
- **Explanations**: "Why is this active?" tooltips showing triggering conditions

**Right Panel: User Profile Controls**
- **Scenario Management**: Create, edit, and delete custom scenarios
- **Quick Scenarios**: One-click persona switching with user-editable presets
- **Manual Controls**: Individual dropdown controls for fine-tuning
- **Auto-save**: Changes persist between sessions

#### **🚩 Feature Flags Tab - Management Interface**

**Flag Creation & Management**:
- **Create New Flags**: Serialized naming system (e.g., `4834_checkout_flow_collapse`)
- **Condition Builder**: Visual interface for flag logic with dropdown values
- **Archive System**: Archive/unarchive flags without deletion
- **Registry Integration**: All flags automatically appear in UI
- **Expandable Details**: Click any flag to see its full condition logic

**Flag Organization**:
- **Category System**: UI, Behavior, Access, Flow, Integration, Experiment
- **Archived Toggle**: Show/hide deprecated flags
- **Type Safety**: Boolean, String, Number return types with proper defaults

#### **📋 Changes Tab - Implementation Instructions**

**Auto-Generated Documentation**:
- **Change Instructions**: Automatically generated implementation guides
- **Export Function**: Download as Markdown for development team
- **Clear Management**: Remove completed instructions
- **Live Preview**: See exactly what needs to be implemented

### Smart Floating Indicator

The floating button transforms based on testing state:

**Inactive Mode** (🧪 gray button):
- Click opens the full testing modal

**Testing Mode** (🐛 orange button with pulse):
- Shows current scenario badge
- Click opens comprehensive status popup with:
  - **Profile Section**: Name, Email, Company information
  - **Settings Section**: Role, Business Type, Package, Status, Payment details
  - **Active Flags**: Summary of triggered behavioral changes
  - **Quick Scenarios**: One-click persona switching
  - **Open Full Settings**: Direct access to complete modal interface

## 📊 Available Behavioral Variations

When you change user profile settings, the app automatically adapts in these ways:

### 1. **Dashboard Layout** (`dashboard_layout`)
- **simplified**: Students get basic interface
- **standard**: Default for most users  
- **advanced**: Owners and accounting firms get full features

### 2. **Premium Features** (`show_premium_features`)
- **true**: Pro/Pro Business with active status
- **false**: Free trial or expired accounts

### 3. **Onboarding Flow** (`onboarding_flow_type`)
- **quick**: Students and freelancers get streamlined setup
- **enterprise**: Manufacturing/import-export get advanced setup
- **standard**: Default comprehensive onboarding

### 4. **Pricing Emphasis** (`pricing_emphasis`)
- **monthly**: Default emphasis
- **annual**: Users with annual payment preference
- **enterprise**: Large businesses and accounting firms

### 5. **Landing Hero Variant** (`landing_hero_variant`)
- **accountant**: Specialized messaging for accounting professionals
- **business_owner**: Owner-focused value proposition
- **student**: Educational/learning focused messaging
- **default**: Generic messaging

### 6. **Tutorial Complexity** (`tutorial_complexity`)
- **beginner**: Students and staff get simple guides
- **intermediate**: Standard complexity
- **advanced**: Accounting firms and pro business users

### 7. **Checkout Flow** (`checkout_flow_variant`)
- **simplified**: Freelancers and students
- **bank_focused**: Users preferring bank transfers
- **enterprise**: Manufacturing and pro business
- **standard**: Default checkout process

### 8. **Advanced Features** (`show_advanced_features`)
- **true**: Accountants, accounting firms, pro users with active status
- **false**: Basic users or expired accounts

## 🎭 Demo Personas

### Quick Scenario Presets

#### **🎓 Student User**
```
user_role: student
business_type: any
package: free_trial
```
**Results**: Simplified dashboard, quick onboarding, beginner tutorials

#### **👔 New Business Owner**  
```
user_role: owner
business_type: service_business  
package: free_trial
```
**Results**: Advanced dashboard, standard onboarding, business-focused messaging

#### **📊 Experienced Accountant**
```
user_role: accountant
business_type: service_business
package: pro
package_status: active
payment_frequency: annual
```
**Results**: Advanced features enabled, annual pricing emphasis, advanced tutorials

#### **🏭 Enterprise Client**
```
user_role: owner
business_type: manufacturing
package: pro_business  
package_status: active
payment_frequency: annual
```
**Results**: Enterprise onboarding, enterprise pricing, all premium features

## 💻 Developer Integration

### Adding User Profile Testing to Components

To make your component respond to different user scenarios:

```typescript
import { Component, inject } from '@angular/core';
import { FeatureFlagService } from '../services/feature-flag.service';

@Component({
  selector: 'app-my-component',
  template: `
    <!-- Conditional features -->
    @if (shouldShowAdvanced()) {
      <app-advanced-features />
    }
    
    <!-- Dynamic layouts -->
    <div [class]="'layout-' + getLayout()">
      Content adapts to user profile
    </div>
    
    <!-- Premium feature gates -->
    @if (hasPremiumAccess()) {
      <app-premium-content />
    } @else {
      <app-upgrade-prompt />
    }
  `
})
export class MyComponent {
  private featureFlags = inject(FeatureFlagService);
  
  shouldShowAdvanced() {
    return this.featureFlags.shouldShowAdvancedFeatures();
  }
  
  getLayout() {
    return this.featureFlags.getDashboardLayout();
  }
  
  hasPremiumAccess() {
    return this.featureFlags.shouldShowPremiumFeatures();
  }
}
```

### Advanced Usage

```typescript
// Get raw flag value with fallback
const customFlag = this.featureFlags.getFlag<string>('my_custom_flag');

// Check all active flags (debugging)
const allFlags = this.featureFlags.getAllFlags();

// Get explanation for flag value
const explanation = this.featureFlags.getFlagExplanation('dashboard_layout');
console.log(explanation.reason); // "Triggered by user_role equals 'student'"
```

## 🚩 Feature Flag Management System

### Overview

The system includes a comprehensive Feature Flag Management interface that allows non-technical users to create, modify, and manage behavioral variations without touching code. This is accessed through the **Feature Flags tab** in the testing modal.

### Creating New Feature Flags

#### **Using the UI Interface (Recommended)**

1. **Open Testing Modal** → **Feature Flags Tab** → **Create Flag**
2. **Fill Required Fields**:
   - **Descriptive ID**: `checkout_flow_simplified` (auto-generates serial like `5001_checkout_flow_simplified`)
   - **Category**: UI, Behavior, Access, Flow, Integration, or Experiment
   - **Name**: Human-readable flag name
   - **Description**: Clear explanation of what this flag controls
   - **Return Type**: Boolean, String, or Number with appropriate default value

3. **Build Conditions**:
   - **Field**: Select from user profile dimensions (user_role, package, etc.)
   - **Operator**: equals, includes, not_equals
   - **Value**: Choose from dropdown (populated from service options)
   - **Result**: What value to return when this condition matches

4. **Save and Test**: Flag immediately becomes available in the Testing tab

#### **Example Flag Creation via UI**
```
Descriptive ID: premium_features_gate
Category: Access
Name: Premium Features Visibility
Description: Controls access to premium features based on subscription status
Return Type: Boolean
Default Value: false

Conditions:
- package equals "pro" → true
- package equals "pro_business" → true
- package_status equals "expired" → false
```

### Flag Management Features

#### **Archive System**
- **Never Delete**: Flags are archived, not deleted, maintaining audit trail
- **Archive/Unarchive**: Toggle flag status without losing configuration
- **Show Archived**: Toggle to view deprecated flags

#### **Expandable Flag Details**
- **Click Any Flag**: Expand to see full condition logic
- **Color-Coded Conditions**: Visual logic display with syntax highlighting
- **Evaluation Order**: Shows how conditions are evaluated (first match wins)

#### **Change Instructions Generation**
- **Auto-Documentation**: System generates implementation instructions for development team
- **Export to Markdown**: Download complete change specifications
- **Clear Tracking**: Mark instructions as completed when implemented

### Advanced Flag Management

#### **Serialized Naming Convention**
All flags use unique serial numbers to prevent naming conflicts:
- Format: `{serial}_{descriptive_id}`
- Example: `1001_dashboard_layout_simplified`
- **Collision Detection**: System prevents duplicate serials
- **Incremental**: Next available serial auto-assigned

#### **Type Safety System**
```typescript
// Boolean flags
getFlag<boolean>('1001_show_premium_features')  // returns true/false

// String flags  
getFlag<string>('1002_dashboard_layout')        // returns 'simplified'|'standard'|'advanced'

// Number flags
getFlag<number>('1003_max_items_display')       // returns numeric value
```

## 🔧 Adding New Behavioral Variations

### 1. Define the New Behavior (Via UI - Recommended)

Use the Feature Flags tab interface as described above.

### 2. Define the New Behavior (Via Code - Advanced)

Add to `FEATURE_FLAG_REGISTRY` in `/src/app/config/feature-flag-registry.ts`:

```typescript
{
  id: 'my_new_flag',
  name: 'My New Feature',
  description: 'Controls visibility of new experimental feature',
  category: 'ui', // optional: 'ui' | 'behavior' | 'access'
  defaultValue: false,
  conditions: [
    { cookieField: 'package', operator: 'equals', value: 'pro', result: true },
    { cookieField: 'user_role', operator: 'equals', value: 'student', result: false }
  ]
}
```

### 2. Add Typed Method (Recommended)

Add to `FeatureFlagService`:

```typescript
shouldShowMyNewFeature(): boolean {
  return this.getFlag<boolean>('my_new_flag');
}
```

### 3. Add Type Definition (For Non-Boolean Flags)

Add to registry file:

```typescript
export type MyNewFlagType = 'option1' | 'option2' | 'option3';
```

### 4. Use in Components

```typescript
@if (featureFlags.shouldShowMyNewFeature()) {
  <app-my-new-feature />
}
```

## 🎨 UI Integration Examples

### Dashboard Component

```typescript
<!-- Dynamic navigation based on user complexity -->
<nav class="dashboard-nav" [class]="'nav-' + getDashboardLayout()">
  <a routerLink="overview">Overview</a>
  
  <!-- Standard and Advanced only -->
  <ng-container *ngIf="getDashboardLayout() !== 'simplified'">
    <a routerLink="accounts-receivable">Collect Money</a>
    <a routerLink="accounts-payable">Pay Bills</a>
  </ng-container>
  
  <!-- Advanced layout with premium features -->
  <ng-container *ngIf="getDashboardLayout() === 'advanced' && shouldShowAdvancedFeatures()">
    <a routerLink="/reports" class="advanced-feature">Advanced Reports</a>
    <a routerLink="/accounting" class="advanced-feature">Accounting</a>
  </ng-container>
</nav>
```

### Onboarding Component

```typescript
<!-- Different flows based on feature flags -->
@switch (getOnboardingFlowType()) {
  @case ('quick') {
    <div class="quick-flow">
      <h2>Welcome! Let's get you started quickly</h2>
      <button (click)="completeQuickFlow()">Start with Basic Setup</button>
    </div>
  }
  
  @case ('enterprise') {
    <div class="enterprise-flow">
      <h2>Enterprise Setup</h2>
      <div class="enterprise-features">
        <div class="feature-item">✓ Advanced reporting setup</div>
        <div class="feature-item">✓ Multi-user permissions</div>
      </div>
    </div>
  }
  
  @default {
    <!-- Standard onboarding flow -->
    <app-standard-onboarding />
  }
}
```

## 🚀 Demo Workflow

### For Stakeholder Presentations

1. **Access Testing Interface**: Click floating 🧪 button
2. **Select Persona**: Choose from quick scenarios or manually configure
3. **Navigate Application**: Experience changes throughout the app
4. **Switch Scenarios**: Use floating button popup for quick changes
5. **Show Flag Status**: Left panel shows exactly what's active and why

### Testing Different User Journeys

```typescript
// Programmatic scenario switching for automated demos
userProfileTesting.updateField('user_role', 'student');
userProfileTesting.updateField('package', 'free_trial');
userProfileTesting.saveState();

// Navigate to see simplified experience
router.navigate(['/dashboard/get-started']);
```

## 📱 Responsive Behavior

The system is fully responsive:
- **Desktop**: Two-panel modal (1200px+ wide)
- **Tablet**: Stacked panels (968px - 1199px)
- **Mobile**: Single column layout (< 968px)
- **Floating Button**: Repositioned for mobile interaction

## 🤖 AI Instance Usage Guide

### How AI Instances Should Use This System

**For Understanding Current State**:
```typescript
// Get current user profile state
const currentState = this.userProfileTestingService.getCurrentTestingState();
console.log('Current user profile:', currentState);

// Get all active feature flags
const activeFlags = this.featureFlagService.getAllFlags();
console.log('Active flags:', activeFlags);

// Check if testing mode is active
const isTestingActive = this.userProfileTestingService.isTestingMode();
```

**For Implementing New Component Behaviors**:
```typescript
// 1. Always inject FeatureFlagService
private featureFlags = inject(FeatureFlagService);

// 2. Use strongly-typed methods (preferred)
get shouldShowAdvanced() {
  return this.featureFlags.shouldShowAdvancedFeatures();
}

// 3. Or use generic getFlag with type safety
get customBehavior() {
  return this.featureFlags.getFlag<string>('my_custom_flag');
}

// 4. Template integration
@if (shouldShowAdvanced) {
  <app-advanced-component />
}
```

**For Creating Test Scenarios**:
```typescript
// Programmatically set test scenarios
this.userProfileTestingService.updateField('user_role', 'student');
this.userProfileTestingService.updateField('package', 'free_trial');
this.userProfileTestingService.saveState();
```

### Determining Current Feature Flag State

**Method 1: Service Inspection**
```typescript
// Get all current flags with status
const flags = this.featureFlagService.getAllFlags();
flags.forEach(flag => {
  console.log(`${flag.id}: ${flag.value} (${flag.isDefault ? 'default' : 'triggered'})`);
});
```

**Method 2: Console Commands**
```javascript
// In browser console
const app = document.querySelector('app-root').__zone_symbol__loadfalse().componentInstance;
const flagService = app.featureFlagService;
flagService.logAllFlags(); // Shows comprehensive flag status
```

**Method 3: UI Inspection**
- Open testing modal → Testing tab → Left panel shows all active flags
- Feature Flags tab → Shows all available flags with expandable details
- Status popup (when testing active) → Shows current behavioral state

### Current System State Files

**Key Files to Check**:
```
/src/app/config/feature-flag-registry.ts          # All available flags
/src/app/services/feature-flag.service.ts         # Flag evaluation logic  
/src/app/services/user-profile-testing.service.ts # Current user state
/src/app/components/dashboard/dashboard.component.ts # Example integration
```

**Available Flags** (as of latest update):
- `1001_is_free_trial_user` - Boolean flag for free trial users
- `1002_free_trial_user_role` - String flag returning user role for free trial users
- Additional flags may be in registry - check Feature Flags tab for complete list

## 🔍 Debugging

### Console Logging

Feature flags automatically log their evaluation:

```
🏁 === CURRENT FEATURE FLAGS ===
🏁 dashboard_layout: "advanced" (triggered) - Triggered by user_role equals "owner"
🏁 show_premium_features: true (triggered) - Triggered by package equals "pro"
🏁 onboarding_flow_type: "standard" (default) - Using default value
🏁 === END FEATURE FLAGS ===
```

### Manual Flag Inspection

```typescript
// In browser console
const flags = document.querySelector('app-root').__zone_symbol__loadfalse()?.componentInstance?.featureFlagService;
flags?.logAllFlags();
flags?.getAllFlags();
```

## 🛡️ Best Practices

### Performance
- Flags are evaluated on-demand, not cached
- Service uses simple condition evaluation (O(n) where n = conditions per flag)
- Cookie operations are optimized for minimal overhead

### Maintainability
- Always use strongly-typed methods over raw `getFlag()` calls
- Document new flags thoroughly in the registry
- Keep condition logic simple and readable
- Use consistent naming conventions (snake_case for IDs, camelCase for methods)

### UX Guidelines
- Provide visual indicators when testing mode is active
- Auto-save user testing state between sessions
- Make scenario switching obvious and easy
- Show clear explanations for flag behavior

## 🔮 Future Enhancements

The system is designed for easy extension:

- **Conflict Resolution**: Mutual exclusion between flags
- **Performance Monitoring**: Track flag evaluation performance
- **A/B Testing Integration**: Connect with Growth Book or similar
- **Advanced Conditions**: Date ranges, percentage rollouts
- **Analytics Integration**: Track flag usage patterns
- **Export/Import**: Save and share testing configurations

---

## Quick Start Checklist

1. ✅ **User Profile Testing System** with 8+ behavioral variations
2. ✅ **Three-Tab Modal Interface** (Testing, Feature Flags, Changes)
3. ✅ **Feature Flag Management UI** with serialized naming and condition builder
4. ✅ **Smart floating indicator** with comprehensive status popup showing all cookie values
5. ✅ **User-editable scenarios** with create, edit, delete functionality
6. ✅ **Archive system** for flag lifecycle management (never delete, only deprecate)
7. ✅ **Auto-generated change instructions** for development team implementation
8. ✅ **Profile data integration** (name, email, company) with sensible defaults
9. ✅ **Dashboard and onboarding** respond dynamically to user profile changes
10. ✅ **Strongly-typed service methods** for safe component integration
11. ✅ **Responsive design** works flawlessly across all devices
12. ✅ **Session persistence** maintains state between demo sessions

**Ready for comprehensive stakeholder demonstrations!** 🎉

The **User Profile Testing System** enables powerful, dynamic prototyping that adapts the entire application experience based on simulated user scenarios. Perfect for showcasing how FlowAccount's new design and functionality will work for different types of users - students, business owners, accountants, and enterprise clients.

---

**Remember**: This is one unified system where user profile conditions automatically trigger appropriate app behaviors throughout the entire prototype. The "feature flags" are just the implementation mechanism - the real power is in **scenario-based user experience testing**.