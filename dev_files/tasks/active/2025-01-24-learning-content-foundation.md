# Task: Learning Content Foundation System (Goals → Workflows → Tasks)
**Date**: 2025-01-24 | **Complexity**: L | **Status**: todo
**Component**: Core learning content management system
**Strategic Context**: Foundation for ALL onboarding solutions in [Onboarding Strategy Master Plan](../../context/onboarding-strategy-master-plan.md)

## Problem Statement
We need a robust, maintainable system for structuring educational content that can be used across all onboarding experiences. The system must be flexible enough to support different presentation styles (quick actions, guided walkthroughs, goal-based evaluation) while maintaining consistent content.

## Vision: Universal Learning Content Architecture

### Core Principles
1. **Separation of Concerns**: Content (what to teach) separate from presentation (how to display)
2. **Reusability**: Same task can appear in multiple workflows, same workflow in multiple goals
3. **Maintainability**: Easy to update task instructions without breaking multiple features
4. **Scalability**: Can grow from 10 tasks to 1000+ without architectural changes
5. **Flexibility**: Supports different learning styles and user preferences

### System Architecture

```
┌─────────────────┐
│     GOALS       │  Business outcomes users want to achieve
│                 │  (e.g., "Improve Cash Flow")
└────────┬────────┘
         │ 1:many
┌────────▼────────┐
│   WORKFLOWS     │  Processes that contribute to goals
│                 │  (e.g., "Quote Follow-up Process")
└────────┬────────┘
         │ 1:many
┌────────▼────────┐
│     TASKS       │  Specific actions users complete
│                 │  (e.g., "Send follow-up reminder")
└─────────────────┘
```

## Implementation Plan

### Phase 1: Core Data Models & Infrastructure
- [ ] Design comprehensive data models for Goals, Workflows, Tasks
- [ ] Create relationship management system (many-to-many support)
- [ ] Build content versioning system for updates
- [ ] Implement validation rules for content integrity
- [ ] Create TypeScript interfaces and services

### Phase 2: Content Management Tools
- [ ] Build admin interface for CRUD operations
- [ ] Create bulk import/export functionality
- [ ] Implement content preview system
- [ ] Add search and filtering capabilities
- [ ] Create content validation reports

### Phase 3: Integration APIs
- [ ] Design consumer-agnostic API for content retrieval
- [ ] Create adapters for different UI presentations
- [ ] Build progress tracking system
- [ ] Implement completion validation framework
- [ ] Add analytics integration points

### Phase 4: Content Library
- [ ] Audit existing tutorials and guides
- [ ] Create initial content library (20-30 core tasks)
- [ ] Define standard workflows for common use cases
- [ ] Map goals to user personas and business types
- [ ] Establish content quality guidelines

## Detailed System Design

### Data Models

```typescript
// Core content entities
interface LearningTask {
  id: string;
  name: string;
  description: string;
  estimatedTime: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Content
  instructions: TaskInstructions;
  videoUrl?: string;
  interactiveDemo?: DemoConfig;
  
  // Validation
  completionCriteria: CompletionCriteria;
  prerequisites?: string[]; // task IDs
  
  // Metadata
  tags: string[];
  lastUpdated: Date;
  version: number;
}

interface LearningWorkflow {
  id: string;
  name: string;
  description: string;
  outcome: string; // What user achieves
  
  // Task management
  taskIds: string[]; // Ordered list
  taskSequence: 'sequential' | 'parallel' | 'flexible';
  
  // Metadata
  estimatedTime: number; // sum of tasks
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface LearningGoal {
  id: string;
  name: string;
  description: string;
  businessValue: string;
  
  // Workflow management
  workflowIds: string[];
  requiredWorkflows: string[]; // Must complete
  optionalWorkflows: string[]; // Nice to have
  
  // Targeting
  applicableRoles: UserRole[];
  applicableBusinessTypes: BusinessType[];
  
  // Success metrics
  successIndicators: string[];
  estimatedROI?: string;
}
```

### Content Management Features

1. **Version Control**
   - Track changes to task instructions
   - Rollback capability for content updates
   - Change history and audit trail

2. **Relationship Management**
   - Many-to-many task-workflow relationships
   - Dependency tracking between tasks
   - Goal composition flexibility

3. **Content Validation**
   - Ensure no orphaned tasks
   - Validate prerequisite chains
   - Check time estimates accuracy

4. **Localization Support**
   - Multi-language content structure
   - Cultural adaptation markers
   - Regional workflow variations

### Integration Patterns

```typescript
// Example: Quick Start Actions using the system
async function getQuickStartTask(action: string): Promise<LearningTask> {
  const task = await learningContentService.getTaskByTag(action);
  return task;
}

// Example: Goal-based evaluation using the system  
async function getPersonalizedGoals(profile: UserProfile): Promise<LearningGoal[]> {
  const goals = await learningContentService.getGoalsForProfile(profile);
  return goals;
}

// Example: Learning Center walkthrough using the system
async function getWorkflowTasks(workflowId: string): Promise<LearningTask[]> {
  const workflow = await learningContentService.getWorkflow(workflowId);
  const tasks = await learningContentService.getTasks(workflow.taskIds);
  return tasks;
}
```

## Success Criteria
- [ ] Content can be updated without code changes
- [ ] Same task can be used in multiple contexts
- [ ] New workflows can be created by combining existing tasks
- [ ] Analytics show which content is most effective
- [ ] Content stays in sync across all features
- [ ] Non-technical users can manage content
- [ ] System scales to 1000+ tasks without performance issues
- [ ] **Explicit user (project owner) quality/UX check and approval**

## Technical Considerations

### Storage Strategy
- **Option 1**: Static JSON files (simple, version controlled)
- **Option 2**: localStorage/IndexedDB (offline capable)
- **Option 3**: External CMS integration (future)

### Performance Optimization
- Lazy load content as needed
- Cache frequently accessed items
- Implement content CDN for media

### Analytics Integration
- Track task completion rates
- Measure time-to-complete
- Identify drop-off points
- A/B test different instructions

## Subtasks for Implementation

1. **Data Model Design** (S)
   - Define TypeScript interfaces
   - Create relationship schemas
   - Design validation rules

2. **Service Layer** (M)
   - Build LearningContentService
   - Implement CRUD operations
   - Add search/filter capabilities

3. **Content Loading System** (S)
   - Create JSON structure
   - Build import mechanism
   - Add validation checks

4. **Integration Adapters** (M)
   - Quick Start adapter
   - Learning Center adapter
   - Goal evaluation adapter

5. **Admin Interface** (L)
   - Content management UI
   - Relationship builder
   - Preview system

6. **Initial Content** (M)
   - Audit existing tutorials
   - Create 20-30 core tasks
   - Define 5-10 workflows

## AI Handoff State
**Current Understanding**: 
- Need to create a foundational content system for all onboarding experiences
- Goals → Workflows → Tasks hierarchy is the core structure
- System must be reusable across different UI presentations
- Focus on maintainability and scalability

**Next Steps**:
1. Review and refine data models
2. Create TypeScript interfaces
3. Build basic service layer
4. Test with sample content

**Key Decisions Needed**:
- Storage mechanism (static vs dynamic)
- Admin interface priority
- Content creation workflow

## Status Log
- 2025-01-24: todo - Task created to develop foundational learning content system