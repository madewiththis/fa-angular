# Task: Create Learning Center Walkthrough Experience
**Date**: 2025-01-23 | **Complexity**: L | **Status**: todo
**Component**: Learning Center integration with Quick Start actions
**Strategic Context**: Part of [Onboarding Strategy Master Plan](../../context/onboarding-strategy-master-plan.md) - Solution 2: Guided Learning

## Problem Statement
Need to create a walkthrough experience that integrates with the Quick Start menu actions. When users click on actions like "Start selling to customers", they should get a Learning Center experience that opens the learning panel and offers two options:
1. "Here's a step-by-step guide" (text-based instructions)
2. "A video you can follow along with" (video tutorial)

## Requirements
- **Learning Panel Integration**: Use existing LearningPanelService to open and manage state
- **Default Content**: Create one universal walkthrough that applies to all Quick Start actions for now
- **Two Learning Modes**: Step-by-step guide and video tutorial options
- **Professional UX**: "Let's do this thing" messaging with clear call-to-action

## Current Understanding
### Existing Architecture
- **LearningPanelService**: Manages panel state with signals (`isOpen`, `view`, `activeGoal`, etc.)
- **Goal System**: Complete BusinessGoal → GoalWorkflow → WorkflowTask structure
- **Goal Library**: Sample goals with detailed instructions, video references, and completion validation
- **Learning Panel State**: Views include `goal_overview`, `workflow_list`, `task_guidance`, `progress_summary`

### Integration Points
- **Get Started Component**: Quick actions currently call placeholder methods like `createQuote()`, `createInvoice()`
- **Learning Panel Service**: Already injected in get-started component
- **Goal-Based System**: Ready to use for structured learning experiences

## Implementation Plan

### Phase 1: Default Walkthrough Content
- [ ] Create a universal BusinessGoal for "Getting Started with FlowAccount"
- [ ] Include workflows for common tasks (quotes, invoices, expenses, etc.)
- [ ] Add step-by-step instructions with proper TaskInstructions format
- [ ] Include video tutorial references

### Phase 2: Learning Panel Integration
- [ ] Modify Quick Start action handlers to launch learning experiences
- [ ] Update action methods to call `learningPanelService.startGoalEvaluation()`
- [ ] Ensure learning panel opens with appropriate content

### Phase 3: Two-Mode Experience
- [ ] Create initial experience with "Let's do this thing" messaging
- [ ] Present two options: "Step-by-step guide" vs "Video tutorial"
- [ ] Handle user selection and navigate to appropriate learning mode

### Phase 4: Enhanced UX
- [ ] Improve learning panel UI to match design requirements
- [ ] Add proper navigation between learning modes
- [ ] Implement completion tracking and progress indicators

## Technical Approach

### Default Goal Structure
```typescript
const DEFAULT_WALKTHROUGH_GOAL: BusinessGoal = {
  id: 'getting_started_walkthrough',
  name: 'Getting Started with FlowAccount',
  description: 'Learn the essential features to get your business up and running',
  // Universal applicability
  applicableRoles: ['owner', 'administrator', 'accountant', 'staff', 'accounting_firm', 'freelancer'],
  applicableBusinessTypes: ['service', 'product', 'mixed', 'freelance', 'e_commerce', 'retail', 'restaurant', 'consulting'],
  workflows: [
    // Workflow for quotes, invoices, etc.
  ]
}
```

### Action Integration Pattern
```typescript
// Replace current placeholder methods
createQuote(): void {
  const goal = getDefaultWalkthroughGoal();
  const workflow = goal.workflows.find(w => w.id === 'create_quote_workflow');
  this.learningPanelService.startGoalEvaluation(goal, workflow);
}
```

### Learning Mode Selection
- **Initial View**: Welcome message with two buttons
- **Step-by-step**: Use existing `task_guidance` view with TaskInstructions
- **Video**: Custom view or enhanced `task_guidance` with video player integration

## Files to Modify
- `src/app/data/goal-library.ts` - Add default walkthrough goal
- `src/app/pages/dashboard/get-started/get-started.component.ts` - Update action handlers
- `src/app/services/learning-panel.service.ts` - Potentially enhance for initial selection
- Learning panel component files (need to locate and examine)

## Success Criteria
- [ ] Clicking any Quick Start action opens the learning panel
- [ ] Learning panel shows "Let's do this thing" welcome message
- [ ] User can choose between step-by-step guide and video tutorial
- [ ] Both learning modes display appropriate content
- [ ] Navigation between modes works smoothly
- [ ] **Explicit user (project owner) quality/UX check and approval**

## AI Handoff State
**Complete context for continuation:**
- **Current phase**: Planning and architecture understanding
- **Files examined**: LearningPanelService, goal-system interfaces, goal-library data
- **Key insights**: Complete learning system already exists, need to create default content and integrate
- **Next actions**: Create default walkthrough goal, modify action handlers, test integration
- **Open questions**: Need to locate and examine learning panel component files

## Status Log
- 2025-01-23: todo - Task created to implement Learning Center walkthrough experience with step-by-step and video options