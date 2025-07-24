# Learning Center - Standalone Module

## Overview

The Learning Center is a completely self-contained module that implements the Goals → Workflows → Tasks learning system for FlowAccount. It's designed to be easily portable to any Angular application with minimal integration requirements.

## Architecture

```
learning-center/
├── README.md                    # This documentation
├── index.ts                     # Public API exports
├── models/                      # TypeScript interfaces
│   └── learning-content.types.ts
├── services/                    # Business logic services
│   └── learning-content.service.ts
├── data/                        # Content storage
│   └── learning-content-library.ts
├── components/                  # UI components
│   ├── learning-center-main/    # Main container component
│   ├── goal-selector/           # Goal selection interface
│   ├── workflow-display/        # Workflow presentation
│   ├── task-guidance/           # Individual task guidance
│   └── progress-tracker/        # Progress visualization
└── adapters/                    # Integration utilities
    ├── quick-start.adapter.ts   # For dashboard quick actions
    ├── goal-evaluation.adapter.ts # For goal-based onboarding
    └── walkthrough.adapter.ts   # For guided tours
```

## Core Concepts

### Goals → Workflows → Tasks Hierarchy
- **Goals**: High-level business objectives (e.g., "Improve Cash Flow")
- **Workflows**: Process-based sequences that achieve goals (e.g., "Quotation Follow-Up Process")
- **Tasks**: Atomic learning units with step-by-step instructions

### Content Management
- All content stored in JSON format for easy updates
- Versioning system for content evolution
- Status management (draft, published, archived)
- Progress tracking with local storage persistence

### Adaptive Presentation
- Same content can be presented in different formats:
  - Quick Start actions (dashboard integration)
  - Goal-based evaluation (onboarding flow)
  - Detailed walkthroughs (learning center)
  - Progress-driven recommendations

## Integration Guide

### 1. Installation
Copy the entire `learning-center/` folder to your Angular application's components directory.

### 2. Import Module
```typescript
import { LearningCenterModule } from './components/learning-center';
```

### 3. Basic Usage
```typescript
// In your component
import { LearningContentService } from './components/learning-center';

@Component({...})
export class YourComponent {
  constructor(private learningService: LearningContentService) {}
  
  // Get recommended goals for user
  getRecommendations() {
    return this.learningService.getRecommendations({
      userRole: 'owner',
      businessType: 'service'
    });
  }
}
```

### 4. Adapter Usage
```typescript
// For quick start integration
import { QuickStartAdapter } from './components/learning-center/adapters';

const quickStart = new QuickStartAdapter(learningService);
const actions = quickStart.getPopularActions();
```

## Dependencies

### Required Angular Features
- Angular 17+ (for control flow syntax)
- Standalone components
- Angular Signals (optional, for reactive state)

### External Dependencies
- RxJS (for reactive patterns)
- No additional external libraries required

### Material Design (Optional)
- If using Angular Material, components will automatically integrate
- Pure CSS fallbacks provided for non-Material environments

## Configuration

### Content Updates
Update content by modifying `data/learning-content-library.ts`. No code changes required for:
- Adding new tasks, workflows, or goals
- Updating instructions or descriptions
- Changing difficulty levels or time estimates
- Modifying user targeting criteria

### Customization
- Override SCSS variables for theming
- Replace adapter implementations for different presentation styles
- Extend interfaces for additional metadata fields

## Production Considerations

### Performance
- Lazy loading supported for large content libraries
- Local storage for progress persistence
- Minimal runtime overhead

### Scalability
- Content library designed to handle 1000+ learning items
- Efficient search and filtering algorithms
- Progress tracking optimized for frequent updates

### Maintenance
- Content validation utilities prevent broken references
- Version control system for content evolution
- Clear separation between content and presentation logic

## API Reference

### Core Service Methods
```typescript
// Content retrieval
getGoal(goalId: string): LearningGoal | null
getWorkflowsForGoal(goalId: string): LearningWorkflow[]
getTasksForWorkflow(workflowId: string): LearningTask[]

// Progress tracking
startGoal(goalId: string, workflowIds: string[]): void
completeTask(taskId: string, workflowId: string, goalId: string): void
getGoalProgress(goalId: string): ProgressSummary

// Search and recommendations
searchContent(query: ContentSearchQuery): ContentSearchResult[]
getRecommendations(context: RecommendationContext): LearningRecommendation[]
```

### Adapter Interfaces
```typescript
interface PresentationAdapter {
  name: string;
  getContent(params: any): Promise<any>;
  transformContent(content: LearningContent): any;
  trackProgress(progressData: any): void;
}
```

## Support

### Troubleshooting
- Check browser console for validation errors
- Verify content integrity with built-in validation
- Review localStorage for progress persistence issues

### Extending the System
- Add new content types by extending base interfaces
- Create custom adapters for specific presentation needs
- Implement custom progress tracking for advanced analytics

---

*This module was developed as part of the FlowAccount onboarding strategy to provide flexible, maintainable learning experiences that can adapt to different user needs and presentation contexts.*