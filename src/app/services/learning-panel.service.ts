import { Injectable, signal } from '@angular/core';
import { BusinessGoal, GoalWorkflow, WorkflowTask, LearningPanelState } from '../models/goal-system.interfaces';

@Injectable({
  providedIn: 'root'
})
export class LearningPanelService {
  // Panel state management
  private _state = signal<LearningPanelState>({
    isOpen: false,
    view: 'goal_overview'
  });

  // Active content
  private _activeGoal = signal<BusinessGoal | null>(null);
  private _activeWorkflow = signal<GoalWorkflow | null>(null);
  private _activeTask = signal<WorkflowTask | null>(null);

  // Public readonly signals
  readonly state = this._state.asReadonly();
  readonly activeGoal = this._activeGoal.asReadonly();
  readonly activeWorkflow = this._activeWorkflow.asReadonly();
  readonly activeTask = this._activeTask.asReadonly();

  // Panel controls
  openPanel(): void {
    this._state.update(state => ({ ...state, isOpen: true }));
  }

  closePanel(): void {
    this._state.update(state => ({ 
      ...state, 
      isOpen: false,
      view: 'goal_overview'
    }));
    // Clear active content when panel closes
    this._activeGoal.set(null);
    this._activeWorkflow.set(null);
    this._activeTask.set(null);
  }

  togglePanel(): void {
    if (this._state().isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  // Content management
  startGoalEvaluation(goal: BusinessGoal, workflow?: GoalWorkflow): void {
    this._activeGoal.set(goal);
    
    if (workflow) {
      this._activeWorkflow.set(workflow);
      this._state.update(state => ({
        ...state,
        isOpen: true,
        activeGoalId: goal.id,
        activeWorkflowId: workflow.id,
        view: 'task_guidance'
      }));
    } else {
      this._state.update(state => ({
        ...state,
        isOpen: true,
        activeGoalId: goal.id,
        view: 'workflow_list'
      }));
    }
  }

  selectWorkflow(workflow: GoalWorkflow): void {
    this._activeWorkflow.set(workflow);
    this._state.update(state => ({
      ...state,
      activeWorkflowId: workflow.id,
      view: 'task_guidance'
    }));
    
    // Start with first task
    if (workflow.tasks.length > 0) {
      this.selectTask(workflow.tasks[0]);
    }
  }

  selectTask(task: WorkflowTask): void {
    this._activeTask.set(task);
    this._state.update(state => ({
      ...state,
      activeTaskId: task.id,
      view: 'task_guidance'
    }));
  }

  // Navigation
  setView(view: LearningPanelState['view']): void {
    this._state.update(state => ({ ...state, view }));
  }

  goBackToGoalOverview(): void {
    this._activeWorkflow.set(null);
    this._activeTask.set(null);
    this._state.update(state => ({
      ...state,
      activeWorkflowId: undefined,
      activeTaskId: undefined,
      view: 'goal_overview'
    }));
  }

  goBackToWorkflowList(): void {
    this._activeTask.set(null);
    this._state.update(state => ({
      ...state,
      activeTaskId: undefined,
      view: 'workflow_list'
    }));
  }

  // Utility methods
  get isOpen(): boolean {
    return this._state().isOpen;
  }

  get hasActiveGoal(): boolean {
    return this._activeGoal() !== null;
  }

  get hasActiveWorkflow(): boolean {
    return this._activeWorkflow() !== null;
  }

  get hasActiveTask(): boolean {
    return this._activeTask() !== null;
  }

  getCurrentView(): LearningPanelState['view'] {
    return this._state().view;
  }

  // Integration with goal evaluation
  markTaskComplete(taskId: string): void {
    console.log(`✅ Task completed: ${taskId}`);
    // TODO: Implement task completion tracking
    // This would integrate with progress tracking system
  }

  markWorkflowComplete(workflowId: string): void {
    console.log(`🎉 Workflow completed: ${workflowId}`);
    // TODO: Implement workflow completion tracking
  }
}