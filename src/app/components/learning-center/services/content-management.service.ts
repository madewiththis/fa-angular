import { Injectable, signal } from '@angular/core';
import { LearningContentService } from './learning-content.service';
import {
  LearningTask,
  LearningWorkflow,
  LearningGoal,
  ContentValidationResult,
  DifficultyLevel,
  ContentStatus,
  ContentAttachments
} from '../models/learning-content.types';

export interface TaskFormData {
  name: string;
  description: string;
  outcome: string;
  estimatedTime: number;
  difficulty: DifficultyLevel;
  category: string;
  tags: string[];
  featureLink?: {
    mainFeature: string;
    subFeature?: string;
    route: string;
    displayLocation: string[];
  };
  contentAttachments: ContentAttachments;
  instructions: {
    overview: string;
    steps: Array<{
      title: string;
      description: string;
      action: string;
      target?: string;
      inputValue?: string;
    }>;
    expectedResult: string;
  };
  completionCriteria: {
    type: 'automatic' | 'user_confirmation' | 'system_check';
    criteria: Array<{
      field: string;
      operator: string;
      expectedValue: any;
    }>;
  };
  tips?: string[];
  troubleshooting?: Array<{
    commonIssue: string;
    solution: string;
  }>;
  prerequisites?: string[];
  status: ContentStatus;
}

export interface WorkflowFormData {
  name: string;
  description: string;
  outcome: string;
  businessValue: string;
  category: string;
  contentAttachments: ContentAttachments;
  taskIds: string[];
  taskSequence: 'sequential' | 'parallel' | 'flexible';
  prerequisites?: string[];
  completionCriteria: string;
  successIndicators?: string[];
  expectedROI?: string;
  status: ContentStatus;
}

export interface GoalFormData {
  name: string;
  description: string;
  businessValue: string;
  priority: number;
  contentAttachments: ContentAttachments;
  workflowIds: string[];
  requiredWorkflows: string[];
  optionalWorkflows: string[];
  applicableRoles: string[];
  applicableBusinessTypes: string[];
  successMetrics: string[];
  expectedOutcome: string;
  status: ContentStatus;
}

@Injectable({
  providedIn: 'root'
})
export class ContentManagementService {
  // Editing states
  private _isEditing = signal<boolean>(false);
  private _editingItemType = signal<'task' | 'workflow' | 'goal' | null>(null);
  private _editingItemId = signal<string | null>(null);
  private _validationResults = signal<ContentValidationResult | null>(null);

  // Public readonly signals
  readonly isEditing = this._isEditing.asReadonly();
  readonly editingItemType = this._editingItemType.asReadonly();
  readonly editingItemId = this._editingItemId.asReadonly();
  readonly validationResults = this._validationResults.asReadonly();

  constructor(private learningContentService: LearningContentService) {}

  // ===== TASK MANAGEMENT =====

  /**
   * Create new task
   */
  async createTask(formData: TaskFormData): Promise<LearningTask> {
    const taskData: Omit<LearningTask, 'id' | 'version' | 'lastUpdated'> = {
      name: formData.name,
      description: formData.description,
      outcome: formData.outcome,
      estimatedTime: formData.estimatedTime,
      difficulty: formData.difficulty,
      instructions: {
        overview: formData.instructions.overview,
        steps: formData.instructions.steps.map((step, index) => ({
          stepNumber: index + 1,
          title: step.title,
          description: step.description,
          action: step.action as any,
          target: step.target,
          inputValue: step.inputValue
        })),
        expectedResult: formData.instructions.expectedResult
      },
      completionCriteria: {
        type: formData.completionCriteria.type,
        criteria: formData.completionCriteria.criteria.map(c => ({
          field: c.field,
          operator: c.operator as any,
          expectedValue: c.expectedValue
        }))
      },
      prerequisites: formData.prerequisites,
      tips: formData.tips,
      troubleshooting: formData.troubleshooting?.map(t => ({
        commonIssue: t.commonIssue,
        solution: t.solution,
        severity: 'medium' as const
      })),
      tags: formData.tags,
      category: formData.category,
      featureLink: formData.featureLink,
      contentAttachments: formData.contentAttachments,
      status: formData.status
    };

    return await this.learningContentService.createTask(taskData);
  }

  /**
   * Update existing task
   */
  async updateTask(taskId: string, formData: TaskFormData): Promise<LearningTask | null> {
    const updates: Partial<LearningTask> = {
      name: formData.name,
      description: formData.description,
      outcome: formData.outcome,
      estimatedTime: formData.estimatedTime,
      difficulty: formData.difficulty,
      instructions: {
        overview: formData.instructions.overview,
        steps: formData.instructions.steps.map((step, index) => ({
          stepNumber: index + 1,
          title: step.title,
          description: step.description,
          action: step.action as any,
          target: step.target,
          inputValue: step.inputValue
        })),
        expectedResult: formData.instructions.expectedResult
      },
      completionCriteria: {
        type: formData.completionCriteria.type,
        criteria: formData.completionCriteria.criteria.map(c => ({
          field: c.field,
          operator: c.operator as any,
          expectedValue: c.expectedValue
        }))
      },
      prerequisites: formData.prerequisites,
      tips: formData.tips,
      troubleshooting: formData.troubleshooting?.map(t => ({
        commonIssue: t.commonIssue,
        solution: t.solution,
        severity: 'medium' as const
      })),
      tags: formData.tags,
      category: formData.category,
      featureLink: formData.featureLink,
      contentAttachments: formData.contentAttachments,
      status: formData.status
    };

    return await this.learningContentService.updateTask(taskId, updates);
  }

  /**
   * Delete task
   */
  async deleteTask(taskId: string): Promise<boolean> {
    // First check if task is used in any workflows
    const workflows = this.learningContentService.workflows();
    const dependentWorkflows = workflows.filter(w => w.taskIds.includes(taskId));
    
    if (dependentWorkflows.length > 0) {
      throw new Error(`Cannot delete task. It is used in workflows: ${dependentWorkflows.map(w => w.name).join(', ')}`);
    }

    return await this.learningContentService.deleteTask(taskId);
  }

  /**
   * Get task form data for editing
   */
  getTaskFormData(taskId: string): TaskFormData | null {
    const task = this.learningContentService.getTask(taskId);
    if (!task) return null;

    return {
      name: task.name,
      description: task.description,
      outcome: task.outcome,
      estimatedTime: task.estimatedTime,
      difficulty: task.difficulty,
      category: task.category || '',
      tags: task.tags,
      featureLink: task.featureLink,
      instructions: {
        overview: task.instructions.overview,
        steps: task.instructions.steps.map(step => ({
          title: step.title,
          description: step.description,
          action: step.action,
          target: step.target,
          inputValue: step.inputValue
        })),
        expectedResult: task.instructions.expectedResult
      },
      completionCriteria: {
        type: task.completionCriteria.type,
        criteria: task.completionCriteria.criteria.map(c => ({
          field: c.field,
          operator: c.operator,
          expectedValue: c.expectedValue
        }))
      },
      tips: task.tips,
      troubleshooting: task.troubleshooting?.map(t => ({
        commonIssue: t.commonIssue,
        solution: t.solution
      })),
      prerequisites: task.prerequisites,
      contentAttachments: task.contentAttachments,
      status: task.status
    };
  }

  // ===== WORKFLOW MANAGEMENT =====

  /**
   * Create new workflow
   */
  async createWorkflow(formData: WorkflowFormData): Promise<LearningWorkflow> {
    const workflowData: Omit<LearningWorkflow, 'id' | 'version' | 'lastUpdated' | 'estimatedTime' | 'difficulty'> = {
      name: formData.name,
      description: formData.description,
      outcome: formData.outcome,
      businessValue: formData.businessValue,
      contentAttachments: formData.contentAttachments,
      taskIds: formData.taskIds,
      taskSequence: formData.taskSequence,
      category: formData.category,
      prerequisites: formData.prerequisites,
      completionCriteria: formData.completionCriteria,
      successIndicators: formData.successIndicators,
      expectedROI: formData.expectedROI,
      status: formData.status
    };

    return await this.learningContentService.createWorkflow(workflowData);
  }

  /**
   * Update existing workflow
   */
  async updateWorkflow(workflowId: string, formData: WorkflowFormData): Promise<LearningWorkflow | null> {
    const updates: Partial<LearningWorkflow> = {
      name: formData.name,
      description: formData.description,
      outcome: formData.outcome,
      businessValue: formData.businessValue,
      contentAttachments: formData.contentAttachments,
      taskIds: formData.taskIds,
      taskSequence: formData.taskSequence,
      category: formData.category,
      prerequisites: formData.prerequisites,
      completionCriteria: formData.completionCriteria,
      successIndicators: formData.successIndicators,
      expectedROI: formData.expectedROI,
      status: formData.status
    };

    return await this.learningContentService.updateWorkflow(workflowId, updates);
  }

  /**
   * Delete workflow
   */
  async deleteWorkflow(workflowId: string): Promise<boolean> {
    // First check if workflow is used in any goals
    const goals = this.learningContentService.goals();
    const dependentGoals = goals.filter(g => g.workflowIds.includes(workflowId));
    
    if (dependentGoals.length > 0) {
      throw new Error(`Cannot delete workflow. It is used in goals: ${dependentGoals.map(g => g.name).join(', ')}`);
    }

    return await this.learningContentService.deleteWorkflow(workflowId);
  }

  /**
   * Get workflow form data for editing
   */
  getWorkflowFormData(workflowId: string): WorkflowFormData | null {
    const workflow = this.learningContentService.getWorkflow(workflowId);
    if (!workflow) return null;

    return {
      name: workflow.name,
      description: workflow.description,
      outcome: workflow.outcome,
      businessValue: workflow.businessValue,
      category: workflow.category,
      contentAttachments: workflow.contentAttachments,
      taskIds: workflow.taskIds,
      taskSequence: workflow.taskSequence,
      prerequisites: workflow.prerequisites,
      completionCriteria: workflow.completionCriteria,
      successIndicators: workflow.successIndicators,
      expectedROI: workflow.expectedROI,
      status: workflow.status
    };
  }

  // ===== GOAL MANAGEMENT =====

  /**
   * Create new goal
   */
  async createGoal(formData: GoalFormData): Promise<LearningGoal> {
    const goalData: Omit<LearningGoal, 'id' | 'version' | 'lastUpdated' | 'estimatedTotalTime'> = {
      name: formData.name,
      description: formData.description,
      businessValue: formData.businessValue,
      priority: formData.priority,
      contentAttachments: formData.contentAttachments,
      workflowIds: formData.workflowIds,
      requiredWorkflows: formData.requiredWorkflows,
      optionalWorkflows: formData.optionalWorkflows,
      applicableRoles: formData.applicableRoles,
      applicableBusinessTypes: formData.applicableBusinessTypes,
      successMetrics: formData.successMetrics,
      expectedOutcome: formData.expectedOutcome,
      status: formData.status
    };

    return await this.learningContentService.createGoal(goalData);
  }

  /**
   * Update existing goal
   */
  async updateGoal(goalId: string, formData: GoalFormData): Promise<LearningGoal | null> {
    const updates: Partial<LearningGoal> = {
      name: formData.name,
      description: formData.description,
      businessValue: formData.businessValue,
      priority: formData.priority,
      contentAttachments: formData.contentAttachments,
      workflowIds: formData.workflowIds,
      requiredWorkflows: formData.requiredWorkflows,
      optionalWorkflows: formData.optionalWorkflows,
      applicableRoles: formData.applicableRoles,
      applicableBusinessTypes: formData.applicableBusinessTypes,
      successMetrics: formData.successMetrics,
      expectedOutcome: formData.expectedOutcome,
      status: formData.status
    };

    return await this.learningContentService.updateGoal(goalId, updates);
  }

  /**
   * Delete goal
   */
  async deleteGoal(goalId: string): Promise<boolean> {
    return await this.learningContentService.deleteGoal(goalId);
  }

  /**
   * Get goal form data for editing
   */
  getGoalFormData(goalId: string): GoalFormData | null {
    const goal = this.learningContentService.getGoal(goalId);
    if (!goal) return null;

    return {
      name: goal.name,
      description: goal.description,
      businessValue: goal.businessValue,
      priority: goal.priority,
      contentAttachments: goal.contentAttachments,
      workflowIds: goal.workflowIds,
      requiredWorkflows: goal.requiredWorkflows,
      optionalWorkflows: goal.optionalWorkflows,
      applicableRoles: goal.applicableRoles,
      applicableBusinessTypes: goal.applicableBusinessTypes,
      successMetrics: goal.successMetrics,
      expectedOutcome: goal.expectedOutcome,
      status: goal.status
    };
  }

  // ===== RELATIONSHIP MANAGEMENT =====

  /**
   * Add task to workflow
   */
  async addTaskToWorkflow(workflowId: string, taskId: string, position?: number): Promise<boolean> {
    const workflow = this.learningContentService.getWorkflow(workflowId);
    if (!workflow) return false;

    const task = this.learningContentService.getTask(taskId);
    if (!task) return false;

    const newTaskIds = [...workflow.taskIds];
    if (position !== undefined && position >= 0 && position <= newTaskIds.length) {
      newTaskIds.splice(position, 0, taskId);
    } else {
      newTaskIds.push(taskId);
    }

    const result = await this.updateWorkflow(workflowId, {
      ...this.getWorkflowFormData(workflowId)!,
      taskIds: newTaskIds
    });

    return result !== null;
  }

  /**
   * Remove task from workflow
   */
  async removeTaskFromWorkflow(workflowId: string, taskId: string): Promise<boolean> {
    const workflow = this.learningContentService.getWorkflow(workflowId);
    if (!workflow) return false;

    const newTaskIds = workflow.taskIds.filter(id => id !== taskId);

    const result = await this.updateWorkflow(workflowId, {
      ...this.getWorkflowFormData(workflowId)!,
      taskIds: newTaskIds
    });

    return result !== null;
  }

  /**
   * Reorder tasks in workflow
   */
  async reorderTasksInWorkflow(workflowId: string, orderedTaskIds: string[]): Promise<boolean> {
    const workflow = this.learningContentService.getWorkflow(workflowId);
    if (!workflow) return false;

    const result = await this.updateWorkflow(workflowId, {
      ...this.getWorkflowFormData(workflowId)!,
      taskIds: orderedTaskIds
    });

    return result !== null;
  }

  /**
   * Add workflow to goal
   */
  async addWorkflowToGoal(goalId: string, workflowId: string, isRequired: boolean = false): Promise<boolean> {
    const goal = this.learningContentService.getGoal(goalId);
    if (!goal) return false;

    const workflow = this.learningContentService.getWorkflow(workflowId);
    if (!workflow) return false;

    const newWorkflowIds = [...goal.workflowIds];
    if (!newWorkflowIds.includes(workflowId)) {
      newWorkflowIds.push(workflowId);
    }

    const newRequiredWorkflows = [...goal.requiredWorkflows];
    const newOptionalWorkflows = [...goal.optionalWorkflows];

    if (isRequired) {
      if (!newRequiredWorkflows.includes(workflowId)) {
        newRequiredWorkflows.push(workflowId);
      }
      // Remove from optional if it was there
      const optionalIndex = newOptionalWorkflows.indexOf(workflowId);
      if (optionalIndex >= 0) {
        newOptionalWorkflows.splice(optionalIndex, 1);
      }
    } else {
      if (!newOptionalWorkflows.includes(workflowId)) {
        newOptionalWorkflows.push(workflowId);
      }
    }

    const result = await this.updateGoal(goalId, {
      ...this.getGoalFormData(goalId)!,
      workflowIds: newWorkflowIds,
      requiredWorkflows: newRequiredWorkflows,
      optionalWorkflows: newOptionalWorkflows
    });

    return result !== null;
  }

  /**
   * Remove workflow from goal
   */
  async removeWorkflowFromGoal(goalId: string, workflowId: string): Promise<boolean> {
    const goal = this.learningContentService.getGoal(goalId);
    if (!goal) return false;

    const newWorkflowIds = goal.workflowIds.filter(id => id !== workflowId);
    const newRequiredWorkflows = goal.requiredWorkflows.filter(id => id !== workflowId);
    const newOptionalWorkflows = goal.optionalWorkflows.filter(id => id !== workflowId);

    const result = await this.updateGoal(goalId, {
      ...this.getGoalFormData(goalId)!,
      workflowIds: newWorkflowIds,
      requiredWorkflows: newRequiredWorkflows,
      optionalWorkflows: newOptionalWorkflows
    });

    return result !== null;
  }

  // ===== EDITING STATE MANAGEMENT =====

  /**
   * Start editing an item
   */
  startEditing(type: 'task' | 'workflow' | 'goal', itemId: string): void {
    this._isEditing.set(true);
    this._editingItemType.set(type);
    this._editingItemId.set(itemId);
  }

  /**
   * Stop editing
   */
  stopEditing(): void {
    this._isEditing.set(false);
    this._editingItemType.set(null);
    this._editingItemId.set(null);
    this._validationResults.set(null);
  }

  /**
   * Validate content
   */
  validateContent(): void {
    const results = this.learningContentService.validateContent();
    this._validationResults.set(results);
  }

  // ===== BULK OPERATIONS =====

  /**
   * Duplicate task
   */
  async duplicateTask(taskId: string, nameSuffix: string = ' (Copy)'): Promise<LearningTask | null> {
    const originalFormData = this.getTaskFormData(taskId);
    if (!originalFormData) return null;

    const duplicateData: TaskFormData = {
      ...originalFormData,
      name: originalFormData.name + nameSuffix,
      status: 'draft'
    };

    return await this.createTask(duplicateData);
  }

  /**
   * Duplicate workflow
   */
  async duplicateWorkflow(workflowId: string, nameSuffix: string = ' (Copy)'): Promise<LearningWorkflow | null> {
    const originalFormData = this.getWorkflowFormData(workflowId);
    if (!originalFormData) return null;

    const duplicateData: WorkflowFormData = {
      ...originalFormData,
      name: originalFormData.name + nameSuffix,
      status: 'draft'
    };

    return await this.createWorkflow(duplicateData);
  }

  /**
   * Export content as JSON
   */
  exportContent(): string {
    return JSON.stringify({
      goals: this.learningContentService.goals(),
      workflows: this.learningContentService.workflows(),
      tasks: this.learningContentService.tasks(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Import content from JSON
   */
  async importContent(jsonContent: string): Promise<boolean> {
    try {
      const content = JSON.parse(jsonContent);
      
      if (content.goals && content.workflows && content.tasks) {
        await this.learningContentService.initializeContent({
          goals: content.goals,
          workflows: content.workflows,
          tasks: content.tasks
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import content:', error);
      return false;
    }
  }
}