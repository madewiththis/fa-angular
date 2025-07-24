// Learning Content Foundation System Interfaces
// Unified system for Goals → Workflows → Tasks content management
// Built on existing goal-system.interfaces.ts but enhanced for universal use

export type UserRole = 'owner' | 'administrator' | 'accountant' | 'staff' | 'accounting_firm' | 'freelancer' | 'student';
export type BusinessType = 'service' | 'product' | 'mixed' | 'freelance' | 'e_commerce' | 'restaurant' | 'retail' | 'consulting';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ValidationMethod = 'automatic' | 'user_confirmation' | 'system_check';
export type TaskSequence = 'sequential' | 'parallel' | 'flexible';
export type ContentStatus = 'draft' | 'published' | 'archived' | 'deprecated';

// Core Learning Content Entities

export interface LearningTask {
  id: string;
  name: string;
  description: string;
  
  // Content Structure
  instructions: TaskInstructions;
  outcome: string; // What user will achieve by completing this task
  estimatedTime: number; // Minutes to complete
  difficulty: DifficultyLevel;
  
  // Learning Materials
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: number; // seconds
  interactiveDemo?: TaskDemo;
  relatedDocuments?: string[]; // URLs to help documentation
  
  // Validation & Completion
  completionCriteria: TaskValidation;
  prerequisites?: string[]; // Other task IDs that must be completed first
  
  // User Experience Enhancement
  tips?: string[];
  commonMistakes?: string[];
  troubleshooting?: TroubleshootingTip[];
  
  // Content Management
  tags: string[]; // For searching and categorization
  category?: string; // Primary category
  version: number;
  status: ContentStatus;
  lastUpdated: Date;
  createdBy?: string;
  
  // Analytics & Optimization
  averageCompletionTime?: number; // Actual time users take
  completionRate?: number; // % of users who complete this task
  difficulty_rating?: number; // User-provided difficulty rating
}

export interface LearningWorkflow {
  id: string;
  name: string;
  description: string;
  
  // Business Value
  outcome: string; // What this workflow achieves
  businessValue: string; // Specific measurable benefit
  
  // Task Management
  taskIds: string[]; // Ordered list of task IDs
  taskSequence: TaskSequence;
  
  // Metadata
  estimatedTime: number; // Sum of all tasks (calculated)
  difficulty: DifficultyLevel; // Highest difficulty of contained tasks
  category: string;
  
  // Workflow Prerequisites
  prerequisites?: string[]; // Other workflow IDs
  completionCriteria: string; // How to know workflow is complete
  
  // Content Management
  version: number;
  status: ContentStatus;
  lastUpdated: Date;
  createdBy?: string;
  
  // Success Metrics
  successIndicators?: string[]; // How to measure workflow success
  expectedROI?: string;
}

export interface LearningGoal {
  id: string;
  name: string;
  description: string;
  
  // Business Context
  businessValue: string; // Combined benefit of all workflows
  priority: number; // 1 = highest priority
  
  // Workflow Management
  workflowIds: string[];
  requiredWorkflows: string[]; // Must complete these
  optionalWorkflows: string[]; // Nice to have
  
  // User Targeting
  applicableRoles: UserRole[];
  applicableBusinessTypes: BusinessType[];
  
  // Success Measurement
  successMetrics: string[];
  estimatedTotalTime: number; // Sum of all workflows (calculated)
  expectedOutcome: string;
  
  // Content Management
  version: number;
  status: ContentStatus;
  lastUpdated: Date;
  createdBy?: string;
}

// Supporting Interfaces

export interface TaskInstructions {
  overview: string; // What this task accomplishes
  steps: InstructionStep[];
  expectedResult: string; // What user should see when complete
  alternativeApproaches?: AlternativeApproach[];
}

export interface InstructionStep {
  stepNumber: number;
  title: string;
  description: string;
  action: 'click' | 'input' | 'navigate' | 'wait' | 'verify' | 'upload' | 'select' | 'review';
  target?: string; // CSS selector, URL, or element description
  inputValue?: string; // For input actions
  screenshot?: string; // Reference image
  validationCriteria?: string; // How to verify step completion
  notes?: string; // Additional context or tips
}

export interface AlternativeApproach {
  name: string;
  description: string;
  whenToUse: string;
  steps: InstructionStep[];
}

export interface TaskDemo {
  type: 'interactive_guide' | 'sandbox' | 'video_overlay' | 'step_by_step';
  config: InteractiveConfig | SandboxConfig | VideoOverlayConfig;
}

export interface InteractiveConfig {
  overlayType: 'tooltip' | 'modal' | 'highlight' | 'popup';
  guidanceLevel: 'minimal' | 'detailed' | 'comprehensive';
  allowSkipping: boolean;
  progressTracking: boolean;
  autoAdvance?: boolean;
}

export interface SandboxConfig {
  isolatedEnvironment: boolean;
  preloadedData?: string; // JSON of demo data
  resetBetweenAttempts: boolean;
  allowRealActions: boolean; // Whether actions affect real account
  timeLimit?: number; // Minutes
}

export interface VideoOverlayConfig {
  videoUrl: string;
  overlayPoints: VideoOverlayPoint[];
  allowScrubbing: boolean;
  autoPlay: boolean;
}

export interface VideoOverlayPoint {
  timeSeconds: number;
  title: string;
  description: string;
  action?: 'pause' | 'highlight' | 'show_tip';
}

export interface TaskValidation {
  type: ValidationMethod;
  criteria: ValidationCriteria[];
  fallbackMethod?: string; // Manual check if automatic fails
  timeoutSeconds?: number;
}

export interface ValidationCriteria {
  field: string; // What to check
  operator: 'equals' | 'contains' | 'exists' | 'greater_than' | 'less_than' | 'not_equals';
  expectedValue: any;
  errorMessage?: string;
  retryable?: boolean;
}

export interface TroubleshootingTip {
  commonIssue: string;
  solution: string;
  relatedFAQ?: string;
  severity: 'low' | 'medium' | 'high';
}

// Progress Tracking & User State

export interface UserLearningProgress {
  userId?: string; // For future backend integration
  goalSelections: GoalSelection[];
  workflowProgress: WorkflowProgress[];
  taskProgress: TaskProgress[];
  lastActive: Date;
  totalTimeSpent: number; // minutes
}

export interface GoalSelection {
  goalId: string;
  selectedWorkflows: string[];
  startedAt: Date;
  priority: number; // User-defined priority
  reason?: string; // Why user selected this goal
}

export interface WorkflowProgress {
  workflowId: string;
  goalId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'skipped';
  completedTasks: string[];
  currentTaskId?: string;
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number; // minutes
  completionPercentage: number; // 0-100
}

export interface TaskProgress {
  taskId: string;
  workflowId: string;
  goalId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number; // minutes
  attemptsCount: number;
  completionMethod: 'automatic' | 'manual' | 'assisted';
  userRating?: number; // 1-5 rating of task quality
  feedback?: string; // User feedback on task
}

// Content Discovery & Search

export interface ContentSearchQuery {
  keyword?: string;
  tags?: string[];
  difficulty?: DifficultyLevel;
  estimatedTime?: {
    min?: number; // minutes
    max?: number;
  };
  userRole?: UserRole;
  businessType?: BusinessType;
  category?: string;
  status?: ContentStatus;
}

export interface ContentSearchResult {
  type: 'task' | 'workflow' | 'goal';
  id: string;
  name: string;
  description: string;
  relevanceScore: number; // 0-100
  matchingFields: string[]; // Which fields matched the search
}

// Recommendation System

export interface LearningRecommendation {
  type: 'goal' | 'workflow' | 'task';
  id: string;
  title: string;
  description: string;
  score: number; // 0-100 confidence score
  reasons: string[]; // Why this was recommended
  basedOn: 'role' | 'business_type' | 'progress' | 'peer_data' | 'trending';
  estimatedTime: number;
  difficulty: DifficultyLevel;
}

export interface RecommendationContext {
  userRole: UserRole;
  businessType: BusinessType;
  completedGoals?: string[];
  currentProgress?: WorkflowProgress[];
  timePreference?: number; // minutes user has available
  difficultyPreference?: DifficultyLevel;
  interests?: string[]; // tags or categories user is interested in
}

// Analytics & Insights

export interface LearningAnalytics {
  contentId: string;
  contentType: 'task' | 'workflow' | 'goal';
  metrics: {
    views: number;
    starts: number;
    completions: number;
    averageTime: number; // minutes
    completionRate: number; // 0-100
    averageRating: number; // 1-5
    dropoffPoints?: DropoffPoint[];
  };
  userSegmentation?: UserSegmentMetrics[];
  trendData?: TrendDataPoint[];
}

export interface DropoffPoint {
  stepNumber: number;
  stepName: string;
  dropoffPercentage: number;
  commonIssues?: string[];
}

export interface UserSegmentMetrics {
  segment: string; // role or business type
  completionRate: number;
  averageTime: number;
  satisfaction: number;
}

export interface TrendDataPoint {
  date: Date;
  completions: number;
  averageRating: number;
}

// Content Management System

export interface ContentVersion {
  version: number;
  createdAt: Date;
  createdBy: string;
  changes: string; // Description of changes
  published: boolean;
}

export interface ContentValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Integration Adapters

export interface PresentationAdapter {
  name: string; // 'quick-start', 'learning-center', 'goal-evaluation'
  getContent(params: any): Promise<any>;
  transformContent(content: LearningTask | LearningWorkflow | LearningGoal): any;
  trackProgress(progressData: any): void;
}

export interface LearningContentQuery {
  goalIds?: string[];
  workflowIds?: string[];
  taskIds?: string[];
  filters?: ContentSearchQuery;
  includeProgress?: boolean;
  userId?: string;
}

export interface LearningContentResponse {
  goals: LearningGoal[];
  workflows: LearningWorkflow[];
  tasks: LearningTask[];
  progress?: UserLearningProgress;
  recommendations?: LearningRecommendation[];
}