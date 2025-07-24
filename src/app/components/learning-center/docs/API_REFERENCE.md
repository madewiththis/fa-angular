# Learning Center API Reference

## LearningContentService

The main service for accessing and managing learning content throughout the FlowAccount application.

### Service Injection
```typescript
import { LearningContentService } from './components/learning-center/services/learning-content.service';

@Component({...})
export class YourComponent {
  private learningContentService = inject(LearningContentService);
}
```

## Reactive Data Access

### Content Signals (Read-Only)
```typescript
// Core content collections
readonly goals = this.learningContentService.goals;
readonly workflows = this.learningContentService.workflows;
readonly tasks = this.learningContentService.tasks;
readonly quickGuideCategories = this.learningContentService.quickGuideCategories;

// User progress
readonly userProgress = this.learningContentService.userProgress;

// System state
readonly isLoading = this.learningContentService.isLoading;
readonly error = this.learningContentService.error;
```

### Computed Statistics
```typescript
// Content counts
readonly totalContent = this.learningContentService.totalContent;
// Returns: { goals: number, workflows: number, tasks: number, quickGuideCategories: number }

readonly publishedContent = this.learningContentService.publishedContent;
// Returns: { goals: number, workflows: number, tasks: number, quickGuideCategories: number }
```

## Content Retrieval Methods

### Individual Content Items
```typescript
// Get single items by ID
getGoal(goalId: string): LearningGoal | null
getWorkflow(workflowId: string): LearningWorkflow | null
getTask(taskId: string): LearningTask | null
getQuickGuideCategory(categoryId: string): QuickGuideCategory | null

// Usage example
const task = this.learningContentService.getTask('task_1737722400_001');
if (task) {
  console.log('Task instructions:', task.instructions);
}
```

### Related Content Navigation
```typescript
// Get workflows for a specific goal
getWorkflowsForGoal(goalId: string): LearningWorkflow[]

// Get tasks for a specific workflow  
getTasksForWorkflow(workflowId: string): LearningTask[]

// Get goals suitable for user profile
getGoalsForProfile(userRole: UserRole, businessType: BusinessType): LearningGoal[]

// Usage example
const goal = this.learningContentService.getGoal('goal_1737722400_001');
if (goal) {
  const workflows = this.learningContentService.getWorkflowsForGoal(goal.id);
  workflows.forEach(workflow => {
    const tasks = this.learningContentService.getTasksForWorkflow(workflow.id);
    console.log(`${workflow.name} has ${tasks.length} tasks`);
  });
}
```

### Published Content Only
```typescript
// Get only published content (for end-user interfaces)
getPublishedGoals(): LearningGoal[]
getPublishedQuickGuideCategories(): QuickGuideCategory[]

// Usage example
const publishedGoals = this.learningContentService.getPublishedGoals();
// Only returns goals with status === 'published'
```

## Content Management (Admin)

### Create Operations
```typescript
// Create new content
async createTask(taskData: Omit<LearningTask, 'id' | 'version' | 'lastUpdated'>): Promise<LearningTask>
async createWorkflow(workflowData: Omit<LearningWorkflow, 'id' | 'version' | 'lastUpdated' | 'estimatedTime' | 'difficulty'>): Promise<LearningWorkflow>
async createGoal(goalData: Omit<LearningGoal, 'id' | 'version' | 'lastUpdated' | 'estimatedTotalTime'>): Promise<LearningGoal>
async createQuickGuideCategory(categoryData: Omit<QuickGuideCategory, 'id' | 'version' | 'lastUpdated'>): Promise<QuickGuideCategory>

// Usage example
const newTask = await this.learningContentService.createTask({
  name: 'Create First Invoice',
  description: 'Learn how to create and send invoices to customers',
  outcome: 'Professional invoice sent to customer',
  estimatedTime: 10,
  difficulty: 'beginner',
  contentAttachments: { /* ... */ },
  instructions: { /* ... */ },
  completionCriteria: { /* ... */ },
  tags: ['invoicing', 'sales'],
  category: 'Sales',
  status: 'draft'
});
```

### Update Operations
```typescript
// Update existing content
async updateTask(taskId: string, updates: Partial<LearningTask>): Promise<LearningTask | null>
async updateWorkflow(workflowId: string, updates: Partial<LearningWorkflow>): Promise<LearningWorkflow | null>
async updateGoal(goalId: string, updates: Partial<LearningGoal>): Promise<LearningGoal | null>
async updateQuickGuideCategory(categoryId: string, updates: Partial<QuickGuideCategory>): Promise<QuickGuideCategory | null>

// Usage example
await this.learningContentService.updateTask('task_123', {
  status: 'published',
  estimatedTime: 15 // Updated time estimate
});
```

### Delete Operations
```typescript
// Delete content
async deleteTask(taskId: string): Promise<boolean>
async deleteWorkflow(workflowId: string): Promise<boolean>
async deleteGoal(goalId: string): Promise<boolean>
async deleteQuickGuideCategory(categoryId: string): Promise<boolean>

// Usage example
const success = await this.learningContentService.deleteTask('task_123');
if (success) {
  console.log('Task deleted successfully');
}
```

## Search & Discovery

### Content Search
```typescript
searchContent(query: ContentSearchQuery): ContentSearchResult[]

// Query interface
interface ContentSearchQuery {
  keyword?: string;
  tags?: string[];
  difficulty?: DifficultyLevel;
  estimatedTime?: { min?: number; max?: number };
  userRole?: UserRole;
  businessType?: BusinessType;
  category?: string;
  status?: ContentStatus;
}

// Usage example
const results = this.learningContentService.searchContent({
  keyword: 'invoice',
  difficulty: 'beginner',
  status: 'published'
});

results.forEach(result => {
  console.log(`Found ${result.type}: ${result.name} (score: ${result.relevanceScore})`);
});
```

### Recommendations
```typescript
getRecommendations(context: RecommendationContext, limit?: number): LearningRecommendation[]

// Context interface
interface RecommendationContext {
  userRole: UserRole;
  businessType: BusinessType;
  completedGoals?: string[];
  currentProgress?: WorkflowProgress[];
  timePreference?: number;
  difficultyPreference?: DifficultyLevel;
  interests?: string[];
}

// Usage example
const recommendations = this.learningContentService.getRecommendations({
  userRole: 'owner',
  businessType: 'service',
  timePreference: 30, // 30 minutes available
  difficultyPreference: 'beginner'
}, 5); // Limit to 5 recommendations
```

## Progress Tracking

### Goal Management
```typescript
// Start tracking a goal
startGoal(goalId: string, selectedWorkflows: string[]): void

// Get progress summary
getGoalProgress(goalId: string): ProgressSummary

// Usage example
this.learningContentService.startGoal('goal_1737722400_001', [
  'workflow_1737722400_001',
  'workflow_1737722400_002'
]);

const progress = this.learningContentService.getGoalProgress('goal_1737722400_001');
console.log(`Progress: ${progress.completed}/${progress.total} (${progress.percentage}%)`);
```

### Task Completion
```typescript
// Mark task as completed
completeTask(taskId: string, workflowId: string, goalId: string, timeSpent?: number): void

// Usage example
this.learningContentService.completeTask(
  'task_1737722400_001',
  'workflow_1737722400_001', 
  'goal_1737722400_001',
  8 // 8 minutes spent
);
```

## Content Initialization

### Loading Content
```typescript
// Initialize with content library
async initializeContent(contentLibrary: ContentLibrary): Promise<void>

// Load from storage
async loadContent(): Promise<void>

// Usage example (usually done automatically)
import { CONTENT_LIBRARY } from './data/content-library';
await this.learningContentService.initializeContent(CONTENT_LIBRARY);
```

### Content Validation
```typescript
// Validate content integrity
validateContent(): ContentValidationResult

// Usage example
const validation = this.learningContentService.validateContent();
if (!validation.valid) {
  console.error('Content validation errors:', validation.errors);
}
```

## Data Types

### Core Content Types
```typescript
interface LearningTask {
  id: string;
  name: string;
  description: string;
  instructions: TaskInstructions;
  outcome: string;
  estimatedTime: number; // minutes
  difficulty: DifficultyLevel;
  contentAttachments: ContentAttachments;
  completionCriteria: TaskValidation;
  prerequisites?: string[];
  tips?: string[];
  troubleshooting?: TroubleshootingTip[];
  featureLink?: FeatureLink;
  tags: string[];
  category?: string;
  version: number;
  status: ContentStatus;
  lastUpdated: Date;
}

interface LearningWorkflow {
  id: string;
  name: string;
  description: string;
  outcome: string;
  businessValue: string;
  contentAttachments: ContentAttachments;
  taskIds: string[];
  taskSequence: TaskSequence;
  estimatedTime: number; // calculated from tasks
  difficulty: DifficultyLevel; // calculated from tasks
  category: string;
  completionCriteria: string;
  version: number;
  status: ContentStatus;
  lastUpdated: Date;
}

interface LearningGoal {
  id: string;
  name: string;
  description: string;
  businessValue: string;
  priority: number;
  contentAttachments: ContentAttachments;
  workflowIds: string[];
  requiredWorkflows: string[];
  optionalWorkflows: string[];
  applicableRoles: UserRole[];
  applicableBusinessTypes: BusinessType[];
  successMetrics: string[];
  estimatedTotalTime: number; // calculated from workflows
  expectedOutcome: string;
  version: number;
  status: ContentStatus;
  lastUpdated: Date;
}

interface QuickGuideCategory {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string; // Material icon name
  order: number;
  status: ContentStatus;
  featureMapping?: string; // Maps to FlowAccount feature
  assignedTaskIds: string[];
  assignedWorkflowIds: string[];
  assignedGoalIds: string[];
  version: number;
  lastUpdated: Date;
}
```

### Task Instructions Structure
```typescript
interface TaskInstructions {
  overview: string;
  steps: InstructionStep[];
  expectedResult: string;
  alternativeApproaches?: AlternativeApproach[];
}

interface InstructionStep {
  stepNumber: number;
  title: string;
  description: string;
  action: 'click' | 'input' | 'navigate' | 'wait' | 'verify' | 'upload' | 'select' | 'review';
  target?: string; // CSS selector, URL, or element description
  inputValue?: string;
  screenshot?: string;
  validationCriteria?: string;
  notes?: string;
}
```

### Progress Tracking Types
```typescript
interface ProgressSummary {
  completed: number;
  total: number;
  percentage: number;
}

interface UserLearningProgress {
  userId?: string;
  goalSelections: GoalSelection[];
  workflowProgress: WorkflowProgress[];
  taskProgress: TaskProgress[];
  lastActive: Date;
  totalTimeSpent: number; // minutes
}
```

## Error Handling

### Service Errors
```typescript
// Check for errors
if (this.learningContentService.error()) {
  console.error('Learning content error:', this.learningContentService.error());
}

// Handle loading states
if (this.learningContentService.isLoading()) {
  // Show loading indicator
}
```

### Content Validation
```typescript
// Validate before using content
const validation = this.learningContentService.validateContent();
if (!validation.valid) {
  console.error('Content validation failed:', validation.errors);
  // Handle broken references or invalid content
}
```

## Performance Considerations

### Reactive Patterns
```typescript
// ✅ Good: Use computed for derived data
readonly availableTasks = computed(() => 
  this.learningContentService.tasks()
    .filter(task => task.status === 'published')
);

// ❌ Avoid: Direct signal access in templates
// {{ learningContentService.tasks().filter(...) }}
```

### Large Content Sets
```typescript
// Limit results for UI performance
readonly topTasks = computed(() => 
  this.availableTasks().slice(0, 10)
);

// Use pagination for large lists
readonly paginatedTasks = computed(() => {
  const start = this.currentPage() * this.pageSize();
  return this.availableTasks().slice(start, start + this.pageSize());
});
```

This API reference provides comprehensive documentation for integrating with the Learning Center system across any FlowAccount component.