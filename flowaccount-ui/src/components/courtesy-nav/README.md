# Courtesy Navigation

A navigation component that appears at the top right of all pages, providing quick access to essential features.

## Components

### CourtesyNav

The main component that wraps all subcomponents and positions them at the top right of the screen.

### CompanyChanger

A searchable dropdown that allows users to select different companies they have access to.

**Features:**

- Searchable company list
- Clean dropdown interface
- Company icons
- Keyboard navigation support

### LanguageChanger

A language selector with English (EN) and Thai (TH) options.

**Features:**

- Flag icons for visual identification
- Current language indicator
- Smooth dropdown animations

### HelpCenterButton

A custom help center button that integrates with the existing help center functionality.

**Features:**

- Matches the styling of other courtesy nav components
- Opens the existing help center panel
- Proper accessibility support

## Usage

The courtesy navigation is automatically included in the app layout and appears on all pages.

```tsx
import CourtesyNav from "@/components/courtesy-nav/CourtesyNav";

// Used in layout.tsx
<CourtesyNav />;
```

## Styling

All components use consistent styling with:

- White backgrounds with subtle borders
- Hover effects for better UX
- Proper focus states for accessibility
- Shadow effects for depth
- Responsive design principles

## Customization

You can pass a `className` prop to the main `CourtesyNav` component to customize positioning or add additional styling.
