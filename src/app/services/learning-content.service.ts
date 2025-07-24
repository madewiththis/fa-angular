import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import {
  LearningTask,
  LearningWorkflow, 
  LearningGoal,
  UserLearningProgress,
  TaskProgress,
  WorkflowProgress,
  GoalSelection,
  ContentSearchQuery,
  ContentSearchResult,
  LearningRecommendation,
  RecommendationContext,
  LearningContentQuery,
  LearningContentResponse,
  UserRole,
  BusinessType,
  DifficultyLevel,
  ValidationMethod
} from '../models/learning-content.interfaces';

@Injectable({
  providedIn: 'root'
})
export class LearningContentService {
  private readonly STORAGE_KEY = 'flowaccount_learning_content';
  private readonly PROGRESS_KEY = 'flowaccount_learning_progress';
  
  // Content Storage
  private _goals = signal<LearningGoal[]>([]);
  private _workflows = signal<LearningWorkflow[]>([]);
  private _tasks = signal<LearningTask[]>([]);
  
  // User Progress
  private _userProgress = signal<UserLearningProgress | null>(null);
  
  // Loading States
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  
  // Public Readonly Signals
  readonly goals = this._goals.asReadonly();
  readonly workflows = this._workflows.asReadonly();
  readonly tasks = this._tasks.asReadonly();
  readonly userProgress = this._userProgress.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed Properties
  readonly totalContent = computed(() => ({
    goals: this._goals().length,
    workflows: this._workflows().length,
    tasks: this._tasks().length
  }));
  
  readonly publishedContent = computed(() => ({
    goals: this._goals().filter(g => g.status === 'published').length,
    workflows: this._workflows().filter(w => w.status === 'published').length,
    tasks: this._tasks().filter(t => t.status === 'published').length
  }));

  constructor() {
    this.loadContent();
    this.loadUserProgress();
  }

  // ===== CONTENT MANAGEMENT =====

  /**
   * Load all learning content from storage
   */
  async loadContent(): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      // In production, this would be an HTTP call
      // For now, we'll load from localStorage or default data
      const stored = localStorage.getItem(this.STORAGE_KEY);
      
      if (stored) {
        const content = JSON.parse(stored);
        this._goals.set(content.goals || []);
        this._workflows.set(content.workflows || []);
        this._tasks.set(content.tasks || []);
      } else {
        // Load default content from existing goal library
        await this.initializeDefaultContent();
      }
    } catch (error) {
      this._error.set('Failed to load learning content');
      console.error('Error loading learning content:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Save content to storage
   */
  private async saveContent(): Promise<void> {
    try {
      const content = {
        goals: this._goals(),
        workflows: this._workflows(),
        tasks: this._tasks(),
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(content));
    } catch (error) {
      console.error('Failed to save learning content:', error);
      throw new Error('Failed to save content');
    }
  }

  // ===== GOAL OPERATIONS =====

  /**
   * Get goal by ID
   */
  getGoal(goalId: string): LearningGoal | null {
    return this._goals().find(g => g.id === goalId) || null;
  }

  /**
   * Get goals for specific user profile
   */
  getGoalsForProfile(userRole: UserRole, businessType: BusinessType): LearningGoal[] {
    return this._goals()
      .filter(goal => 
        goal.applicableRoles.includes(userRole) && 
        goal.applicableBusinessTypes.includes(businessType) &&
        goal.status === 'published'
      )
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Create new goal
   */
  async createGoal(goalData: Omit<LearningGoal, 'id' | 'version' | 'lastUpdated'>): Promise<LearningGoal> {
    const newGoal: LearningGoal = {
      ...goalData,
      id: this.generateId('goal'),
      version: 1,
      lastUpdated: new Date()
    };

    this._goals.update(goals => [...goals, newGoal]);
    await this.saveContent();
    return newGoal;
  }

  /**
   * Update existing goal
   */
  async updateGoal(goalId: string, updates: Partial<LearningGoal>): Promise<LearningGoal | null> {
    const goalIndex = this._goals().findIndex(g => g.id === goalId);
    if (goalIndex === -1) return null;

    const updatedGoal = {
      ...this._goals()[goalIndex],
      ...updates,
      version: this._goals()[goalIndex].version + 1,
      lastUpdated: new Date()
    };

    this._goals.update(goals => {
      const newGoals = [...goals];
      newGoals[goalIndex] = updatedGoal;
      return newGoals;
    });

    await this.saveContent();
    return updatedGoal;
  }

  // ===== WORKFLOW OPERATIONS =====

  /**
   * Get workflow by ID
   */
  getWorkflow(workflowId: string): LearningWorkflow | null {
    return this._workflows().find(w => w.id === workflowId) || null;
  }

  /**
   * Get workflows for a goal
   */
  getWorkflowsForGoal(goalId: string): LearningWorkflow[] {
    const goal = this.getGoal(goalId);
    if (!goal) return [];

    return goal.workflowIds
      .map(wId => this.getWorkflow(wId))
      .filter((w): w is LearningWorkflow => w !== null)
      .filter(w => w.status === 'published');
  }

  /**
   * Create new workflow
   */
  async createWorkflow(workflowData: Omit<LearningWorkflow, 'id' | 'version' | 'lastUpdated' | 'estimatedTime' | 'difficulty'>): Promise<LearningWorkflow> {
    // Calculate estimated time and difficulty from tasks
    const tasks = workflowData.taskIds.map(tId => this.getTask(tId)).filter((t): t is LearningTask => t !== null);
    const estimatedTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
    const difficulty = this.calculateWorkflowDifficulty(tasks);

    const newWorkflow: LearningWorkflow = {
      ...workflowData,
      id: this.generateId('workflow'),
      estimatedTime,
      difficulty,
      version: 1,
      lastUpdated: new Date()
    };

    this._workflows.update(workflows => [...workflows, newWorkflow]);
    await this.saveContent();
    return newWorkflow;
  }

  // ===== TASK OPERATIONS =====

  /**
   * Get task by ID
   */
  getTask(taskId: string): LearningTask | null {
    return this._tasks().find(t => t.id === taskId) || null;
  }

  /**
   * Get tasks for a workflow
   */
  getTasksForWorkflow(workflowId: string): LearningTask[] {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return [];

    return workflow.taskIds
      .map(tId => this.getTask(tId))
      .filter((t): t is LearningTask => t !== null)
      .filter(t => t.status === 'published');
  }

  /**
   * Create new task
   */
  async createTask(taskData: Omit<LearningTask, 'id' | 'version' | 'lastUpdated'>): Promise<LearningTask> {
    const newTask: LearningTask = {
      ...taskData,
      id: this.generateId('task'),
      version: 1,
      lastUpdated: new Date()
    };

    this._tasks.update(tasks => [...tasks, newTask]);
    await this.saveContent();
    return newTask;
  }

  // ===== SEARCH & DISCOVERY =====

  /**
   * Search content by query
   */
  searchContent(query: ContentSearchQuery): ContentSearchResult[] {
    const results: ContentSearchResult[] = [];

    // Search goals
    this._goals()
      .filter(goal => this.matchesSearchQuery(goal, query, 'goal'))
      .forEach(goal => {
        results.push({
          type: 'goal',
          id: goal.id,
          name: goal.name,
          description: goal.description,
          relevanceScore: this.calculateRelevanceScore(goal, query, 'goal'),
          matchingFields: this.getMatchingFields(goal, query, 'goal')
        });
      });

    // Search workflows
    this._workflows()
      .filter(workflow => this.matchesSearchQuery(workflow, query, 'workflow'))
      .forEach(workflow => {
        results.push({
          type: 'workflow',
          id: workflow.id,
          name: workflow.name,
          description: workflow.description,
          relevanceScore: this.calculateRelevanceScore(workflow, query, 'workflow'),
          matchingFields: this.getMatchingFields(workflow, query, 'workflow')
        });
      });

    // Search tasks
    this._tasks()
      .filter(task => this.matchesSearchQuery(task, query, 'task'))
      .forEach(task => {
        results.push({
          type: 'task',
          id: task.id,
          name: task.name,
          description: task.description,
          relevanceScore: this.calculateRelevanceScore(task, query, 'task'),
          matchingFields: this.getMatchingFields(task, query, 'task')
        });
      });

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Get content recommendations for user
   */
  getRecommendations(context: RecommendationContext, limit: number = 5): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = [];

    // Get goals suitable for user profile
    const suitableGoals = this.getGoalsForProfile(context.userRole, context.businessType);
    
    suitableGoals.forEach(goal => {
      const score = this.calculateRecommendationScore(goal, context);
      if (score > 0) {
        recommendations.push({
          type: 'goal',
          id: goal.id,
          title: goal.name,
          description: goal.description,
          score,
          reasons: this.getRecommendationReasons(goal, context),
          basedOn: 'role',
          estimatedTime: goal.estimatedTotalTime,
          difficulty: this.calculateGoalDifficulty(goal)
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // ===== PROGRESS TRACKING =====

  /**
   * Load user progress from storage
   */
  private loadUserProgress(): void {
    try {
      const stored = localStorage.getItem(this.PROGRESS_KEY);
      if (stored) {
        const progress = JSON.parse(stored);
        // Convert date strings back to Date objects
        progress.lastActive = new Date(progress.lastActive);
        progress.goalSelections = progress.goalSelections.map((gs: any) => ({
          ...gs,
          startedAt: new Date(gs.startedAt)
        }));
        progress.workflowProgress = progress.workflowProgress.map((wp: any) => ({
          ...wp,
          startedAt: wp.startedAt ? new Date(wp.startedAt) : undefined,
          completedAt: wp.completedAt ? new Date(wp.completedAt) : undefined
        }));
        progress.taskProgress = progress.taskProgress.map((tp: any) => ({
          ...tp,
          startedAt: tp.startedAt ? new Date(tp.startedAt) : undefined,
          completedAt: tp.completedAt ? new Date(tp.completedAt) : undefined
        }));
        
        this._userProgress.set(progress);
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  }

  /**
   * Save user progress to storage
   */
  private saveUserProgress(): void {
    try {
      const progress = this._userProgress();
      if (progress) {
        localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
      }
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  }

  /**
   * Start tracking progress for a goal
   */
  startGoal(goalId: string, selectedWorkflows: string[]): void {
    const current = this._userProgress() || this.createEmptyProgress();
    
    const goalSelection: GoalSelection = {
      goalId,
      selectedWorkflows,
      startedAt: new Date(),
      priority: current.goalSelections.length + 1
    };

    current.goalSelections.push(goalSelection);
    current.lastActive = new Date();
    
    this._userProgress.set(current);
    this.saveUserProgress();
  }

  /**
   * Mark task as completed
   */
  completeTask(taskId: string, workflowId: string, goalId: string, timeSpent: number = 0): void {
    const current = this._userProgress() || this.createEmptyProgress();
    
    // Update task progress
    const taskProgressIndex = current.taskProgress.findIndex(
      tp => tp.taskId === taskId && tp.workflowId === workflowId && tp.goalId === goalId
    );
    
    if (taskProgressIndex >= 0) {
      current.taskProgress[taskProgressIndex].status = 'completed';
      current.taskProgress[taskProgressIndex].completedAt = new Date();
      current.taskProgress[taskProgressIndex].timeSpent += timeSpent;
    } else {
      current.taskProgress.push({
        taskId,
        workflowId,
        goalId,
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        timeSpent,
        attemptsCount: 1,
        completionMethod: 'manual'
      });
    }

    // Update workflow progress
    this.updateWorkflowProgress(workflowId, goalId, current);
    
    current.lastActive = new Date();
    current.totalTimeSpent += timeSpent;
    
    this._userProgress.set(current);
    this.saveUserProgress();
  }

  /**
   * Get progress for specific goal
   */
  getGoalProgress(goalId: string): { completed: number; total: number; percentage: number } {
    const progress = this._userProgress();
    if (!progress) return { completed: 0, total: 0, percentage: 0 };

    const goal = this.getGoal(goalId);
    if (!goal) return { completed: 0, total: 0, percentage: 0 };

    let totalTasks = 0;
    let completedTasks = 0;

    goal.workflowIds.forEach(workflowId => {
      const workflow = this.getWorkflow(workflowId);
      if (workflow) {
        totalTasks += workflow.taskIds.length;
        
        workflow.taskIds.forEach(taskId => {
          const taskProgress = progress.taskProgress.find(
            tp => tp.taskId === taskId && tp.workflowId === workflowId && tp.goalId === goalId
          );
          if (taskProgress && taskProgress.status === 'completed') {
            completedTasks++;
          }
        });
      }
    });

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { completed: completedTasks, total: totalTasks, percentage };
  }

  // ===== UTILITY METHODS =====

  /**
   * Generate unique ID for content
   */
  private generateId(type: 'goal' | 'workflow' | 'task'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${type}_${timestamp}_${random}`;
  }

  /**
   * Calculate workflow difficulty based on tasks
   */
  private calculateWorkflowDifficulty(tasks: LearningTask[]): DifficultyLevel {
    if (tasks.length === 0) return 'beginner';
    
    const difficulties = tasks.map(t => t.difficulty);
    if (difficulties.includes('advanced')) return 'advanced';
    if (difficulties.includes('intermediate')) return 'intermediate';
    return 'beginner';
  }

  /**
   * Calculate goal difficulty
   */
  private calculateGoalDifficulty(goal: LearningGoal): DifficultyLevel {
    const workflows = this.getWorkflowsForGoal(goal.id);
    if (workflows.length === 0) return 'beginner';
    
    const difficulties = workflows.map(w => w.difficulty);
    if (difficulties.includes('advanced')) return 'advanced';
    if (difficulties.includes('intermediate')) return 'intermediate';
    return 'beginner';
  }

  /**
   * Check if content matches search query
   */
  private matchesSearchQuery(
    content: LearningGoal | LearningWorkflow | LearningTask, 
    query: ContentSearchQuery,
    type: 'goal' | 'workflow' | 'task'
  ): boolean {
    // Keyword search
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      if (!content.name.toLowerCase().includes(keyword) && 
          !content.description.toLowerCase().includes(keyword)) {
        return false;
      }
    }

    // Difficulty filter
    if (query.difficulty) {
      if (type === 'task' && (content as LearningTask).difficulty !== query.difficulty) {
        return false;
      }
      if (type === 'workflow' && (content as LearningWorkflow).difficulty !== query.difficulty) {
        return false;
      }
    }

    // Status filter
    if (query.status && content.status !== query.status) {
      return false;
    }

    return true;
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevanceScore(
    content: LearningGoal | LearningWorkflow | LearningTask,
    query: ContentSearchQuery,
    type: 'goal' | 'workflow' | 'task'
  ): number {
    let score = 0;
    
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      if (content.name.toLowerCase().includes(keyword)) score += 50;
      if (content.description.toLowerCase().includes(keyword)) score += 30;
    }
    
    // Boost published content
    if (content.status === 'published') score += 20;
    
    return Math.min(score, 100);
  }

  /**
   * Get matching fields for search results
   */
  private getMatchingFields(
    content: LearningGoal | LearningWorkflow | LearningTask,
    query: ContentSearchQuery,
    type: 'goal' | 'workflow' | 'task'
  ): string[] {
    const fields: string[] = [];
    
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      if (content.name.toLowerCase().includes(keyword)) fields.push('name');
      if (content.description.toLowerCase().includes(keyword)) fields.push('description');
    }
    
    return fields;
  }

  /**
   * Calculate recommendation score
   */
  private calculateRecommendationScore(goal: LearningGoal, context: RecommendationContext): number {
    let score = 0;
    
    // Role match
    if (goal.applicableRoles.includes(context.userRole)) score += 30;
    
    // Business type match
    if (goal.applicableBusinessTypes.includes(context.businessType)) score += 30;
    
    // Priority boost (higher priority = higher score)
    score += Math.max(0, 40 - (goal.priority * 10));
    
    return Math.min(score, 100);
  }

  /**
   * Get recommendation reasons
   */
  private getRecommendationReasons(goal: LearningGoal, context: RecommendationContext): string[] {
    const reasons: string[] = [];
    
    if (goal.applicableRoles.includes(context.userRole)) {
      reasons.push(`Suitable for ${context.userRole}s`);
    }
    
    if (goal.applicableBusinessTypes.includes(context.businessType)) {
      reasons.push(`Relevant for ${context.businessType} businesses`);
    }
    
    if (goal.priority <= 2) {
      reasons.push('High priority for new users');
    }
    
    return reasons;
  }

  /**
   * Create empty progress object
   */
  private createEmptyProgress(): UserLearningProgress {
    return {
      goalSelections: [],
      workflowProgress: [],
      taskProgress: [],
      lastActive: new Date(),
      totalTimeSpent: 0
    };
  }

  /**
   * Update workflow progress based on task completion
   */
  private updateWorkflowProgress(workflowId: string, goalId: string, progress: UserLearningProgress): void {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return;

    const workflowProgressIndex = progress.workflowProgress.findIndex(
      wp => wp.workflowId === workflowId && wp.goalId === goalId
    );

    const completedTasks = workflow.taskIds.filter(taskId =>
      progress.taskProgress.some(tp =>
        tp.taskId === taskId && tp.workflowId === workflowId && tp.goalId === goalId && tp.status === 'completed'
      )
    );

    const completionPercentage = Math.round((completedTasks.length / workflow.taskIds.length) * 100);
    const isComplete = completedTasks.length === workflow.taskIds.length;

    if (workflowProgressIndex >= 0) {
      const wp = progress.workflowProgress[workflowProgressIndex];
      wp.completedTasks = completedTasks;
      wp.completionPercentage = completionPercentage;
      wp.status = isComplete ? 'completed' : 'in_progress';
      if (isComplete && !wp.completedAt) {
        wp.completedAt = new Date();
      }
    } else {
      progress.workflowProgress.push({
        workflowId,
        goalId,
        status: isComplete ? 'completed' : 'in_progress',
        completedTasks,
        completionPercentage,
        startedAt: new Date(),
        completedAt: isComplete ? new Date() : undefined,
        timeSpent: 0
      });
    }
  }

  /**
   * Initialize default content from existing goal library
   */
  private async initializeDefaultContent(): Promise<void> {
    // This will be implemented to migrate existing GOAL_LIBRARY content
    // For now, we'll set empty arrays
    this._goals.set([]);
    this._workflows.set([]);
    this._tasks.set([]);
  }

  /**
   * Reset all content and progress (for testing)
   */
  resetAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.PROGRESS_KEY);
    this._goals.set([]);
    this._workflows.set([]);
    this._tasks.set([]);
    this._userProgress.set(null);
  }
}