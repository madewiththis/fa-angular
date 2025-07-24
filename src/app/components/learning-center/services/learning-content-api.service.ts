import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LearningContentService } from './learning-content.service';
import {
  LearningTask,
  LearningWorkflow,
  LearningGoal,
  UserRole,
  BusinessType,
  DifficultyLevel,
  ContentSearchQuery,
  ContentSearchResult,
  LearningRecommendation,
  RecommendationContext,
  ProgressSummary,
  UserLearningProgress
} from '../models/learning-content.types';

/**
 * Clean consumption API for other modules to query learning content
 * This service provides a simplified, stable interface for external modules
 * to interact with the learning center without coupling to internal implementation
 */
@Injectable({
  providedIn: 'root'
})
export class LearningContentApiService {

  constructor(private learningContent: LearningContentService) {}

  // ===== CONTENT RETRIEVAL =====

  /**
   * Get all published goals
   */
  getGoals(): LearningGoal[] {
    return this.learningContent.getPublishedGoals();
  }

  /**
   * Get goal by ID
   */
  getGoal(goalId: string): LearningGoal | null {
    return this.learningContent.getGoal(goalId);
  }

  /**
   * Get goals recommended for a specific user profile
   */
  getGoalsForUser(userRole: UserRole, businessType: BusinessType): LearningGoal[] {
    return this.learningContent.getGoalsForProfile(userRole, businessType);
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(workflowId: string): LearningWorkflow | null {
    return this.learningContent.getWorkflow(workflowId);
  }

  /**
   * Get all workflows for a goal
   */
  getWorkflowsForGoal(goalId: string): LearningWorkflow[] {
    return this.learningContent.getWorkflowsForGoal(goalId);
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): LearningTask | null {
    return this.learningContent.getTask(taskId);
  }

  /**
   * Get all tasks for a workflow
   */
  getTasksForWorkflow(workflowId: string): LearningTask[] {
    return this.learningContent.getTasksForWorkflow(workflowId);
  }

  /**
   * Get complete goal structure (goal + workflows + tasks)
   */
  getCompleteGoal(goalId: string): CompleteGoalStructure | null {
    const goal = this.getGoal(goalId);
    if (!goal) return null;

    const workflows = this.getWorkflowsForGoal(goalId).map(workflow => ({
      ...workflow,
      tasks: this.getTasksForWorkflow(workflow.id)
    }));

    return {
      goal,
      workflows,
      totalTasks: workflows.reduce((sum, w) => sum + w.tasks.length, 0),
      estimatedTime: workflows.reduce((sum, w) => sum + w.estimatedTime, 0)
    };
  }

  // ===== SEARCH & DISCOVERY =====

  /**
   * Search learning content
   */
  searchContent(query: ContentSearchQuery): ContentSearchResult[] {
    return this.learningContent.searchContent(query);
  }

  /**
   * Search goals only
   */
  searchGoals(keyword: string): LearningGoal[] {
    const results = this.searchContent({ keyword });
    const goalIds = results.filter(r => r.type === 'goal').map(r => r.id);
    return goalIds.map(id => this.getGoal(id)).filter((g): g is LearningGoal => g !== null);
  }

  /**
   * Get content recommendations for user
   */
  getRecommendations(context: RecommendationContext, limit?: number): LearningRecommendation[] {
    return this.learningContent.getRecommendations(context, limit);
  }

  /**
   * Get quick start actions (simplified for dashboard integration)
   */
  getQuickStartActions(userRole: UserRole, businessType: BusinessType, limit: number = 3): QuickStartAction[] {
    const goals = this.getGoalsForUser(userRole, businessType);
    const topGoals = goals.slice(0, limit);

    return topGoals.map(goal => {
      const firstWorkflow = this.getWorkflowsForGoal(goal.id)[0];
      const firstTask = firstWorkflow ? this.getTasksForWorkflow(firstWorkflow.id)[0] : null;

      return {
        id: goal.id,
        title: goal.name,
        description: goal.description,
        estimatedTime: goal.estimatedTotalTime,
        difficulty: this.calculateGoalDifficulty(goal),
        actionType: 'goal',
        quickAction: firstTask ? {
          taskId: firstTask.id,
          taskName: firstTask.name,
          instructions: firstTask.instructions.overview
        } : undefined
      };
    });
  }

  /**
   * Get popular tasks (most commonly started tasks)
   */
  getPopularTasks(limit: number = 5): PopularTask[] {
    // For now, return tasks from high-priority goals
    const topGoals = this.getGoals().sort((a, b) => a.priority - b.priority).slice(0, 3);
    const allTasks: LearningTask[] = [];

    topGoals.forEach(goal => {
      const workflows = this.getWorkflowsForGoal(goal.id);
      workflows.forEach(workflow => {
        const tasks = this.getTasksForWorkflow(workflow.id);
        allTasks.push(...tasks);
      });
    });

    return allTasks
      .slice(0, limit)
      .map(task => ({
        id: task.id,
        name: task.name,
        description: task.description,
        estimatedTime: task.estimatedTime,
        difficulty: task.difficulty,
        category: task.category || 'General',
        completionRate: task.completionRate || 0
      }));
  }

  // ===== PROGRESS TRACKING =====

  /**
   * Get user's learning progress
   */
  getUserProgress(): UserLearningProgress | null {
    return this.learningContent.userProgress();
  }

  /**
   * Get progress summary for a specific goal
   */
  getGoalProgress(goalId: string): ProgressSummary {
    return this.learningContent.getGoalProgress(goalId);
  }

  /**
   * Start tracking a goal
   */
  startGoal(goalId: string, selectedWorkflowIds?: string[]): void {
    const goal = this.getGoal(goalId);
    if (!goal) return;

    const workflowIds = selectedWorkflowIds || goal.requiredWorkflows;
    this.learningContent.startGoal(goalId, workflowIds);
  }

  /**
   * Mark a task as completed
   */
  completeTask(taskId: string, workflowId: string, goalId: string, timeSpent?: number): void {
    this.learningContent.completeTask(taskId, workflowId, goalId, timeSpent);
  }

  /**
   * Get user's active goals (goals that have been started but not completed)
   */
  getActiveGoals(): ActiveGoal[] {
    const progress = this.getUserProgress();
    if (!progress) return [];

    return progress.goalSelections.map(selection => {
      const goal = this.getGoal(selection.goalId);
      if (!goal) return null;

      const progressSummary = this.getGoalProgress(selection.goalId);
      
      return {
        goal,
        startedAt: selection.startedAt,
        progress: progressSummary,
        selectedWorkflows: selection.selectedWorkflows
      };
    }).filter((g): g is ActiveGoal => g !== null);
  }

  // ===== ADAPTIVE CONTENT =====

  /**
   * Get next recommended task for user
   */
  getNextRecommendedTask(userRole: UserRole, businessType: BusinessType): NextTaskRecommendation | null {
    const activeGoals = this.getActiveGoals();
    
    // If user has active goals, recommend next task from current goal
    if (activeGoals.length > 0) {
      const currentGoal = activeGoals[0]; // Most recent active goal
      const workflows = this.getWorkflowsForGoal(currentGoal.goal.id);
      
      for (const workflow of workflows) {
        const tasks = this.getTasksForWorkflow(workflow.id);
        const progress = this.getUserProgress();
        
        if (progress) {
          const nextTask = tasks.find(task => 
            !progress.taskProgress.some(tp => 
              tp.taskId === task.id && tp.status === 'completed'
            )
          );
          
          if (nextTask) {
            return {
              task: nextTask,
              workflow,
              goal: currentGoal.goal,
              reason: 'Continue current goal',
              context: 'active_goal'
            };
          }
        }
      }
    }

    // If no active goals, recommend from top recommended goals
    const recommendations = this.getRecommendations({ userRole, businessType }, 1);
    if (recommendations.length > 0) {
      const rec = recommendations[0];
      const goal = this.getGoal(rec.id);
      if (goal) {
        const workflows = this.getWorkflowsForGoal(goal.id);
        if (workflows.length > 0) {
          const tasks = this.getTasksForWorkflow(workflows[0].id);
          if (tasks.length > 0) {
            return {
              task: tasks[0],
              workflow: workflows[0],
              goal,
              reason: rec.reasons.join(', '),
              context: 'new_recommendation'
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Get contextual help for current user state
   */
  getContextualHelp(userRole: UserRole, businessType: BusinessType): ContextualHelp {
    const activeGoals = this.getActiveGoals();
    const recommendations = this.getRecommendations({ userRole, businessType }, 3);
    const nextTask = this.getNextRecommendedTask(userRole, businessType);

    return {
      hasActiveGoals: activeGoals.length > 0,
      activeGoalsCount: activeGoals.length,
      nextRecommendedTask: nextTask,
      topRecommendations: recommendations.slice(0, 3),
      quickStartActions: this.getQuickStartActions(userRole, businessType, 3),
      helpMessage: this.generateHelpMessage(activeGoals, recommendations)
    };
  }

  // ===== UTILITY METHODS =====

  /**
   * Check if learning content is loaded
   */
  isContentLoaded(): boolean {
    return !this.learningContent.isLoading() && this.learningContent.goals().length > 0;
  }

  /**
   * Get content loading state
   */
  getLoadingState(): { isLoading: boolean; error: string | null } {
    return {
      isLoading: this.learningContent.isLoading(),
      error: this.learningContent.error()
    };
  }

  /**
   * Get content statistics
   */
  getContentStats(): ContentStats {
    return {
      totalGoals: this.learningContent.goals().length,
      totalWorkflows: this.learningContent.workflows().length,
      totalTasks: this.learningContent.tasks().length,
      publishedGoals: this.learningContent.publishedContent().goals,
      publishedWorkflows: this.learningContent.publishedContent().workflows,
      publishedTasks: this.learningContent.publishedContent().tasks
    };
  }

  // ===== PRIVATE HELPERS =====

  private calculateGoalDifficulty(goal: LearningGoal): DifficultyLevel {
    const workflows = this.getWorkflowsForGoal(goal.id);
    if (workflows.length === 0) return 'beginner';
    
    const difficulties = workflows.map(w => w.difficulty);
    if (difficulties.includes('advanced')) return 'advanced';
    if (difficulties.includes('intermediate')) return 'intermediate';
    return 'beginner';
  }

  private generateHelpMessage(activeGoals: ActiveGoal[], recommendations: LearningRecommendation[]): string {
    if (activeGoals.length > 0) {
      const currentGoal = activeGoals[0];
      return `Continue working on "${currentGoal.goal.name}" - you're ${currentGoal.progress.percentage}% complete.`;
    }

    if (recommendations.length > 0) {
      return `Start with "${recommendations[0].title}" - it's recommended based on your role and business type.`;
    }

    return 'Explore our learning goals to improve your FlowAccount skills.';
  }
}

// ===== SUPPORTING INTERFACES FOR API =====

export interface CompleteGoalStructure {
  goal: LearningGoal;
  workflows: Array<LearningWorkflow & { tasks: LearningTask[] }>;
  totalTasks: number;
  estimatedTime: number;
}

export interface QuickStartAction {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: DifficultyLevel;
  actionType: 'goal' | 'workflow' | 'task';
  quickAction?: {
    taskId: string;
    taskName: string;
    instructions: string;
  };
}

export interface PopularTask {
  id: string;
  name: string;
  description: string;
  estimatedTime: number;
  difficulty: DifficultyLevel;
  category: string;
  completionRate: number;
}

export interface ActiveGoal {
  goal: LearningGoal;
  startedAt: Date;
  progress: ProgressSummary;
  selectedWorkflows: string[];
}

export interface NextTaskRecommendation {
  task: LearningTask;
  workflow: LearningWorkflow;
  goal: LearningGoal;
  reason: string;
  context: 'active_goal' | 'new_recommendation';
}

export interface ContextualHelp {
  hasActiveGoals: boolean;
  activeGoalsCount: number;
  nextRecommendedTask: NextTaskRecommendation | null;
  topRecommendations: LearningRecommendation[];
  quickStartActions: QuickStartAction[];
  helpMessage: string;
}

export interface ContentStats {
  totalGoals: number;
  totalWorkflows: number;
  totalTasks: number;
  publishedGoals: number;
  publishedWorkflows: number;
  publishedTasks: number;
}