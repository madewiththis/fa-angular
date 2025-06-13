# Notice Banner System

This component system provides top banners that appear across all pages and push content down.

## Components

### TopBanner (Generic)

A reusable banner component that can be customized for different use cases.

**Props:**

- `children` - Content to display inside the banner
- `bgColor` - Background color class (default: `bg-blue-500`)
- `textColor` - Text color class (default: `text-white`)
- `height` - Height class (default: `h-[100px]`)
- `className` - Additional CSS classes

**Example:**

```tsx
import { TopBanner } from "@/components/notices";

<TopBanner bgColor="bg-red-500" textColor="text-white" height="h-[80px]">
  <p>Custom banner content</p>
</TopBanner>;
```

### FreeTrialBanner (Specific)

A specialized banner that only appears for users with `package: "free_trial"` in their test profile.

**Features:**

- Only visible when test package is set to "free_trial"
- Updates automatically when test profile changes (checks every 2 seconds)
- Can be dismissed by user (stores dismissal in localStorage)
- Responsive design with different text on mobile/desktop
- Upgrade button with action handler
- Purple gradient design with crown icon

**Test Integration:**
The banner uses the user profile testing system to determine visibility:

```tsx
import { getTestPackage } from "@/lib/userProfileTest";

// Banner shows when:
const package_ = getTestPackage();
const shouldShow = package_ === "free_trial";
```

## Integration

The banner system is integrated into the root layout (`src/app/layout.tsx`) and appears above all content:

```tsx
<PasswordProtection>
  <FreeTrialBanner />
  <MenuLayout>{children}</MenuLayout>
  <CourtesyNav />
  <UserProfileTester />
</PasswordProtection>
```

## Creating New Banner Types

To create a new specific banner:

1. Create a new component file in the `notices` folder
2. Import and use the `TopBanner` component as a base
3. Add your custom logic for when to show/hide the banner
4. Export it from `index.ts`
5. Add it to the layout or use conditionally

**Example:**

```tsx
"use client";

import React, { useState, useEffect } from "react";
import TopBanner from "./TopBanner";
import { getTestPackageStatus } from "@/lib/userProfileTest";

export default function ExpiredBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      const status = getTestPackageStatus();
      setIsVisible(status === "expired");
    };

    checkVisibility();
    const interval = setInterval(checkVisibility, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <TopBanner bgColor="bg-red-500" textColor="text-white">
      <p>
        Your subscription has expired. Please renew to continue using
        FlowAccount.
      </p>
    </TopBanner>
  );
}
```

## Styling

All banners use Tailwind CSS classes and are designed to:

- Span the full width of the screen
- Push all content (including sidebars) down by their height
- Maintain consistent 100px height by default
- Be responsive and accessible

## Testing

Use the User Profile Tester component to test different banner visibility:

1. Open the User Profile Test panel (floating blue/orange button)
2. Set Package to "Free Trial" to see the FreeTrialBanner
3. The banner will appear/disappear automatically as you change test settings
4. Test the dismiss functionality and verify it persists across page refreshes
