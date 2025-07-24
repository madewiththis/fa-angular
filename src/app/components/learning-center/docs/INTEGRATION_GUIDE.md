# Learning Center Integration Guide

## Overview

The Learning Center serves as the central repository for all learning content in FlowAccount. Other system components can easily integrate with it to provide contextual help, guided experiences, and structured learning paths.

## Integration Patterns

### 1. Get Started Dashboard Integration ✅
**Location**: `src/app/pages/dashboard/get-started/get-started.component.ts`

**Pattern**: Quick Guide Categories → Dashboard Actions
```typescript
// Service injection
private learningContentService = inject(LearningContentService);

// Reactive data access
readonly quickGuideCategories = this.learningContentService.quickGuideCategories;

// Transform to UI format
quickActions = computed(() => {
  const publishedCategories = this.quickGuideCategories()
    .filter(qg => qg.status === 'published');
  
  return publishedCategories.map(category => 
    this.transformCategoryToAction(category)
  );
});
```

### 2. Help Panel Integration 🚧 (Next Implementation)
**Location**: Help panel right sidebar

**Pattern**: Context-aware task instructions
```typescript
// Get relevant tasks for current page/feature
getCurrentContextTasks(featureArea: string): LearningTask[] {
  return this.learningContentService.tasks()
    .filter(task => 
      task.featureLink?.mainFeature === featureArea && 
      task.status === 'published'
    );
}

// Get step-by-step instructions
getTaskInstructions(taskId: string): TaskInstructions | null {
  const task = this.learningContentService.getTask(taskId);
  return task?.instructions || null;
}
```

### 3. Guided Tour Integration 🚧 (Future)
**Pattern**: Workflow-based guided experiences
```typescript
// Start guided workflow
startGuidedWorkflow(workflowId: string): void {
  const workflow = this.learningContentService.getWorkflow(workflowId);
  const tasks = this.learningContentService.getTasksForWorkflow(workflowId);
  
  // Initialize tour with task sequence
  this.guidedTourService.startTour(workflow, tasks);
}
```

## Core Integration APIs

### LearningContentService Methods

#### Content Retrieval
```typescript
// Get individual items
getGoal(goalId: string): LearningGoal | null
getWorkflow(workflowId: string): LearningWorkflow | null  
getTask(taskId: string): LearningTask | null
getQuickGuideCategory(categoryId: string): QuickGuideCategory | null

// Get related content
getWorkflowsForGoal(goalId: string): LearningWorkflow[]
getTasksForWorkflow(workflowId: string): LearningTask[]
getGoalsForProfile(userRole: string, businessType: string): LearningGoal[]

// Get published content only
getPublishedGoals(): LearningGoal[]
getPublishedQuickGuideCategories(): QuickGuideCategory[]
```

#### Search & Discovery
```typescript
// Search across all content types
searchContent(query: ContentSearchQuery): ContentSearchResult[]

// Get personalized recommendations
getRecommendations(context: RecommendationContext): LearningRecommendation[]
```

#### Progress Tracking
```typescript
// Goal lifecycle
startGoal(goalId: string, selectedWorkflows: string[]): void
getGoalProgress(goalId: string): ProgressSummary

// Task completion
completeTask(taskId: string, workflowId: string, goalId: string, timeSpent?: number): void
```

### Content Structure

#### Task Instructions for Help Integration
```typescript
interface TaskInstructions {
  overview: string;                    // What this task accomplishes
  steps: InstructionStep[];           // Step-by-step guide
  expectedResult: string;             // What user should see when complete
  alternativeApproaches?: AlternativeApproach[];
}

interface InstructionStep {
  stepNumber: number;
  title: string;
  description: string;
  action: 'click' | 'input' | 'navigate' | 'wait' | 'verify' | 'upload' | 'select' | 'review';
  target?: string;                    // CSS selector, URL, or element description
  inputValue?: string;               // For input actions
  screenshot?: string;               // Reference image
  validationCriteria?: string;       // How to verify step completion
  notes?: string;                    // Additional context
}
```

#### Feature Linking for Context-Aware Help
```typescript
interface FeatureLink {
  mainFeature: string;               // e.g., 'sell', 'buy', 'dashboard'
  subFeature?: string;              // e.g., 'quotation', 'tax-invoice'
  route: string;                    // e.g., '/sell/quotation'
  displayLocation: string[];        // Where to show this task in the UI
}
```

## Integration Examples

### Example 1: Context-Aware Help Panel
```typescript
@Component({
  selector: 'app-help-panel',
  template: `
    <div class="help-panel">
      <h3>Need help with {{ currentFeature }}?</h3>
      
      <div *ngFor="let task of contextTasks()" class="help-task">
        <h4>{{ task.name }}</h4>
        <p>{{ task.description }}</p>
        
        <div class="task-steps" *ngIf="selectedTask() === task.id">
          <div *ngFor="let step of task.instructions.steps" class="step">
            <strong>{{ step.stepNumber }}. {{ step.title }}</strong>
            <p>{{ step.description }}</p>
          </div>
        </div>
        
        <button (click)="toggleTask(task.id)">
          {{ selectedTask() === task.id ? 'Hide' : 'Show' }} Steps
        </button>
      </div>
    </div>
  `
})
export class HelpPanelComponent {
  private learningContentService = inject(LearningContentService);
  private router = inject(Router);
  
  selectedTask = signal<string | null>(null);
  
  // Get current feature from route
  readonly currentFeature = computed(() => {
    const url = this.router.url;
    if (url.startsWith('/sell')) return 'sell';
    if (url.startsWith('/buy')) return 'buy';
    if (url.startsWith('/dashboard')) return 'dashboard';
    return 'general';
  });
  
  // Get tasks relevant to current context
  readonly contextTasks = computed(() => {
    const feature = this.currentFeature();
    return this.learningContentService.tasks()
      .filter(task => 
        task.featureLink?.mainFeature === feature && 
        task.status === 'published'
      )
      .slice(0, 5); // Limit to top 5 most relevant
  });
  
  toggleTask(taskId: string): void {
    this.selectedTask.set(
      this.selectedTask() === taskId ? null : taskId
    );
  }
}
```

### Example 2: Feature-Specific Task Launcher
```typescript
// In sell/quotation component
@Component({...})
export class QuotationComponent {
  private learningContentService = inject(LearningContentService);
  
  // Get tasks specific to quotations
  readonly quotationTasks = computed(() => 
    this.learningContentService.tasks()
      .filter(task => 
        task.featureLink?.subFeature === 'quotation' &&
        task.status === 'published'
      )
  );
  
  showTaskHelp(taskId: string): void {
    const task = this.learningContentService.getTask(taskId);
    if (task) {
      // Show task instructions in overlay or panel
      this.helpPanelService.showTaskInstructions(task);
    }
  }
  
  startGuidedQuotationFlow(): void {
    // Find quotation workflow
    const quotationWorkflow = this.learningContentService.workflows()
      .find(w => w.category === 'Sales' && w.name.includes('Quotation'));
    
    if (quotationWorkflow) {
      // Start guided experience
      this.learningPanelService.startWorkflow(quotationWorkflow);
    }
  }
}
```

### Example 3: Search Integration
```typescript
// Global help search
@Component({...})
export class GlobalHelpSearchComponent {
  private learningContentService = inject(LearningContentService);
  
  searchQuery = signal<string>('');
  
  readonly searchResults = computed(() => {
    const query = this.searchQuery().trim();
    if (query.length < 2) return [];
    
    return this.learningContentService.searchContent({
      keyword: query,
      status: 'published'
    });
  });
  
  onSearch(query: string): void {
    this.searchQuery.set(query);
  }
  
  selectResult(result: ContentSearchResult): void {
    switch (result.type) {
      case 'task':
        this.showTaskInstructions(result.id);
        break;
      case 'workflow':
        this.startWorkflow(result.id);
        break;
      case 'goal':
        this.showGoalOverview(result.id);
        break;
    }
  }
}
```

## Best Practices

### 1. Reactive Integration
- Use computed signals for dynamic content
- Subscribe to service signals for real-time updates
- Avoid direct data manipulation

### 2. Context Awareness
- Filter content based on current route/feature
- Consider user role and business type
- Prioritize recently used or relevant content

### 3. Progressive Disclosure
- Show summaries first, details on demand
- Use collapsible sections for step-by-step instructions
- Provide multiple levels of help (quick tips → full guides)

### 4. Consistent UI Patterns
- Reuse existing FlowAccount UI components
- Follow established design patterns
- Maintain visual consistency across integrations

### 5. Performance Optimization
- Use computed properties for derived data
- Implement virtual scrolling for large lists
- Cache frequently accessed content

## Integration Checklist

### Before Integration
- [ ] Identify the specific learning content needed
- [ ] Determine the appropriate presentation format
- [ ] Plan for progress tracking (if applicable)
- [ ] Consider user context and personalization

### During Integration
- [ ] Inject `LearningContentService`
- [ ] Use reactive patterns (computed signals)
- [ ] Filter for published content only
- [ ] Handle loading and error states
- [ ] Implement proper TypeScript typing

### After Integration
- [ ] Test with various content scenarios
- [ ] Verify performance with large content sets
- [ ] Validate accessibility compliance
- [ ] Document custom integration patterns

## Troubleshooting

### Common Issues
1. **Content not appearing**: Check status filter (published only)
2. **Stale data**: Ensure using reactive signals, not direct values
3. **Type errors**: Import correct interfaces from learning-content.types.ts
4. **Performance issues**: Use computed properties and proper filtering

### Debug Helpers
```typescript
// Check content availability
console.log('Available tasks:', this.learningContentService.tasks().length);
console.log('Published tasks:', this.learningContentService.tasks().filter(t => t.status === 'published').length);

// Validate content integrity
const validation = this.learningContentService.validateContent();
console.log('Content validation:', validation);
```

This integration guide provides the foundation for connecting any FlowAccount component with the Learning Center's rich content repository.