import { Injectable } from '@angular/core';
import {
  LearningTask,
  LearningWorkflow,
  LearningGoal,
  ContentLibrary
} from '../models/learning-content.types';

export interface MigrationOptions {
  includeMetadata: boolean;
  prettifyJSON: boolean;
  includeTimestamps: boolean;
  includeRelationships: boolean;
}

export interface MigrationResult {
  success: boolean;
  output: string;
  format: 'typescript' | 'json';
  errors: string[];
  warnings: string[];
}

export interface RelationshipMap {
  goalToWorkflow: Array<{
    goalId: string;
    goalName: string;
    workflows: Array<{
      workflowId: string;
      workflowName: string;
      isRequired: boolean;
    }>;
  }>;
  workflowToTask: Array<{
    workflowId: string;
    workflowName: string;
    tasks: Array<{
      taskId: string;
      taskName: string;
      order: number;
      isPrerequisite: boolean;
      prerequisites?: string[];
    }>;
  }>;
}

/**
 * Service for converting learning content between TypeScript and JSON formats
 * Enables AI-friendly editing and code-friendly development
 */
@Injectable({
  providedIn: 'root'
})
export class ContentMigratorService {

  private readonly DEFAULT_OPTIONS: MigrationOptions = {
    includeMetadata: true,
    prettifyJSON: true,
    includeTimestamps: true,
    includeRelationships: true
  };

  constructor() {}

  // ===== TYPESCRIPT TO JSON =====

  /**
   * Convert TypeScript content library to JSON format
   */
  async convertToJSON(
    content: ContentLibrary, 
    options: Partial<MigrationOptions> = {}
  ): Promise<MigrationResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Convert individual content types
      const tasksJSON = this.convertTasksToJSON(content.tasks, opts);
      const workflowsJSON = this.convertWorkflowsToJSON(content.workflows, opts);
      const goalsJSON = this.convertGoalsToJSON(content.goals, opts);
      
      // Generate relationships if requested
      let relationshipsJSON = '';
      if (opts.includeRelationships) {
        const relationships = this.generateRelationshipMap(content);
        relationshipsJSON = JSON.stringify(relationships, null, opts.prettifyJSON ? 2 : 0);
      }

      // Combine all outputs
      const output = {
        tasks: tasksJSON,
        workflows: workflowsJSON,
        goals: goalsJSON,
        ...(opts.includeRelationships && { relationships: relationshipsJSON })
      };

      return {
        success: true,
        output: JSON.stringify(output, null, opts.prettifyJSON ? 2 : 0),
        format: 'json',
        errors,
        warnings
      };

    } catch (error) {
      errors.push(`JSON conversion failed: ${error}`);
      return {
        success: false,
        output: '',
        format: 'json',
        errors,
        warnings
      };
    }
  }

  /**
   * Convert tasks to JSON string
   */
  private convertTasksToJSON(tasks: LearningTask[], options: MigrationOptions): string {
    const jsonTasks = tasks.map(task => ({
      ...task,
      lastUpdated: options.includeTimestamps ? task.lastUpdated.toISOString() : undefined
    }));

    return JSON.stringify(jsonTasks, null, options.prettifyJSON ? 2 : 0);
  }

  /**
   * Convert workflows to JSON string
   */
  private convertWorkflowsToJSON(workflows: LearningWorkflow[], options: MigrationOptions): string {
    const jsonWorkflows = workflows.map(workflow => ({
      ...workflow,
      lastUpdated: options.includeTimestamps ? workflow.lastUpdated.toISOString() : undefined
    }));

    return JSON.stringify(jsonWorkflows, null, options.prettifyJSON ? 2 : 0);
  }

  /**
   * Convert goals to JSON string
   */
  private convertGoalsToJSON(goals: LearningGoal[], options: MigrationOptions): string {
    const jsonGoals = goals.map(goal => ({
      ...goal,
      lastUpdated: options.includeTimestamps ? goal.lastUpdated.toISOString() : undefined
    }));

    return JSON.stringify(jsonGoals, null, options.prettifyJSON ? 2 : 0);
  }

  // ===== JSON TO TYPESCRIPT =====

  /**
   * Convert JSON content to TypeScript format
   */
  async convertToTypeScript(
    jsonContent: string,
    options: Partial<MigrationOptions> = {}
  ): Promise<MigrationResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const parsed = JSON.parse(jsonContent);
      
      // Validate structure
      if (!parsed.tasks || !parsed.workflows || !parsed.goals) {
        errors.push('Invalid JSON structure: missing tasks, workflows, or goals');
        throw new Error('Invalid JSON structure');
      }

      // Convert date strings back to Date objects
      const tasks = this.convertJSONToTasks(parsed.tasks);
      const workflows = this.convertJSONToWorkflows(parsed.workflows);
      const goals = this.convertJSONToGoals(parsed.goals);

      // Generate TypeScript file content
      const tsContent = this.generateTypeScriptFile({ tasks, workflows, goals }, opts);

      return {
        success: true,
        output: tsContent,
        format: 'typescript',
        errors,
        warnings
      };

    } catch (error) {
      errors.push(`TypeScript conversion failed: ${error}`);
      return {
        success: false,
        output: '',
        format: 'typescript',
        errors,
        warnings
      };
    }
  }

  /**
   * Convert JSON tasks to TypeScript LearningTask objects
   */
  private convertJSONToTasks(jsonTasks: any[]): LearningTask[] {
    return jsonTasks.map(task => ({
      ...task,
      lastUpdated: task.lastUpdated ? new Date(task.lastUpdated) : new Date()
    }));
  }

  /**
   * Convert JSON workflows to TypeScript LearningWorkflow objects
   */
  private convertJSONToWorkflows(jsonWorkflows: any[]): LearningWorkflow[] {
    return jsonWorkflows.map(workflow => ({
      ...workflow,
      lastUpdated: workflow.lastUpdated ? new Date(workflow.lastUpdated) : new Date()
    }));
  }

  /**
   * Convert JSON goals to TypeScript LearningGoal objects
   */
  private convertJSONToGoals(jsonGoals: any[]): LearningGoal[] {
    return jsonGoals.map(goal => ({
      ...goal,
      lastUpdated: goal.lastUpdated ? new Date(goal.lastUpdated) : new Date()
    }));
  }

  /**
   * Generate complete TypeScript file content
   */
  private generateTypeScriptFile(content: ContentLibrary, options: MigrationOptions): string {
    const timestamp = options.includeTimestamps ? new Date().toISOString() : 'generated';
    
    return `// Learning Content Library - Generated from JSON
// Generated at: ${timestamp}
// This file was auto-generated from JSON content

import {
  LearningTask,
  LearningWorkflow,
  LearningGoal,
  ContentLibrary
} from '../models/learning-content.types';

// ===== TASKS =====

export const LEARNING_TASKS: LearningTask[] = ${this.formatObjectForTypeScript(content.tasks, 2)};

// ===== WORKFLOWS =====

export const LEARNING_WORKFLOWS: LearningWorkflow[] = ${this.formatObjectForTypeScript(content.workflows, 2)};

// ===== GOALS =====

export const LEARNING_GOALS: LearningGoal[] = ${this.formatObjectForTypeScript(content.goals, 2)};

// ===== MAIN EXPORT =====

export const CONTENT_LIBRARY: ContentLibrary = {
  goals: LEARNING_GOALS,
  workflows: LEARNING_WORKFLOWS,
  tasks: LEARNING_TASKS
};

// ===== UTILITY FUNCTIONS =====

export function getAllLearningContent(): ContentLibrary {
  return CONTENT_LIBRARY;
}

export function validateContentIntegrity(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check that all workflow task IDs exist
  LEARNING_WORKFLOWS.forEach(workflow => {
    workflow.taskIds.forEach(taskId => {
      if (!LEARNING_TASKS.find(t => t.id === taskId)) {
        errors.push(\`Workflow "\${workflow.name}" references non-existent task: \${taskId}\`);
      }
    });
  });

  // Check that all goal workflow IDs exist
  LEARNING_GOALS.forEach(goal => {
    goal.workflowIds.forEach(workflowId => {
      if (!LEARNING_WORKFLOWS.find(w => w.id === workflowId)) {
        errors.push(\`Goal "\${goal.name}" references non-existent workflow: \${workflowId}\`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
`;
  }

  /**
   * Format object for TypeScript with proper indentation
   */
  private formatObjectForTypeScript(obj: any, indent: number = 0): string {
    const indentStr = '  '.repeat(indent);
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      
      const items = obj.map(item => this.formatObjectForTypeScript(item, indent + 1));
      return `[\n${items.map(item => `${indentStr}  ${item}`).join(',\n')}\n${indentStr}]`;
    }
    
    if (obj && typeof obj === 'object' && obj.constructor === Object) {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      
      const pairs = keys.map(key => {
        const value = this.formatObjectForTypeScript(obj[key], indent + 1);
        return `${key}: ${value}`;
      });
      
      return `{\n${pairs.map(pair => `${indentStr}  ${pair}`).join(',\n')}\n${indentStr}}`;
    }
    
    if (typeof obj === 'string') {
      return `'${obj.replace(/'/g, "\\\'")}'`;
    }
    
    if (obj instanceof Date) {
      return `new Date('${obj.toISOString()}')`;
    }
    
    return JSON.stringify(obj);
  }

  // ===== RELATIONSHIP MAPPING =====

  /**
   * Generate relationship map for better understanding of content structure
   */
  generateRelationshipMap(content: ContentLibrary): RelationshipMap {
    const goalToWorkflow = content.goals.map(goal => ({
      goalId: goal.id,
      goalName: goal.name,
      workflows: goal.workflowIds.map(workflowId => {
        const workflow = content.workflows.find(w => w.id === workflowId);
        return {
          workflowId,
          workflowName: workflow?.name || 'Unknown Workflow',
          isRequired: goal.requiredWorkflows.includes(workflowId)
        };
      })
    }));

    const workflowToTask = content.workflows.map(workflow => ({
      workflowId: workflow.id,
      workflowName: workflow.name,
      tasks: workflow.taskIds.map((taskId, index) => {
        const task = content.tasks.find(t => t.id === taskId);
        return {
          taskId,
          taskName: task?.name || 'Unknown Task',
          order: index + 1,
          isPrerequisite: task?.prerequisites && task.prerequisites.length > 0 || false,
          prerequisites: task?.prerequisites
        };
      })
    }));

    return {
      goalToWorkflow,
      workflowToTask
    };
  }

  // ===== BULK OPERATIONS =====

  /**
   * Generate individual JSON files for each content type
   */
  async generateSeparateJSONFiles(
    content: ContentLibrary,
    options: Partial<MigrationOptions> = {}
  ): Promise<Record<string, string>> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    const files: Record<string, string> = {};

    // Generate individual files
    files['tasks.json'] = this.convertTasksToJSON(content.tasks, opts);
    files['workflows.json'] = this.convertWorkflowsToJSON(content.workflows, opts);
    files['goals.json'] = this.convertGoalsToJSON(content.goals, opts);

    // Generate relationships file if requested
    if (opts.includeRelationships) {
      const relationships = this.generateRelationshipMap(content);
      const relationshipsWithMetadata = {
        description: 'Defines the relationships between Goals, Workflows, and Tasks',
        version: '1.0.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        relationships,
        metadata: {
          totalGoals: content.goals.length,
          totalWorkflows: content.workflows.length,
          totalTasks: content.tasks.length,
          categoryBreakdown: this.getCategoryBreakdown(content.tasks),
          difficultyBreakdown: this.getDifficultyBreakdown(content.tasks)
        }
      };
      
      files['relationships.json'] = JSON.stringify(relationshipsWithMetadata, null, opts.prettifyJSON ? 2 : 0);
    }

    return files;
  }

  /**
   * Merge content from multiple sources
   */
  mergeContent(primary: ContentLibrary, secondary: ContentLibrary): ContentLibrary {
    const mergedTasks = this.mergeArraysById(primary.tasks, secondary.tasks);
    const mergedWorkflows = this.mergeArraysById(primary.workflows, secondary.workflows);
    const mergedGoals = this.mergeArraysById(primary.goals, secondary.goals);

    return {
      tasks: mergedTasks,
      workflows: mergedWorkflows,
      goals: mergedGoals
    };
  }

  /**
   * Merge arrays by ID, preferring items from the first array
   */
  private mergeArraysById<T extends { id: string }>(primary: T[], secondary: T[]): T[] {
    const primaryIds = new Set(primary.map(item => item.id));
    const uniqueSecondary = secondary.filter(item => !primaryIds.has(item.id));
    return [...primary, ...uniqueSecondary];
  }

  // ===== UTILITY METHODS =====

  private getCategoryBreakdown(tasks: LearningTask[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    tasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      breakdown[category] = (breakdown[category] || 0) + 1;
    });
    return breakdown;
  }

  private getDifficultyBreakdown(tasks: LearningTask[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    tasks.forEach(task => {
      breakdown[task.difficulty] = (breakdown[task.difficulty] || 0) + 1;
    });
    return breakdown;
  }

  /**
   * Validate content before migration
   */
  validateForMigration(content: ContentLibrary): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for required fields
    content.tasks.forEach(task => {
      if (!task.id || !task.name || !task.instructions) {
        errors.push(`Task missing required fields: ${task.id || 'unknown'}`);
      }
    });

    content.workflows.forEach(workflow => {
      if (!workflow.id || !workflow.name || !workflow.taskIds) {
        errors.push(`Workflow missing required fields: ${workflow.id || 'unknown'}`);
      }
    });

    content.goals.forEach(goal => {
      if (!goal.id || !goal.name || !goal.workflowIds) {
        errors.push(`Goal missing required fields: ${goal.id || 'unknown'}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}