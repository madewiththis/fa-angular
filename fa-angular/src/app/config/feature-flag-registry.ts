// Feature Flag Registry - Single Source of Truth
// This registry defines all feature flags available in the application
// Easy to configure: just add new entries to the FEATURE_FLAG_REGISTRY array

export interface FeatureFlagCondition {
  cookieField: string;
  operator: 'equals' | 'includes' | 'not_equals';
  value: unknown;
  result: unknown;
}

export interface FeatureFlagDefinition {
  id: string;                    // "4834_checkout_flow_collapse" 
  serial?: number;               // 4834 (for sorting/uniqueness)
  name: string;                  // "Checkout Flow - Collapsed Layout"
  descriptive_id?: string;       // "checkout_flow_collapse" (for readability)
  description: string;
  category: 'ui' | 'behavior' | 'access' | 'flow' | 'integration' | 'experiment';
  defaultValue: boolean | string | number;
  archived: boolean;
  archivedDate?: string;
  createdDate?: string;
  conditions: FeatureFlagCondition[];
  // Optional future fields:
  conflicts?: string[]; // For mutual exclusion if required
}

export interface ManagedFeatureFlagDefinition extends FeatureFlagDefinition {
  serial: number;                // Required for managed flags
  descriptive_id: string;        // Required for managed flags
  createdDate: string;           // Required for managed flags
}

// Feature Flag Registry - All available feature flags
// Start with empty registry - build up using the Feature Flag Management UI
export const FEATURE_FLAG_REGISTRY: FeatureFlagDefinition[] = [
  {
    id: '1000_onboarding_flow_personalized',
    serial: 1000,
    descriptive_id: 'onboarding_flow_personalized',
    name: 'Personalized Onboarding Flow',
    description: 'Shows personalized onboarding questions and recommendations based on user role and business type instead of the standard generic onboarding flow.',
    category: 'flow',
    defaultValue: "",
    archived: true,
    archivedDate: '2025-07-23T10:30:00.000Z',
    createdDate: '2025-07-23T09:20:48.682Z',
    conditions: [
      {
        cookieField: "package",
        operator: "equals",
        value: "free_trial",
        result: "package_freetrial"
      },
      {
        cookieField: "user_role",
        operator: "equals",
        value: "owner",
        result: "role_owner"
      },
      {
        cookieField: "user_role",
        operator: "equals",
        value: "staff",
        result: "role_staff"
      }
    ]
  },
  {
    id: '1001_is_free_trial_user',
    serial: 1001,
    descriptive_id: 'is_free_trial_user',
    name: 'Is Free Trial User',
    description: 'Returns true when user is on a free trial package, enabling personalized onboarding experiences.',
    category: 'access',
    defaultValue: false,
    archived: false,
    createdDate: '2025-07-23T10:30:00.000Z',
    conditions: [
      {
        cookieField: "package",
        operator: "equals",
        value: "free_trial",
        result: true
      }
    ]
  },
  {
    id: '1002_free_trial_user_role',
    serial: 1002,
    descriptive_id: 'free_trial_user_role',
    name: 'Free Trial User Role',
    description: 'Returns the specific role of free trial users to customize their onboarding experience accordingly.',
    category: 'flow',
    defaultValue: "standard",
    archived: false,
    createdDate: '2025-07-23T10:30:00.000Z',
    conditions: [
      {
        cookieField: "user_role",
        operator: "equals",
        value: "owner",
        result: "owner"
      },
      {
        cookieField: "user_role",
        operator: "equals",
        value: "staff",
        result: "staff"
      },
      {
        cookieField: "user_role",
        operator: "equals",
        value: "student",
        result: "student"
      }
    ]
  }
];

// Type helpers for strongly-typed flag results
export type DashboardLayout = 'simplified' | 'standard' | 'advanced';
export type OnboardingFlowType = 'quick' | 'standard' | 'enterprise';
export type PricingEmphasis = 'monthly' | 'annual' | 'enterprise';
export type LandingHeroVariant = 'default' | 'accountant' | 'business_owner' | 'student';
export type TutorialComplexity = 'beginner' | 'intermediate' | 'advanced';
export type CheckoutFlowVariant = 'simplified' | 'standard' | 'bank_focused' | 'enterprise';