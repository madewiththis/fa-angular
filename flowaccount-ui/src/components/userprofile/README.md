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

1. **User Role**: Owner, Staff, Accounting, Firm, Freelance, Accountant, Student, Any
2. **Package**: Free Trial, Standard, Pro, Pro Business, Any
3. **Package Status**: active, expired, expiring, any
4. **Payment Frequency**: monthly, annual, any
5. **Payment Method**: credit card, bank transfer, qr code, any

### Using Test Criteria in Your Components

```typescript
import {
  getUserProfileTestCriteria,
  getTestUserRole,
  getTestPackage,
  isTestingEnabled,
} from "@/components/userprofile";

// Get all criteria
const testCriteria = getUserProfileTestCriteria();

// Get specific criteria
const userRole = getTestUserRole();
const packageType = getTestPackage();

// Check if testing is active
const isActive = isTestingEnabled();

// Example: Conditional rendering based on test criteria
if (isTestingEnabled() && getTestUserRole() === "Owner") {
  // Show owner-specific features
}

if (getTestPackage() === "Free Trial") {
  // Show free trial limitations
}
```

### Component Structure

- `UserProfileTester.tsx` - Main component that combines button and panel
- `UserProfileTestButton.tsx` - Floating action button
- `UserProfileTestPanel.tsx` - Modal panel with form controls
- `index.ts` - Exports for easy importing
- `userProfileTest.ts` - Utility functions for managing test data

### Utility Functions

- `saveUserProfileTestCriteria(criteria)` - Save test criteria to cookies
- `getUserProfileTestCriteria()` - Get current test criteria
- `resetUserProfileTestCriteria()` - Reset to default values
- `isTestingEnabled()` - Check if any testing is active
- `getTestUserRole()` - Get current test user role
- `getTestPackage()` - Get current test package
- `getTestPackageStatus()` - Get current test package status
- `getTestPaymentFrequency()` - Get current test payment frequency
- `getTestPaymentMethod()` - Get current test payment method

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
