// Learning Center Module - Public API
// This is the main entry point for the learning center module

// ===== SERVICES =====
export { LearningContentApiService } from './services/learning-content-api.service';
export { ContentManagementService } from './services/content-management.service';
export { LearningContentService } from './services/learning-content.service';

// ===== DATA SERVICES =====  
export { ContentLoaderService } from './data/content-loader.service';
export { ContentMigratorService } from './data/content-migrator.service';

// ===== TYPES =====
export * from './models/learning-content.types';

// ===== API INTERFACES =====
export type {
  CompleteGoalStructure,
  QuickStartAction,
  PopularTask,
  ActiveGoal,
  NextTaskRecommendation,
  ContextualHelp,
  ContentStats
} from './services/learning-content-api.service';

export type {
  TaskFormData,
  WorkflowFormData,
  GoalFormData
} from './services/content-management.service';

// ===== USAGE EXAMPLES =====

/**
 * CONTENT CONSUMPTION (for other modules):
 * 
 * ```typescript
 * import { LearningContentApiService } from './components/learning-center';
 * 
 * @Component({...})
 * export class DashboardComponent {
 *   constructor(private learningApi: LearningContentApiService) {}
 * 
 *   // Get quick start actions for dashboard
 *   getQuickActions() {
 *     return this.learningApi.getQuickStartActions('owner', 'service', 3);
 *   }
 * 
 *   // Get user's progress
 *   getUserProgress() {
 *     return this.learningApi.getActiveGoals();
 *   }
 * 
 *   // Start a goal
 *   startLearning(goalId: string) {
 *     this.learningApi.startGoal(goalId);
 *   }
 * }
 * ```
 * 
 * CONTENT MANAGEMENT (for admin interfaces):
 * 
 * ```typescript
 * import { ContentManagementService, TaskFormData } from './components/learning-center';
 * 
 * @Component({...})
 * export class AdminComponent {
 *   constructor(private contentMgmt: ContentManagementService) {}
 * 
 *   // Create new task
 *   async createTask(formData: TaskFormData) {
 *     return await this.contentMgmt.createTask(formData);
 *   }
 * 
 *   // Assign task to workflow
 *   async addTaskToWorkflow(workflowId: string, taskId: string) {
 *     return await this.contentMgmt.addTaskToWorkflow(workflowId, taskId);
 *   }
 * }
 * ```
 */