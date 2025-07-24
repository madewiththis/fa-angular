import { Injectable, inject } from '@angular/core';
import { 
  FEATURE_FLAG_REGISTRY,
  FeatureFlagDefinition,
  FeatureFlagCondition,
  DashboardLayout,
  OnboardingFlowType,
  PricingEmphasis,
  LandingHeroVariant,
  TutorialComplexity,
  CheckoutFlowVariant
} from '../config/feature-flag-registry';
import { UserProfileTestingService, UserProfileTestingState } from './user-profile-testing.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private userProfileTesting = inject(UserProfileTestingService);

  constructor() {
    console.log('🏁 Feature Flag Service initialized with', FEATURE_FLAG_REGISTRY.length, 'flags');
  }

  /**
   * Generic flag evaluation method
   * Falls back to default value if evaluation fails
   */
  getFlag<T>(flagId: string): T {
    try {
      const flagDef = FEATURE_FLAG_REGISTRY.find(f => f.id === flagId);
      if (!flagDef) {
        console.warn(`🏁 Feature flag '${flagId}' not found in registry, using undefined`);
        return undefined as T;
      }

      const currentState = this.userProfileTesting.getCurrentTestingState();
      const result = this.evaluateConditions(flagDef, currentState);
      
      console.log(`🏁 Flag evaluated: ${flagId} = ${JSON.stringify(result)}`);
      return result as T;
    } catch (error) {
      console.warn(`🏁 Feature flag '${flagId}' evaluation failed, using default:`, error);
      return this.getDefaultValue(flagId) as T;
    }
  }

  /**
   * Strongly typed convenience methods for easy component usage
   */
  
  // Archived - use the new focused flags instead
  getOnboardingFlowPersonalized(): string {
    return this.getFlag<string>('1000_onboarding_flow_personalized');
  }
  
  // New focused flags for better logic
  isFreeTrialUser(): boolean {
    return this.getFlag<boolean>('1001_is_free_trial_user');
  }
  
  getFreeTrialUserRole(): string {
    return this.getFlag<string>('1002_free_trial_user_role');
  }

  /**
   * Get all active flags with their current values
   * Useful for debugging and UI display
   */
  getAllFlags(): Array<{id: string, name: string, description: string, value: unknown, isDefault: boolean}> {
    return FEATURE_FLAG_REGISTRY.map(flagDef => {
      const currentValue = this.evaluateConditions(flagDef, this.userProfileTesting.getCurrentTestingState());
      const isDefault = currentValue === flagDef.defaultValue;
      
      return {
        id: flagDef.id,
        name: flagDef.name,
        description: flagDef.description,
        value: currentValue,
        isDefault
      };
    });
  }

  /**
   * Get flags organized by category for UI display
   */
  getFlagsByCategory(): Record<string, Array<{id: string, name: string, description: string, value: unknown, isDefault: boolean}>> {
    const flags = this.getAllFlags();
    const flagDefinitions = FEATURE_FLAG_REGISTRY;
    
    const categorized: Record<string, Array<{id: string, name: string, description: string, value: unknown, isDefault: boolean}>> = {};
    
    flags.forEach(flag => {
      const definition = flagDefinitions.find(def => def.id === flag.id);
      const category = definition?.category || 'other';
      
      if (!categorized[category]) {
        categorized[category] = [];
      }
      
      categorized[category].push(flag);
    });
    
    return categorized;
  }

  /**
   * Get explanation of why a flag has its current value
   */
  getFlagExplanation(flagId: string): { value: unknown, reason: string, triggeredBy?: FeatureFlagCondition } {
    const flagDef = FEATURE_FLAG_REGISTRY.find(f => f.id === flagId);
    if (!flagDef) {
      return { value: undefined, reason: 'Flag not found in registry' };
    }

    const currentState = this.userProfileTesting.getCurrentTestingState();
    
    // Check each condition to see which one triggered (if any)
    for (const condition of flagDef.conditions) {
      if (this.evaluateCondition(condition, currentState)) {
        return {
          value: condition.result,
          reason: `Triggered by ${condition.cookieField} ${condition.operator} "${condition.value}"`,
          triggeredBy: condition
        };
      }
    }

    return {
      value: flagDef.defaultValue,
      reason: 'Using default value (no conditions matched)',
    };
  }

  /**
   * Private: Evaluate all conditions for a flag
   */
  private evaluateConditions(flagDef: FeatureFlagDefinition, state: UserProfileTestingState): unknown {
    // Check each condition in order - first match wins
    for (const condition of flagDef.conditions) {
      if (this.evaluateCondition(condition, state)) {
        return condition.result;
      }
    }

    // No conditions matched, return default
    return flagDef.defaultValue;
  }

  /**
   * Private: Evaluate a single condition
   */
  private evaluateCondition(condition: FeatureFlagCondition, state: UserProfileTestingState): boolean {
    const fieldValue = (state as any)[condition.cookieField];
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      
      case 'not_equals':
        return fieldValue !== condition.value;
      
      case 'includes':
        if (typeof fieldValue === 'string' && typeof condition.value === 'string') {
          return fieldValue.includes(condition.value);
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(condition.value);
        }
        return false;
      
      default:
        console.warn(`🏁 Unknown operator: ${condition.operator}`);
        return false;
    }
  }

  /**
   * Private: Get default value for a flag
   */
  private getDefaultValue(flagId: string): unknown {
    const flagDef = FEATURE_FLAG_REGISTRY.find(f => f.id === flagId);
    return flagDef?.defaultValue;
  }

  /**
   * Debug method to log all current flag values
   */
  logAllFlags(): void {
    console.log('🏁 === CURRENT FEATURE FLAGS ===');
    const currentState = this.userProfileTesting.getCurrentTestingState();
    console.log('🏁 Current testing state:', {
      user_role: currentState.user_role,
      business_type: currentState.business_type,
      package: currentState.package,
      package_status: currentState.package_status,
      payment_frequency: currentState.payment_frequency,
      payment_method: currentState.payment_method
    });

    const flags = this.getAllFlags();
    flags.forEach(flag => {
      const explanation = this.getFlagExplanation(flag.id);
      const status = flag.isDefault ? '(default)' : '(triggered)';
      console.log(`🏁 ${flag.id}: ${JSON.stringify(flag.value)} ${status} - ${explanation.reason}`);
    });
    console.log('🏁 === END FEATURE FLAGS ===');
  }

  /**
   * Check if any flags have conflicts (future enhancement)
   */
  private checkForConflicts(): string[] {
    // Future enhancement: check for conflicting flags
    // For now, return empty array
    return [];
  }
}