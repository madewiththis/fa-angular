// Goal-Based Evaluation System Interfaces
// Implementation of Goals → Workflows → Tasks structure for FlowAccount evaluation

export type UserRole = 'owner' | 'administrator' | 'accountant' | 'staff' | 'accounting_firm' | 'freelancer' | 'student';
export type BusinessType = 'service' | 'product' | 'mixed' | 'freelance' | 'e_commerce' | 'restaurant' | 'retail' | 'consulting';
export type TaskDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TaskValidationType = 'automatic' | 'user_confirmation' | 'system_check';

export interface BusinessGoal {
  id: string;
  name: string;
  description: string;
  applicableRoles: UserRole[];
  applicableBusinessTypes: BusinessType[];
  workflows: GoalWorkflow[];
  overallBenefit: string; // Combined benefit of all workflows
  estimatedTotalTime: number; // Total minutes for all workflows
  successMetrics: string[]; // How to measure goal achievement
  priority: number; // For ordering goals by importance (1 = highest)
}

export interface GoalWorkflow {
  id: string;
  name: string;
  description: string;
  definedOutcome: string; // What this specific workflow achieves
  benefitStatement: string; // Specific measurable benefit
  tasks: WorkflowTask[];
  estimatedTime: number;
  difficulty: TaskDifficulty;
  prerequisites?: string[]; // Other workflows that should be completed first
  completionCriteria: string; // How to know the workflow is successfully completed
}

export interface WorkflowTask {
  id: string;
  name: string;
  description: string;
  
  // Learning Materials
  instructions: TaskInstructions;
  videoExample?: TaskVideo;
  interactiveDemo?: TaskDemo;
  
  // Completion Tracking
  taskOutcome: string; // What user will achieve by completing this task
  completionValidation: TaskValidation;
  estimatedTime: number; // Minutes to complete
  
  // User Experience
  difficulty: TaskDifficulty;
  tips?: string[]; // Helpful hints for users
  commonMistakes?: string[]; // What to avoid
  
  // Technical Integration (Phase 4 - Advanced)
  requiredPermissions?: string[]; // What access user needs
  dependencies?: string[]; // Other tasks that must be completed first
}

export interface TaskInstructions {
  overview: string; // What this task accomplishes
  steps: InstructionStep[];
  expectedResult: string; // What user should see when complete
  troubleshooting?: TroubleshootingTip[];
}

export interface InstructionStep {
  stepNumber: number;
  title: string;
  description: string;
  action: 'click' | 'input' | 'navigate' | 'wait' | 'verify' | 'upload';
  target?: string; // CSS selector, URL, or element description
  inputValue?: string; // For input actions
  screenshot?: string; // Reference image showing expected state
  validationCriteria?: string; // How to verify step completion
}

export interface TaskVideo {
  url: string;
  title: string;
  duration: number; // seconds
  thumbnailUrl?: string;
  captions?: boolean;
  keyMoments?: VideoTimestamp[]; // Jump to specific moments
}

export interface VideoTimestamp {
  time: number; // seconds
  label: string;
  description: string;
}

export interface TaskDemo {
  type: 'interactive_guide' | 'sandbox' | 'puppeteer'; // Puppeteer for Phase 4
  config: InteractiveConfig | SandboxConfig;
}

export interface InteractiveConfig {
  overlayType: 'tooltip' | 'modal' | 'highlight';
  guidanceLevel: 'minimal' | 'detailed' | 'comprehensive';
  allowSkipping: boolean;
  progressTracking: boolean;
}

export interface SandboxConfig {
  isolatedEnvironment: boolean;
  preloadedData: string; // JSON of demo data
  resetBetweenAttempts: boolean;
  allowRealActions: boolean; // Whether actions affect real account
}

export interface TaskValidation {
  type: TaskValidationType;
  criteria: ValidationCriteria[];
  fallbackValidation?: string; // Manual check if automatic fails
}

export interface ValidationCriteria {
  field: string; // What to check (e.g., 'invoice_created', 'payment_recorded')
  operator: 'equals' | 'contains' | 'exists' | 'greater_than' | 'less_than';
  expectedValue: any;
  errorMessage?: string; // What to show if validation fails
}

export interface TroubleshootingTip {
  commonIssue: string;
  solution: string;
  relatedFAQ?: string; // Link to FAQ or help article
}

// Goal Selection and Progress Tracking

export interface GoalSelection {
  goalId: string;
  selectedWorkflows: string[]; // Which workflows user wants to try
  startedAt: Date;
  priority: number; // User-defined priority order
}

export interface WorkflowProgress {
  workflowId: string;
  goalId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  completedTasks: string[];
  currentTaskId?: string;
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number; // minutes
}

export interface TaskProgress {
  taskId: string;
  workflowId: string;
  goalId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: Date;
  timeSpent: number; // minutes
  attemptsCount: number;
  completionMethod: 'automatic' | 'manual' | 'assisted';
}

// Learning Panel State Management

export interface LearningPanelState {
  isOpen: boolean;
  activeGoalId?: string;
  activeWorkflowId?: string;
  activeTaskId?: string;
  view: 'goal_overview' | 'workflow_list' | 'task_guidance' | 'progress_summary';
}

// Goal Recommendation System (Phase 3)

export interface GoalRecommendation {
  goalId: string;
  score: number; // 0-100 confidence score
  reasons: string[]; // Why this goal was recommended
  basedOn: 'role' | 'business_type' | 'survey_response' | 'behavioral_data';
}

export interface RecommendationContext {
  userRole: UserRole;
  businessType: BusinessType;
  surveyResponses?: Record<string, any>;
  completedGoals?: string[];
  currentPriorities?: string[];
}