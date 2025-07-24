import { Injectable } from '@angular/core';
import { Observable, from, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  LearningTask,
  LearningWorkflow,
  LearningGoal,
  ContentLibrary,
  ContentValidationResult
} from '../models/learning-content.types';

// Import TypeScript content as fallback
import { 
  CONTENT_LIBRARY, 
  validateContentIntegrity 
} from './content-library';

export interface ContentLoadOptions {
  source: 'typescript' | 'json' | 'auto';
  validateIntegrity: boolean;
  includeUnpublished: boolean;
}

export interface ContentLoadResult {
  content: ContentLibrary;
  source: 'typescript' | 'json';
  validation: ContentValidationResult;
  loadTime: number;
  errors: string[];
}

/**
 * Service for loading learning content from various sources
 * Supports both TypeScript and JSON formats with validation
 */
@Injectable({
  providedIn: 'root'
})
export class ContentLoaderService {

  private readonly DEFAULT_OPTIONS: ContentLoadOptions = {
    source: 'auto',
    validateIntegrity: true,
    includeUnpublished: false
  };

  constructor() {}

  /**
   * Load content from the specified source
   */
  async loadContent(options: Partial<ContentLoadOptions> = {}): Promise<ContentLoadResult> {
    const startTime = Date.now();
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const errors: string[] = [];

    try {
      let content: ContentLibrary;
      let source: 'typescript' | 'json';

      // Determine source and load content
      if (opts.source === 'typescript') {
        content = await this.loadFromTypeScript();
        source = 'typescript';
      } else if (opts.source === 'json') {
        content = await this.loadFromJSON();
        source = 'json';
      } else {
        // Auto mode: try JSON first, fallback to TypeScript
        try {
          content = await this.loadFromJSON();
          source = 'json';
        } catch (jsonError) {
          console.warn('Failed to load from JSON, falling back to TypeScript:', jsonError);
          errors.push(`JSON load failed: ${jsonError}`);
          content = await this.loadFromTypeScript();
          source = 'typescript';
        }
      }

      // Filter published content if needed
      if (!opts.includeUnpublished) {
        content = this.filterPublishedContent(content);
      }

      // Validate content integrity
      let validation: ContentValidationResult = { valid: true, errors: [], warnings: [] };
      if (opts.validateIntegrity) {
        validation = this.validateContent(content);
        if (!validation.valid) {
          errors.push(...validation.errors);
        }
      }

      const loadTime = Date.now() - startTime;

      return {
        content,
        source,
        validation,
        loadTime,
        errors
      };

    } catch (error) {
      const loadTime = Date.now() - startTime;
      errors.push(`Content loading failed: ${error}`);
      
      // Return empty content with errors
      return {
        content: { goals: [], workflows: [], tasks: [], quickGuideCategories: [] },
        source: 'typescript', // fallback
        validation: { valid: false, errors, warnings: [] },
        loadTime,
        errors
      };
    }
  }

  /**
   * Load content from TypeScript files
   */
  private async loadFromTypeScript(): Promise<ContentLibrary> {
    return new Promise((resolve) => {
      // Content is already imported at the top
      resolve(CONTENT_LIBRARY);
    });
  }

  /**
   * Load content from JSON files
   */
  private async loadFromJSON(): Promise<ContentLibrary> {
    try {
      // In a real implementation, these would be HTTP requests
      // For now, we'll simulate loading from JSON files
      const [tasksResponse, workflowsResponse, goalsResponse] = await Promise.all([
        this.loadJSONFile<LearningTask[]>('/raw-content/tasks.json'),
        this.loadJSONFile<LearningWorkflow[]>('/raw-content/workflows.json'),
        this.loadJSONFile<LearningGoal[]>('/raw-content/goals.json')
      ]);

      return {
        tasks: tasksResponse,
        workflows: workflowsResponse,
        goals: goalsResponse,
        quickGuideCategories: []
      };
    } catch (error) {
      throw new Error(`Failed to load JSON content: ${error}`);
    }
  }

  /**
   * Simulate loading JSON file (in production, this would be an HTTP request)
   */
  private async loadJSONFile<T>(path: string): Promise<T> {
    // In a real implementation, this would fetch from the actual JSON files
    // For now, we'll return the TypeScript equivalent
    switch (path) {
      case '/raw-content/tasks.json':
        return CONTENT_LIBRARY.tasks as T;
      case '/raw-content/workflows.json':
        return CONTENT_LIBRARY.workflows as T;
      case '/raw-content/goals.json':
        return CONTENT_LIBRARY.goals as T;
      default:
        throw new Error(`Unknown JSON file: ${path}`);
    }
  }

  /**
   * Filter out unpublished content
   */
  private filterPublishedContent(content: ContentLibrary): ContentLibrary {
    return {
      goals: content.goals.filter(g => g.status === 'published'),
      workflows: content.workflows.filter(w => w.status === 'published'),
      tasks: content.tasks.filter(t => t.status === 'published'),
      quickGuideCategories: content.quickGuideCategories.filter(qg => qg.status === 'published')
    };
  }

  /**
   * Validate content integrity and relationships
   */
  private validateContent(content: ContentLibrary): ContentValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check that all workflow task IDs exist
    content.workflows.forEach(workflow => {
      workflow.taskIds.forEach(taskId => {
        if (!content.tasks.find(t => t.id === taskId)) {
          errors.push(`Workflow "${workflow.name}" references non-existent task: ${taskId}`);
        }
      });
    });

    // Check that all goal workflow IDs exist
    content.goals.forEach(goal => {
      goal.workflowIds.forEach(workflowId => {
        if (!content.workflows.find(w => w.id === workflowId)) {
          errors.push(`Goal "${goal.name}" references non-existent workflow: ${workflowId}`);
        }
      });

      // Check required vs optional workflows
      goal.requiredWorkflows.forEach(workflowId => {
        if (!goal.workflowIds.includes(workflowId)) {
          warnings.push(`Goal "${goal.name}" has required workflow "${workflowId}" not in workflowIds`);
        }
      });

      goal.optionalWorkflows.forEach(workflowId => {
        if (!goal.workflowIds.includes(workflowId)) {
          warnings.push(`Goal "${goal.name}" has optional workflow "${workflowId}" not in workflowIds`);
        }
      });
    });

    // Check for orphaned content
    const usedTaskIds = new Set(content.workflows.flatMap(w => w.taskIds));
    const orphanedTasks = content.tasks.filter(t => !usedTaskIds.has(t.id));
    if (orphanedTasks.length > 0) {
      warnings.push(`Found ${orphanedTasks.length} orphaned tasks: ${orphanedTasks.map(t => t.name).join(', ')}`);
    }

    const usedWorkflowIds = new Set(content.goals.flatMap(g => g.workflowIds));
    const orphanedWorkflows = content.workflows.filter(w => !usedWorkflowIds.has(w.id));
    if (orphanedWorkflows.length > 0) {
      warnings.push(`Found ${orphanedWorkflows.length} orphaned workflows: ${orphanedWorkflows.map(w => w.name).join(', ')}`);
    }

    // Check for duplicate IDs
    const taskIds = content.tasks.map(t => t.id);
    const duplicateTaskIds = taskIds.filter((id, index) => taskIds.indexOf(id) !== index);
    if (duplicateTaskIds.length > 0) {
      errors.push(`Duplicate task IDs found: ${duplicateTaskIds.join(', ')}`);
    }

    const workflowIds = content.workflows.map(w => w.id);
    const duplicateWorkflowIds = workflowIds.filter((id, index) => workflowIds.indexOf(id) !== index);
    if (duplicateWorkflowIds.length > 0) {
      errors.push(`Duplicate workflow IDs found: ${duplicateWorkflowIds.join(', ')}`);
    }

    const goalIds = content.goals.map(g => g.id);
    const duplicateGoalIds = goalIds.filter((id, index) => goalIds.indexOf(id) !== index);
    if (duplicateGoalIds.length > 0) {
      errors.push(`Duplicate goal IDs found: ${duplicateGoalIds.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get content statistics
   */
  getContentStats(content: ContentLibrary): ContentStats {
    const taskCategories = new Map<string, number>();
    const taskDifficulties = new Map<string, number>();

    content.tasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      taskCategories.set(category, (taskCategories.get(category) || 0) + 1);
      taskDifficulties.set(task.difficulty, (taskDifficulties.get(task.difficulty) || 0) + 1);
    });

    return {
      totalGoals: content.goals.length,
      totalWorkflows: content.workflows.length,
      totalTasks: content.tasks.length,
      publishedGoals: content.goals.filter(g => g.status === 'published').length,
      publishedWorkflows: content.workflows.filter(w => w.status === 'published').length,
      publishedTasks: content.tasks.filter(t => t.status === 'published').length,
      categoryBreakdown: Object.fromEntries(taskCategories),
      difficultyBreakdown: Object.fromEntries(taskDifficulties),
      averageTaskTime: content.tasks.reduce((sum, t) => sum + t.estimatedTime, 0) / content.tasks.length || 0,
      averageWorkflowTime: content.workflows.reduce((sum, w) => sum + w.estimatedTime, 0) / content.workflows.length || 0
    };
  }

  /**
   * Check if content needs updates (compare versions, timestamps, etc.)
   */
  checkForUpdates(currentContent: ContentLibrary): Promise<UpdateCheckResult> {
    return new Promise(resolve => {
      // In a real implementation, this would check against a remote source
      // For now, we'll compare against the TypeScript version
      const tsContent = CONTENT_LIBRARY;
      
      const hasUpdates = this.compareContentVersions(currentContent, tsContent);
      
      resolve({
        hasUpdates,
        lastChecked: new Date(),
        updateSource: 'typescript',
        changedItems: hasUpdates ? ['Content may have been updated'] : []
      });
    });
  }

  /**
   * Compare content versions to detect changes
   */
  private compareContentVersions(current: ContentLibrary, updated: ContentLibrary): boolean {
    // Simple comparison based on counts and last update dates
    if (current.goals.length !== updated.goals.length ||
        current.workflows.length !== updated.workflows.length ||
        current.tasks.length !== updated.tasks.length) {
      return true;
    }

    // Check if any items have newer versions
    const hasNewerGoals = updated.goals.some(updatedGoal => {
      const currentGoal = current.goals.find(g => g.id === updatedGoal.id);
      return !currentGoal || updatedGoal.version > currentGoal.version;
    });

    const hasNewerWorkflows = updated.workflows.some(updatedWorkflow => {
      const currentWorkflow = current.workflows.find(w => w.id === updatedWorkflow.id);
      return !currentWorkflow || updatedWorkflow.version > currentWorkflow.version;
    });

    const hasNewerTasks = updated.tasks.some(updatedTask => {
      const currentTask = current.tasks.find(t => t.id === updatedTask.id);
      return !currentTask || updatedTask.version > currentTask.version;
    });

    return hasNewerGoals || hasNewerWorkflows || hasNewerTasks;
  }
}

// Supporting interfaces

export interface ContentStats {
  totalGoals: number;
  totalWorkflows: number;
  totalTasks: number;
  publishedGoals: number;
  publishedWorkflows: number;
  publishedTasks: number;
  categoryBreakdown: Record<string, number>;
  difficultyBreakdown: Record<string, number>;
  averageTaskTime: number;
  averageWorkflowTime: number;
}

export interface UpdateCheckResult {
  hasUpdates: boolean;
  lastChecked: Date;
  updateSource: 'typescript' | 'json' | 'remote';
  changedItems: string[];
}