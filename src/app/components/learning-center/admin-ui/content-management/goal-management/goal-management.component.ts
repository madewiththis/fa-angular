import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';

import { LearningContentService } from '../../../services/learning-content.service';
import { ContentManagementService, GoalFormData } from '../../../services/content-management.service';
import { LearningGoal, UserRole, BusinessType, ContentStatus } from '../../../models/learning-content.types';

@Component({
  selector: 'app-goal-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSliderModule
  ],
  templateUrl: './goal-management.component.html',
  styleUrl: './goal-management.component.scss'
})
export class GoalManagementComponent {
  private learningContentService = inject(LearningContentService);
  private contentManagementService = inject(ContentManagementService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Data
  readonly goals = this.learningContentService.goals;
  readonly workflows = this.learningContentService.workflows;
  
  // UI State
  isEditing = signal<boolean>(false);
  editingGoalId = signal<string | null>(null);
  showForm = signal<boolean>(false);
  
  // Form
  goalForm: FormGroup;
  
  // Table configuration
  displayedColumns = ['name', 'priority', 'status', 'workflows', 'roles', 'actions'];
  
  // Filter and sort
  statusFilter = signal<ContentStatus | 'all'>('all');
  sortBy = signal<'name' | 'priority' | 'lastUpdated'>('priority');
  sortDirection = signal<'asc' | 'desc'>('asc');
  
  // Computed filtered and sorted goals
  readonly filteredGoals = computed(() => {
    let goals = this.goals();
    
    // Apply status filter
    const status = this.statusFilter();
    if (status !== 'all') {
      goals = goals.filter(goal => goal.status === status);
    }
    
    // Apply sorting
    const sortBy = this.sortBy();
    const direction = this.sortDirection();
    
    goals = [...goals].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'priority':
          aValue = a.priority;
          bValue = b.priority;
          break;
        case 'lastUpdated':
          aValue = a.lastUpdated.getTime();
          bValue = b.lastUpdated.getTime();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return goals;
  });

  // Dropdown options (simplified for MVP)
  readonly userRoles: string[] = ['owner', 'accountant', 'staff', 'administrator', 'freelancer', 'student'];
  readonly businessTypes: string[] = ['service', 'retail', 'manufacturing', 'freelancer', 'e_commerce', 'consulting'];
  readonly statusOptions: ContentStatus[] = ['draft', 'published', 'archived'];

  constructor() {
    this.goalForm = this.createGoalForm();
  }

  private createGoalForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      businessValue: ['', [Validators.required, Validators.minLength(10)]],
      priority: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      workflowIds: [[]],
      requiredWorkflows: [[]],
      optionalWorkflows: [[]],
      applicableRoles: [[], Validators.required],
      applicableBusinessTypes: [[], Validators.required],
      successMetrics: this.fb.array([]),
      expectedOutcome: ['', [Validators.required, Validators.minLength(10)]],
      status: ['draft' as ContentStatus, Validators.required],
      // Content Attachments (simplified for MVP)
      contentAttachments: this.fb.group({
        videoUrls: this.fb.array([]),
        articleUrls: this.fb.array([]),
        aiPrompts: this.fb.array([]),
        attachmentNotes: ['']
      })
    });
  }

  get successMetricsArray(): FormArray {
    return this.goalForm.get('successMetrics') as FormArray;
  }

  get contentAttachmentsGroup(): FormGroup {
    return this.goalForm.get('contentAttachments') as FormGroup;
  }

  get videoUrlsArray(): FormArray {
    return this.contentAttachmentsGroup.get('videoUrls') as FormArray;
  }

  get articleUrlsArray(): FormArray {
    return this.contentAttachmentsGroup.get('articleUrls') as FormArray;
  }

  get aiPromptsArray(): FormArray {
    return this.contentAttachmentsGroup.get('aiPrompts') as FormArray;
  }

  addSuccessMetric(): void {
    this.successMetricsArray.push(this.fb.control('', Validators.required));
  }

  removeSuccessMetric(index: number): void {
    this.successMetricsArray.removeAt(index);
  }

  // Content Attachment Management (MVP methods)
  addVideoUrl(): void {
    this.videoUrlsArray.push(this.fb.control('', Validators.required));
  }

  removeVideoUrl(index: number): void {
    this.videoUrlsArray.removeAt(index);
  }

  addArticleUrl(): void {
    this.articleUrlsArray.push(this.fb.control('', Validators.required));
  }

  removeArticleUrl(index: number): void {
    this.articleUrlsArray.removeAt(index);
  }

  addAiPrompt(): void {
    this.aiPromptsArray.push(this.fb.control('', Validators.required));
  }

  removeAiPrompt(index: number): void {
    this.aiPromptsArray.removeAt(index);
  }

  showCreateForm(): void {
    this.isEditing.set(false);
    this.editingGoalId.set(null);
    this.goalForm.reset();
    this.goalForm.patchValue({ priority: 1, status: 'draft' });
    this.successMetricsArray.clear();
    this.showForm.set(true);
  }

  editGoal(goal: LearningGoal): void {
    this.isEditing.set(true);
    this.editingGoalId.set(goal.id);
    
    // Clear existing metrics
    this.successMetricsArray.clear();
    
    // Add metrics to form array
    goal.successMetrics.forEach(metric => {
      this.successMetricsArray.push(this.fb.control(metric, Validators.required));
    });
    
    // Clear and populate content attachments
    this.videoUrlsArray.clear();
    this.articleUrlsArray.clear();
    this.aiPromptsArray.clear();
    
    goal.contentAttachments.videoUrls.forEach(url => {
      this.videoUrlsArray.push(this.fb.control(url, Validators.required));
    });
    
    goal.contentAttachments.articleUrls.forEach(url => {
      this.articleUrlsArray.push(this.fb.control(url, Validators.required));
    });
    
    goal.contentAttachments.aiPrompts.forEach(prompt => {
      this.aiPromptsArray.push(this.fb.control(prompt, Validators.required));
    });
    
    // Patch form with goal data
    this.goalForm.patchValue({
      name: goal.name,
      description: goal.description,
      businessValue: goal.businessValue,
      priority: goal.priority,
      workflowIds: goal.workflowIds,
      requiredWorkflows: goal.requiredWorkflows,
      optionalWorkflows: goal.optionalWorkflows,
      applicableRoles: goal.applicableRoles,
      applicableBusinessTypes: goal.applicableBusinessTypes,
      expectedOutcome: goal.expectedOutcome,
      status: goal.status,
      contentAttachments: {
        attachmentNotes: goal.contentAttachments.attachmentNotes || ''
      }
    });
    
    this.showForm.set(true);
  }

  async saveGoal(): Promise<void> {
    if (this.goalForm.invalid) {
      this.markFormGroupTouched(this.goalForm);
      return;
    }

    const formData: GoalFormData = {
      ...this.goalForm.value,
      successMetrics: this.successMetricsArray.value.filter((metric: string) => metric.trim()),
      contentAttachments: {
        videoUrls: this.videoUrlsArray.value.filter((url: string) => url.trim()),
        videoDurations: [],
        articleUrls: this.articleUrlsArray.value.filter((url: string) => url.trim()),
        articleTitles: [],
        aiPrompts: this.aiPromptsArray.value.filter((prompt: string) => prompt.trim()),
        aiContexts: [],
        resourceUrls: [],
        resourceDescriptions: [],
        attachmentNotes: this.contentAttachmentsGroup.get('attachmentNotes')?.value || ''
      }
    };

    try {
      if (this.isEditing()) {
        const goalId = this.editingGoalId();
        if (goalId) {
          await this.contentManagementService.updateGoal(goalId, formData);
          this.snackBar.open('Goal updated successfully', 'Close', { duration: 3000 });
        }
      } else {
        await this.contentManagementService.createGoal(formData);
        this.snackBar.open('Goal created successfully', 'Close', { duration: 3000 });
      }
      
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving goal:', error);
      this.snackBar.open('Error saving goal', 'Close', { duration: 3000 });
    }
  }

  async duplicateGoal(goal: LearningGoal): Promise<void> {
    const formData: GoalFormData = {
      name: goal.name + ' (Copy)',
      description: goal.description,
      businessValue: goal.businessValue,
      priority: goal.priority,
      workflowIds: [...goal.workflowIds],
      requiredWorkflows: [...goal.requiredWorkflows],
      optionalWorkflows: [...goal.optionalWorkflows],
      applicableRoles: [...goal.applicableRoles],
      applicableBusinessTypes: [...goal.applicableBusinessTypes],
      successMetrics: [...goal.successMetrics],
      expectedOutcome: goal.expectedOutcome,
      status: 'draft',
      contentAttachments: {
        videoUrls: [...goal.contentAttachments.videoUrls],
        videoDurations: [...(goal.contentAttachments.videoDurations || [])],
        articleUrls: [...goal.contentAttachments.articleUrls],
        articleTitles: [...(goal.contentAttachments.articleTitles || [])],
        aiPrompts: [...goal.contentAttachments.aiPrompts],
        aiContexts: [...(goal.contentAttachments.aiContexts || [])],
        resourceUrls: [...(goal.contentAttachments.resourceUrls || [])],
        resourceDescriptions: [...(goal.contentAttachments.resourceDescriptions || [])],
        attachmentNotes: goal.contentAttachments.attachmentNotes || ''
      }
    };

    try {
      await this.contentManagementService.createGoal(formData);
      this.snackBar.open('Goal duplicated successfully', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error duplicating goal:', error);
      this.snackBar.open('Error duplicating goal', 'Close', { duration: 3000 });
    }
  }

  async deleteGoal(goal: LearningGoal): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${goal.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await this.contentManagementService.deleteGoal(goal.id);
      this.snackBar.open('Goal deleted successfully', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error deleting goal:', error);
      this.snackBar.open('Error deleting goal', 'Close', { duration: 3000 });
    }
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.editingGoalId.set(null);
    this.goalForm.reset();
    this.successMetricsArray.clear();
  }

  onStatusFilterChange(status: ContentStatus | 'all'): void {
    this.statusFilter.set(status);
  }

  onSortChange(column: 'name' | 'priority' | 'lastUpdated'): void {
    if (this.sortBy() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDirection.set('asc');
    }
  }

  getWorkflowNames(workflowIds: string[]): string {
    const workflows = this.workflows();
    return workflowIds
      .map(id => workflows.find(w => w.id === id)?.name)
      .filter(name => name)
      .join(', ');
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}