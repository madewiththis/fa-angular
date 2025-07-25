# Learning Center Get Started Integration

> **📚 Documentation Navigation**: [README](README.md) | [Overview](OVERVIEW.md) | [Panel Docs](PANEL_DOCUMENTATION.md) | [Panel Integration](PANEL_CONTENT_INTEGRATION.md) | [Content Finder](CONTENT_FINDER.md) | [AI Assistant](AI_ASSISTANT.md) | **Get Started Integration** | [API Reference](API_REFERENCE.md) | [Integration Guide](INTEGRATION_GUIDE.md) | [UI Wireframe](UI_WIREFRAME.md) | [Dashboard Integration](LEARNING_CENTER_INTEGRATION.md)

## Overview

The Learning Center Get Started Integration is a specialized component that provides the Learning Center interface specifically for the dashboard's Get Started page. While displayed within the dashboard context, this component is part of the Learning Center system and serves as the primary gateway for new users to discover and engage with learning content.

> **🎯 Core Component**: This is one of the 5 core Learning Center components, focused specifically on first impressions and user onboarding through learning content.

## Purpose and Value

### **Problem Solved**
- **Disconnected Onboarding**: Dashboard get started experience is separate from learning content management
- **Static Content**: Get started actions are hardcoded rather than dynamically managed
- **Poor Learning Path Discovery**: Users don't understand how to progress from initial setup to advanced features
- **Content Management Burden**: Updating get started content requires code changes rather than content management
- **Limited Personalization**: Get started experience doesn't adapt to user role, business type, or progress

### **Solution Provided**
- **Dynamic Content Loading**: Get started actions loaded from Learning Center content management
- **Integrated Learning Paths**: Clear progression from basic setup to advanced feature mastery
- **Content Management Integration**: Admins can update get started experience through Learning Center admin
- **Personalized Onboarding**: Content adapts to user profile and business needs
- **Progress Tracking**: User completion state tracked across Learning Center system
- **Seamless Learning Transition**: Easy progression from get started to detailed learning content

## System Architecture

### **Get Started Integration Position in Learning Center Ecosystem**

```
Learning Center Ecosystem
├── Admin UI → Creates content
├── Content Service → Manages data
├── Content Finder → Discovers content
├── Panel → Displays content
├── AI Assistant → Intelligent help
└── Get Started Integration → Onboarding gateway ← YOU ARE HERE
```

### **Integration Architecture**

```
Get Started Integration System
├── Dashboard Context (pages/dashboard/get-started/)
│   ├── Dashboard Layout
│   ├── Dashboard Navigation
│   ├── Dashboard-specific Features
│   └── Learning Center Integration Component
├── Learning Center Integration (learning-center/get-started-integration/)
│   ├── Get Started Component
│   ├── Quick Action Generator
│   ├── Progress Tracker
│   └── Content Bridge
├── Content Management Integration
│   ├── Quick Guide Categories
│   ├── Dynamic Action Generation
│   ├── Content Status Management
│   └── Admin Content Updates
└── User Experience Flow
    ├── Dashboard Entry → Learning Content
    ├── Progress Tracking → Next Steps
    ├── Content Discovery → Learning Center Panel
    └── Advanced Features → Full Learning System
```

## Component Structure

### **Get Started Integration Architecture**

```
get-started-integration/
├── get-started-integration.component.ts    # Main integration component
├── get-started-integration.component.html  # Integration template
├── get-started-integration.component.scss  # Integration styling
├── components/
│   ├── quick-action-card/                 # Individual action cards
│   │   ├── quick-action-card.component.ts
│   │   ├── quick-action-card.component.html
│   │   └── quick-action-card.component.scss
│   ├── progress-indicator/                # Progress visualization
│   │   ├── progress-indicator.component.ts
│   │   ├── progress-indicator.component.html
│   │   └── progress-indicator.component.scss
│   ├── learning-path-preview/             # Learning path suggestions
│   │   ├── learning-path-preview.component.ts
│   │   ├── learning-path-preview.component.html
│   │   └── learning-path-preview.component.scss
│   └── content-recommendations/           # Next step suggestions
│       ├── content-recommendations.component.ts
│       ├── content-recommendations.component.html
│       └── content-recommendations.component.scss
├── services/
│   ├── get-started-integration.service.ts # Main integration logic
│   ├── quick-action-generator.service.ts  # Action creation from content
│   └── onboarding-progress.service.ts     # Progress tracking
└── models/
    ├── quick-action.types.ts              # Quick action data types
    ├── onboarding-progress.types.ts       # Progress tracking types
    └── learning-path.types.ts             # Learning path types
```

## Dashboard Integration Pattern

### **Current State: Mixed Implementation**

```typescript
// Current: Dashboard component contains Learning Center logic
// File: pages/dashboard/get-started/get-started.component.ts
export class GetStartedComponent {
  private learningContentService = inject(LearningContentService);
  
  // 🔴 Problem: Learning Center logic mixed with dashboard logic
  quickActions = computed(() => {
    return this.transformCategoriestoQuickActions(); // Learning Center logic
  });
  
  // 🔴 Problem: Dashboard concerns mixed with content management
  renderDashboardLayout() {
    // Dashboard-specific layout logic
    // + Learning Center integration logic mixed together
  }
}
```

### **Proposed: Clean Separation**

```typescript
// New: Clean separation of concerns
// File: pages/dashboard/get-started/get-started.component.ts
@Component({
  template: `
    <div class="dashboard-layout">
      <div class="dashboard-header">
        <h1>Get Started with FlowAccount</h1>
        <p>Set up your business and start managing your finances</p>
      </div>
      
      <!-- 🎯 Learning Center Integration Component -->
      <app-learning-center-get-started 
        [dashboardContext]="dashboardContext"
        (actionCompleted)="onActionCompleted($event)"
        (progressUpdated)="onProgressUpdated($event)">
      </app-learning-center-get-started>
      
      <div class="dashboard-footer">
        <!-- Dashboard-specific footer content -->
      </div>
    </div>
  `
})
export class GetStartedComponent {
  // 🎯 Dashboard-only concerns
  readonly dashboardContext = {
    userId: this.userService.getCurrentUserId(),
    setupStatus: this.setupService.getSetupStatus(),
    dashboardMetrics: this.metricsService.getDashboardMetrics()
  };
  
  onActionCompleted(action: QuickAction): void {
    // Handle dashboard-specific completion logic
    this.setupService.markStepCompleted(action.id);
  }
  
  onProgressUpdated(progress: OnboardingProgress): void {
    // Update dashboard progress indicators
    this.dashboardProgressService.updateProgress(progress);
  }
}
```

```typescript
// New: Learning Center Integration Component
// File: learning-center/get-started-integration/get-started-integration.component.ts
@Component({
  selector: 'app-learning-center-get-started',
  template: `
    <div class="learning-center-get-started">
      <!-- 🎯 Learning Center concerns only -->
      <div class="quick-actions-grid">
        <app-quick-action-card 
          *ngFor="let action of quickActions()"
          [action]="action"
          [progress]="getActionProgress(action.id)"
          (actionSelected)="selectAction(action)"
          (contentRequested)="showDetailedContent(action)">
        </app-quick-action-card>
      </div>
      
      <app-learning-path-preview 
        [recommendedPaths]="recommendedLearningPaths()"
        (pathSelected)="startLearningPath($event)">
      </app-learning-path-preview>
    </div>
  `
})
export class LearningCenterGetStartedComponent {
  private learningContentService = inject(LearningContentService);
  private getStartedIntegrationService = inject(GetStartedIntegrationService);
  
  @Input() dashboardContext!: DashboardContext;
  @Output() actionCompleted = new EventEmitter<QuickAction>();
  @Output() progressUpdated = new EventEmitter<OnboardingProgress>();
  
  // 🎯 Learning Center content transformation
  readonly quickActions = computed(() => 
    this.getStartedIntegrationService.generateQuickActions(
      this.learningContentService.quickGuideCategories(),
      this.dashboardContext
    )
  );
}
```

## Content Transformation System

### **Quick Guide Categories → Dashboard Actions**

```typescript
@Injectable({
  providedIn: 'root'
})
export class QuickActionGeneratorService {
  
  generateQuickActions(
    categories: QuickGuideCategory[],
    context: DashboardContext
  ): QuickAction[] {
    
    const publishedCategories = categories.filter(cat => cat.status === 'published');
    
    return publishedCategories
      .sort((a, b) => a.order - b.order)
      .map(category => this.transformCategoryToAction(category, context));
  }
  
  private transformCategoryToAction(
    category: QuickGuideCategory,
    context: DashboardContext
  ): QuickAction {
    
    const subActions = this.generateSubActions(category);
    const progress = this.calculateCategoryProgress(category, context);
    
    return {
      id: category.id,
      title: category.name,
      description: category.subtitle,
      detailedDescription: category.description,
      icon: category.icon,
      iconClass: this.getIconClassForCategory(category),
      
      // Progress and state
      completed: progress.completed,
      progress: progress.percentage,
      enabled: this.isCategoryEnabled(category, context),
      
      // Learning content
      subActions,
      estimatedTime: this.calculateTotalTime(subActions),
      difficulty: this.determineDifficulty(subActions),
      
      // Actions
      primaryAction: () => this.executePrimaryAction(category),
      secondaryActions: this.generateSecondaryActions(category),
      
      // Learning integration
      hasDetailedContent: subActions.length > 0,
      learningPath: this.generateLearningPath(category)
    };
  }
  
  private generateSubActions(category: QuickGuideCategory): SubAction[] {
    const subActions: SubAction[] = [];
    
    // Add tasks
    category.assignedTaskIds.forEach(taskId => {
      const task = this.learningContentService.getTask(taskId);
      if (task && task.status === 'published') {
        subActions.push({
          id: task.id,
          type: 'task',
          title: task.name,
          description: task.description,
          estimatedTime: task.estimatedTime,
          difficulty: task.difficulty,
          action: () => this.executeTaskAction(task)
        });
      }
    });
    
    // Add workflows
    category.assignedWorkflowIds.forEach(workflowId => {
      const workflow = this.learningContentService.getWorkflow(workflowId);
      if (workflow && workflow.status === 'published') {
        subActions.push({
          id: workflow.id,
          type: 'workflow',
          title: workflow.name,
          description: workflow.description,
          estimatedTime: workflow.estimatedTime,
          difficulty: workflow.difficulty,
          action: () => this.executeWorkflowAction(workflow)
        });
      }
    });
    
    // Add goals
    category.assignedGoalIds.forEach(goalId => {
      const goal = this.learningContentService.getGoal(goalId);
      if (goal && goal.status === 'published') {
        subActions.push({
          id: goal.id,
          type: 'goal',
          title: goal.name,
          description: goal.description,
          estimatedTime: goal.estimatedTotalTime,
          difficulty: 'intermediate', // Goals are typically intermediate
          action: () => this.executeGoalAction(goal)
        });
      }
    });
    
    return subActions.sort((a, b) => a.estimatedTime - b.estimatedTime);
  }
}
```

### **Learning Path Generation**

```typescript
export class GetStartedIntegrationService {
  
  generateRecommendedLearningPaths(
    userProfile: UserProfile,
    completedActions: string[]
  ): LearningPath[] {
    
    const availableGoals = this.learningContentService.getGoalsForProfile(
      userProfile.role,
      userProfile.businessType
    );
    
    return availableGoals
      .filter(goal => !this.isGoalCompleted(goal.id, completedActions))
      .map(goal => this.createLearningPathFromGoal(goal))
      .sort((a, b) => this.calculatePathRelevance(b, userProfile) - 
                      this.calculatePathRelevance(a, userProfile))
      .slice(0, 3); // Top 3 most relevant paths
  }
  
  private createLearningPathFromGoal(goal: LearningGoal): LearningPath {
    const workflows = this.learningContentService.getWorkflowsForGoal(goal.id);
    const steps = workflows.map(workflow => ({
      id: workflow.id,
      type: 'workflow' as const,
      title: workflow.name,
      description: workflow.description,
      estimatedTime: workflow.estimatedTime,
      completed: this.isWorkflowCompleted(workflow.id)
    }));
    
    return {
      id: goal.id,
      title: goal.name,
      description: goal.description,
      businessValue: goal.businessValue,
      estimatedTotalTime: goal.estimatedTotalTime,
      steps,
      progress: this.calculatePathProgress(steps),
      priority: goal.priority,
      difficulty: this.calculatePathDifficulty(workflows)
    };
  }
}
```

## Progress Tracking and Analytics

### **Onboarding Progress Service**

```typescript
@Injectable({
  providedIn: 'root'
})
export class OnboardingProgressService {
  private progressSubject = new BehaviorSubject<OnboardingProgress | null>(null);
  
  readonly currentProgress = computed(() => this.progressSubject.value);
  readonly completionPercentage = computed(() => {
    const progress = this.currentProgress();
    return progress ? (progress.completedActions.length / progress.totalActions) * 100 : 0;
  });
  
  initializeProgress(userId: string): void {
    const savedProgress = this.loadProgressFromStorage(userId);
    const currentProgress = savedProgress || this.createInitialProgress(userId);
    
    this.progressSubject.next(currentProgress);
  }
  
  markActionCompleted(actionId: string, timeSpent?: number): void {
    const current = this.progressSubject.value;
    if (!current) return;
    
    const completedAction: CompletedAction = {
      actionId,
      completedAt: new Date(),
      timeSpent: timeSpent || 0
    };
    
    const updated: OnboardingProgress = {
      ...current,
      completedActions: [...current.completedActions, completedAction],
      lastActivity: new Date(),
      totalTimeSpent: current.totalTimeSpent + (timeSpent || 0)
    };
    
    this.progressSubject.next(updated);
    this.saveProgressToStorage(updated);
    
    // Analytics tracking
    this.analyticsService.trackOnboardingActionCompleted({
      userId: current.userId,
      actionId,
      timeSpent,
      progressPercentage: this.calculateProgressPercentage(updated)
    });
  }
  
  getRecommendedNextActions(limit: number = 3): QuickAction[] {
    const progress = this.currentProgress();
    if (!progress) return [];
    
    const completedActionIds = progress.completedActions.map(a => a.actionId);
    const availableActions = this.getStartedIntegrationService
      .getAllAvailableActions()
      .filter(action => !completedActionIds.includes(action.id));
    
    // Sort by recommended priority
    return availableActions
      .sort((a, b) => this.calculateActionPriority(b, progress) - 
                      this.calculateActionPriority(a, progress))
      .slice(0, limit);
  }
}
```

### **Analytics Integration**

```typescript
interface OnboardingAnalytics {
  // Completion metrics
  averageCompletionTime: number;
  completionRate: number;
  dropOffPoints: string[];
  
  // User behavior
  mostCompletedActions: string[];
  averageActionsPerSession: number;
  returnUserRate: number;
  
  // Learning path effectiveness
  pathCompletionRates: Record<string, number>;
  contentEngagementRates: Record<string, number>;
  helpRequestsByAction: Record<string, number>;
  
  // User segmentation
  completionByRole: Record<UserRole, number>;
  completionByBusinessType: Record<BusinessType, number>;
  timeToValueBySegment: Record<string, number>;
}
```

## User Experience Flow

### **Complete Onboarding Journey**

```typescript
// 1. User arrives at Get Started page
const onboardingJourney = {
  
  // Entry point
  dashboardEntry: {
    page: '/dashboard/get-started',
    component: 'GetStartedComponent (Dashboard)',
    learningIntegration: 'LearningCenterGetStartedComponent',
    userState: 'new-user' | 'returning-user' | 'advanced-user'
  },
  
  // Quick action selection
  actionSelection: {
    availableActions: 'QuickAction[]', // Generated from Quick Guide Categories
    personalization: 'Based on user role and business type',
    progressIndicators: 'Visual completion status',
    estimatedTime: 'Total time and per-action estimates'
  },
  
  // Action execution options
  actionExecution: {
    quickCompletion: 'Mark as done without detailed learning',
    detailedLearning: 'Open Learning Center Panel with full content',
    guidedWorkflow: 'Step-by-step workflow execution',
    learningPath: 'Start comprehensive goal-based learning'
  },
  
  // Learning Center integration
  learningIntegration: {
    panelOpen: 'Context-specific content for selected action',
    contentDisplay: 'Tasks, workflows, or goals related to action',
    aiAssistance: 'AI help for specific questions during action',
    progressTracking: 'Real-time completion status updates'
  },
  
  // Completion and next steps
  completionFlow: {
    actionCompleted: 'Mark action as done, update progress',
    nextRecommendations: 'Suggest related actions or learning paths',
    learningPathProgression: 'Continue with advanced topics',
    graduationToExpert: 'Transition to advanced features and workflows'
  }
};
```

### **Integration Touch Points**

```typescript
export class LearningCenterGetStartedComponent {
  
  // Dashboard → Learning Center Panel
  showDetailedContent(action: QuickAction): void {
    // Open Learning Center Panel with action-specific content
    this.learningPanelService.openPanelWithContent({
      contentId: action.primaryContentId,
      context: {
        source: 'get-started-action',
        actionId: action.id,
        userIntent: 'detailed-learning'
      }
    });
  }
  
  // Get Started → Learning Center Content Finder
  exploreRelatedContent(action: QuickAction): void {
    // Open Content Finder with pre-filtered results
    this.contentFinderService.openWithFilters({
      category: action.category,
      tags: action.tags,
      difficulty: ['beginner', 'intermediate'],
      context: {
        source: 'get-started-exploration',
        actionId: action.id
      }
    });
  }
  
  // Get Started → AI Assistant
  askAIAboutAction(action: QuickAction): void {
    // Initialize AI conversation with action context
    this.aiAssistantService.startConversationWithContext({
      userMessage: `Help me understand how to ${action.title.toLowerCase()}`,
      context: {
        currentAction: action,
        userProgress: this.onboardingProgressService.currentProgress(),
        source: 'get-started-ai-help'
      }
    });
    
    // Switch panel to AI mode
    this.learningPanelService.switchToAIMode();
  }
  
  // Learning Path Integration
  startLearningPath(path: LearningPath): void {
    // Initialize comprehensive learning journey
    this.learningProgressService.startGoal(path.id, path.steps.map(s => s.id));
    
    // Open first step in Learning Center Panel
    this.learningPanelService.openPanelWithContent({
      contentId: path.steps[0].id,
      context: {
        source: 'learning-path-start',
        pathId: path.id,
        stepIndex: 0
      }
    });
  }
}
```

## Content Management Integration

### **Admin Experience**

```typescript
// Admin creates/updates content through Learning Center Admin
// Content automatically appears in Get Started page
const adminWorkflow = {
  
  // 1. Admin creates Quick Guide Category
  createCategory: {
    name: "Sales Essentials",
    subtitle: "Master core selling features",
    description: "Create quotations, billing notes, and tax invoices",
    icon: "point_of_sale",
    order: 2,
    status: "published"
  },
  
  // 2. Admin assigns learning content
  assignContent: {
    tasks: ["create-first-quotation", "add-products-to-quote"],
    workflows: ["complete-quotation-process"],
    goals: ["improve-sales-efficiency"]
  },
  
  // 3. Content automatically appears in Get Started
  getStartedDisplay: {
    quickAction: {
      title: "Sales Essentials",
      description: "Master core selling features", 
      subActions: [
        "Create First Quotation (5 min)",
        "Add Products to Quote (3 min)",
        "Complete Quotation Process (15 min)",
        "Improve Sales Efficiency (Goal)"
      ]
    }
  },
  
  // 4. Users interact with content
  userInteraction: {
    progressTracking: "Automatic completion tracking",
    analytics: "Usage metrics flow back to admin",
    contentOptimization: "Data-driven content improvements"
  }
};
```

### **Content Synchronization**

```typescript
export class GetStartedIntegrationService {
  
  constructor(
    private learningContentService: LearningContentService
  ) {
    // React to content updates
    this.learningContentService.contentUpdates$.subscribe(() => {
      this.refreshQuickActions();
      this.updateProgressCalculations();
      this.invalidateCache();
    });
  }
  
  private refreshQuickActions(): void {
    // Regenerate quick actions when content changes
    const categories = this.learningContentService.quickGuideCategories();
    this.quickActionsSubject.next(
      this.quickActionGeneratorService.generateQuickActions(
        categories,
        this.currentDashboardContext
      )
    );
  }
}
```

## Technical Implementation

### **Main Integration Component**

```typescript
@Component({
  selector: 'app-learning-center-get-started',
  templateUrl: './get-started-integration.component.html',
  styleUrls: ['./get-started-integration.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    QuickActionCardComponent,
    ProgressIndicatorComponent,
    LearningPathPreviewComponent,
    ContentRecommendationsComponent
  ]
})
export class LearningCenterGetStartedComponent implements OnInit {
  private getStartedIntegrationService = inject(GetStartedIntegrationService);
  private onboardingProgressService = inject(OnboardingProgressService);
  private learningPanelService = inject(LearningPanelService);
  
  @Input() dashboardContext!: DashboardContext;
  @Output() actionCompleted = new EventEmitter<QuickAction>();
  @Output() progressUpdated = new EventEmitter<OnboardingProgress>();
  
  // Quick actions from Learning Center content
  readonly quickActions = computed(() => 
    this.getStartedIntegrationService.generateQuickActions(
      this.learningContentService.quickGuideCategories(),
      this.dashboardContext
    )
  );
  
  // User progress tracking
  readonly currentProgress = this.onboardingProgressService.currentProgress;
  readonly completionPercentage = this.onboardingProgressService.completionPercentage;
  
  // Personalized recommendations
  readonly recommendedLearningPaths = computed(() =>
    this.getStartedIntegrationService.generateRecommendedLearningPaths(
      this.dashboardContext.userProfile,
      this.currentProgress()?.completedActions.map(a => a.actionId) || []
    )
  );
  
  readonly nextRecommendedActions = computed(() =>
    this.onboardingProgressService.getRecommendedNextActions(3)
  );
  
  ngOnInit(): void {
    // Initialize progress tracking
    this.onboardingProgressService.initializeProgress(
      this.dashboardContext.userId
    );
    
    // Listen for progress updates
    this.currentProgress.subscribe(progress => {
      if (progress) {
        this.progressUpdated.emit(progress);
      }
    });
  }
  
  selectAction(action: QuickAction): void {
    // Track action selection
    this.analyticsService.trackGetStartedActionSelected({
      actionId: action.id,
      source: 'quick-action-card',
      userContext: this.dashboardContext
    });
    
    // Execute primary action
    if (action.primaryAction) {
      action.primaryAction();
    }
  }
  
  markActionCompleted(action: QuickAction, timeSpent?: number): void {
    // Update progress
    this.onboardingProgressService.markActionCompleted(action.id, timeSpent);
    
    // Emit completion event for dashboard
    this.actionCompleted.emit(action);
    
    // Show completion feedback
    this.showCompletionFeedback(action);
  }
  
  showDetailedContent(action: QuickAction): void {
    // Open Learning Center Panel with detailed content
    this.learningPanelService.openPanelWithContent({
      contentId: action.primaryContentId || action.subActions[0]?.id,
      context: {
        source: 'get-started-detailed-learning',
        actionId: action.id,
        userIntent: 'comprehensive-learning'
      }
    });
  }
  
  startLearningPath(path: LearningPath): void {
    // Begin comprehensive learning journey
    this.learningProgressService.startGoal(
      path.id, 
      path.steps.map(step => step.id)
    );
    
    // Open first step in panel
    this.learningPanelService.openPanelWithContent({
      contentId: path.steps[0].id,
      context: {
        source: 'learning-path-start',
        pathId: path.id,
        stepIndex: 0,
        totalSteps: path.steps.length
      }
    });
    
    // Track learning path start
    this.analyticsService.trackLearningPathStarted({
      pathId: path.id,
      source: 'get-started-integration',
      userContext: this.dashboardContext
    });
  }
}
```

## Future Enhancements

### **Phase 1 (MVP)**
- ✅ Dynamic quick action generation from Learning Center content
- ✅ Basic progress tracking and completion status
- ✅ Integration with Learning Center Panel for detailed content
- ✅ Clean separation from dashboard component

### **Phase 2 (Enhanced Personalization)**
- 🔄 Advanced user profiling and content personalization
- 🔄 Learning path recommendations based on user behavior
- 🔄 A/B testing for different onboarding approaches
- 🔄 Social proof and completion metrics

### **Phase 3 (Intelligent Onboarding)**
- 📋 AI-powered onboarding recommendations
- 📋 Adaptive learning paths based on user progress and preferences
- 📋 Predictive analytics for completion likelihood
- 📋 Automated content optimization based on user success

### **Phase 4 (Advanced Features)**
- 📋 Multi-session onboarding journeys
- 📋 Cross-device progress synchronization
- 📋 Team/organization onboarding workflows
- 📋 Integration with business intelligence and success metrics

---

**The Learning Center Get Started Integration transforms the static dashboard onboarding experience into a dynamic, content-driven system that adapts to user needs while maintaining clean architectural separation between dashboard and learning concerns.**