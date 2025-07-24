// Learning Center - Standalone Type Definitions
// Self-contained types for the learning content system

// Flexible role and business type definitions (can be extended without code changes)
export type UserRole = string; // e.g., 'owner', 'accountant', 'staff', etc. - flexible for FlowAccount changes
export type BusinessType = string; // e.g., 'service', 'retail', 'manufacturing' - flexible for FlowAccount changes
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ValidationMethod = 'automatic' | 'user_confirmation' | 'system_check';
export type TaskSequence = 'sequential' | 'parallel' | 'flexible';
export type ContentStatus = 'draft' | 'published' | 'archived' | 'deprecated';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'skipped';

// Content Attachments - Reusable for Goals, Workflows, and Tasks
export interface ContentAttachments {
  // Video Content
  videoUrls: string[]; // Multiple video links
  videoDurations?: number[]; // Corresponding durations in seconds
  
  // Article Content
  articleUrls: string[]; // Blog articles, documentation links
  articleTitles?: string[]; // Corresponding article titles
  
  // AI Integration
  aiPrompts: string[]; // Prompts for future AI assistance
  aiContexts?: string[]; // Context for each prompt
  
  // Additional Resources
  resourceUrls?: string[]; // Other helpful links
  resourceDescriptions?: string[]; // Descriptions for resources
  
  // Documentation
  attachmentNotes?: string; // General notes about the attachments
}

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
  
  // Learning Materials & Content Attachments
  contentAttachments: ContentAttachments;
  interactiveDemo?: TaskDemo;
  
  // Validation & Completion
  completionCriteria: TaskValidation;
  prerequisites?: string[]; // Other task IDs that must be completed first
  
  // User Experience Enhancement
  tips?: string[];
  commonMistakes?: string[];
  troubleshooting?: TroubleshootingTip[];
  
  // Feature Linking
  featureLink?: {
    mainFeature: string; // e.g., 'sell', 'buy', 'dashboard'
    subFeature?: string; // e.g., 'quotation', 'tax-invoice'
    route: string; // e.g., '/sell/quotation'
    displayLocation: string[]; // Where to show this task in the UI
  };
  
  // Content Management
  tags: string[]; // For searching and categorization
  category?: string; // Primary category
  version: number;
  status: ContentStatus;
  lastUpdated: Date;
  
  // Analytics (optional - for production systems)
  averageCompletionTime?: number;
  completionRate?: number;
  difficultyRating?: number;
}

export interface LearningWorkflow {
  id: string;
  name: string;
  description: string;
  
  // Business Value
  outcome: string; // What this workflow achieves
  businessValue: string; // Specific measurable benefit
  
  // Content Attachments
  contentAttachments: ContentAttachments;
  
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
  
  // Success Metrics
  successIndicators?: string[];
  expectedROI?: string;
}

export interface LearningGoal {
  id: string;
  name: string;
  description: string;
  
  // Business Context
  businessValue: string; // Combined benefit of all workflows
  priority: number; // 1 = highest priority
  
  // Content Attachments
  contentAttachments: ContentAttachments;
  
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
  type: 'interactive_guide' | 'sandbox' | 'video_overlay';
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
  status: ProgressStatus;
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
  status: ProgressStatus;
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

// Utility Types

export interface ContentLibrary {
  goals: LearningGoal[];
  workflows: LearningWorkflow[];
  tasks: LearningTask[];
}

export interface ProgressSummary {
  completed: number;
  total: number;
  percentage: number;
}

export interface ContentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Event Types for Component Communication

export interface LearningCenterEvents {
  goalSelected: { goalId: string; workflowIds: string[] };
  workflowStarted: { workflowId: string; goalId: string };
  taskCompleted: { taskId: string; workflowId: string; goalId: string; timeSpent: number };
  progressUpdated: { progress: UserLearningProgress };
  contentSearched: { query: ContentSearchQuery; results: ContentSearchResult[] };
  recommendationRequested: { context: RecommendationContext };
}