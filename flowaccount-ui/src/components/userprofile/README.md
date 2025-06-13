# User Profile Testing Component

This component provides a testing interface for developers to simulate different user profiles and test various user experiences within the FlowAccount application.

## Features

- **Floating Button**: A floating action button positioned at the bottom-right of the screen
- **Visual Indicators**: The button changes color and shows a pulsing indicator when testing is active
- **Test Panel**: A modal panel with form controls to set test criteria
- **Persistent Storage**: Test settings are stored in cookies and persist across browser sessions
- **Global Access**: Utility functions to access test criteria from anywhere in the application

## Usage

### Basic Implementation

The component is already integrated into the app layout (`src/app/layout.tsx`). The floating button will appear on all pages.

### Available Test Criteria

#### 1. User Role

- `"any"` - No specific role restriction
- `"owner"` - Business owner
- `"staff"` - Staff member
- `"accounting"` - Accounting role
- `"firm"` - Accounting firm
- `"freelance"` - Freelancer
- `"accountant"` - Professional accountant
- `"student"` - Student user

#### 2. Package

- `"any"` - No package restriction
- `"free_trial"` - Free trial package
- `"standard"` - Standard package
- `"pro"` - Pro package
- `"pro_business"` - Pro Business package

#### 3. Package Status

- `"any"` - No status restriction
- `"active"` - Active subscription
- `"expired"` - Expired subscription
- `"expiring"` - Subscription expiring soon

#### 4. Payment Frequency

- `"any"` - No frequency restriction
- `"monthly"` - Monthly billing
- `"annual"` - Annual billing

#### 5. Payment Method

- `"any"` - No method restriction
- `"credit_card"` - Credit card payment
- `"bank_transfer"` - Bank transfer payment
- `"qr_code"` - QR code payment

### TypeScript Interface

```typescript
interface UserProfileTestCriteria {
  userRole:
    | "owner"
    | "staff"
    | "accounting"
    | "firm"
    | "freelance"
    | "accountant"
    | "student"
    | "any";
  package: "free_trial" | "standard" | "pro" | "pro_business" | "any";
  packageStatus: "active" | "expired" | "expiring" | "any";
  paymentFrequency: "monthly" | "annual" | "any";
  paymentMethod: "credit_card" | "bank_transfer" | "qr_code" | "any";
}
```

### Using Test Criteria in Your Components

```typescript
import {
  getUserProfileTestCriteria,
  getTestUserRole,
  getTestPackage,
  getTestPackageStatus,
  getTestPaymentFrequency,
  getTestPaymentMethod,
  isTestingEnabled,
  UserProfileTestCriteria,
} from "../../lib/userProfileTest";

// Get all criteria
const testCriteria: UserProfileTestCriteria = getUserProfileTestCriteria();

// Get specific criteria
const userRole = getTestUserRole();
const packageType = getTestPackage();
const packageStatus = getTestPackageStatus();
const paymentFrequency = getTestPaymentFrequency();
const paymentMethod = getTestPaymentMethod();

// Check if testing is active
const isActive = isTestingEnabled();

// Example: Conditional rendering based on test criteria
if (isTestingEnabled() && getTestUserRole() === "owner") {
  // Show owner-specific features
}

if (getTestPackage() === "free_trial") {
  // Show free trial limitations
}

if (getTestPackageStatus() === "expired") {
  // Show renewal prompts
}

if (getTestPaymentMethod() === "qr_code") {
  // Show QR code specific UI
}
```

### Component Structure

- `UserProfileTester.tsx` - Main component that combines button and panel
- `UserProfileTestButton.tsx` - Floating action button
- `UserProfileTestPanel.tsx` - Modal panel with form controls
- `index.ts` - Exports for easy importing
- `userProfileTest.ts` - Utility functions for managing test data

### Utility Functions

#### Core Functions

- `saveUserProfileTestCriteria(criteria: UserProfileTestCriteria): void` - Save test criteria to cookies (30-day expiration)
- `getUserProfileTestCriteria(): UserProfileTestCriteria` - Get current test criteria from cookies or defaults
- `resetUserProfileTestCriteria(): void` - Reset all criteria to "any" (default values)
- `isTestingEnabled(): boolean` - Check if any testing is active (any value is not "any")

#### Getter Functions

- `getTestUserRole(): string` - Get current test user role
- `getTestPackage(): string` - Get current test package
- `getTestPackageStatus(): string` - Get current test package status
- `getTestPaymentFrequency(): string` - Get current test payment frequency
- `getTestPaymentMethod(): string` - Get current test payment method

#### Cookie Management (Internal)

- `setCookie(name: string, value: string, days?: number): void` - Set browser cookie
- `getCookie(name: string): string | null` - Get browser cookie value

#### Constants

- `DEFAULT_CRITERIA: UserProfileTestCriteria` - Default criteria object (all "any")
- `COOKIE_NAME: string` - Cookie name used for storage ("flowaccount-test-profile")

### Visual States

- **Inactive**: Blue button with "Test Profiles" text
- **Active**: Orange button with "Testing Active" text and pulsing red indicator

### Notes

- Test criteria are stored in cookies with a 30-day expiration
- The button checks for updates every 2 seconds to reflect changes from other tabs
- All values default to "Any" when no testing is active
- The component uses Tailwind CSS for styling
- Icons are provided by Lucide React

### Development Tips

1. Use the testing component to quickly switch between different user scenarios
2. Test edge cases by setting specific combinations of criteria
3. Verify that features appear/disappear correctly based on user roles and packages
4. Test payment-related features with different payment methods and frequencies
