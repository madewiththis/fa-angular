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
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LearningContentService } from '../../../services/learning-content.service';
import { ContentManagementService, WorkflowFormData } from '../../../services/content-management.service';
import { LearningWorkflow, LearningTask, DifficultyLevel, ContentStatus, TaskSequence } from '../../../models/learning-content.types';

@Component({
  selector: 'app-workflow-management',
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
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './workflow-management.component.html',
  styleUrl: './workflow-management.component.scss'
})
export class WorkflowManagementComponent {
  private learningContentService = inject(LearningContentService);
  private contentManagementService = inject(ContentManagementService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // Data
  readonly workflows = this.learningContentService.workflows;
  readonly tasks = this.learningContentService.tasks;
  
  // UI State
  isEditing = signal<boolean>(false);
  editingWorkflowId = signal<string | null>(null);
  showForm = signal<boolean>(false);
  
  // Form
  workflowForm: FormGroup;
  
  // Table configuration
  displayedColumns = ['name', 'difficulty', 'taskCount', 'estimatedTime', 'status', 'category', 'actions'];
  
  // Filter and sort
  statusFilter = signal<ContentStatus | 'all'>('all');
  sortBy = signal<'name' | 'difficulty' | 'estimatedTime' | 'taskCount'>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  
  // Computed filtered and sorted workflows
  readonly filteredWorkflows = computed(() => {
    let workflows = this.workflows();
    
    // Apply status filter
    const status = this.statusFilter();
    if (status !== 'all') {
      workflows = workflows.filter(workflow => workflow.status === status);
    }
    
    // Apply sorting
    const sortBy = this.sortBy();
    const direction = this.sortDirection();
    
    workflows = [...workflows].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          aValue = difficultyOrder[a.difficulty];
          bValue = difficultyOrder[b.difficulty];
          break;
        case 'estimatedTime':
          aValue = a.estimatedTime;
          bValue = b.estimatedTime;
          break;
        case 'taskCount':
          aValue = a.taskIds.length;
          bValue = b.taskIds.length;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return workflows;
  });

  // Dropdown options
  readonly difficultyOptions: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
  readonly statusOptions: ContentStatus[] = ['draft', 'published', 'archived'];
  readonly sequenceOptions: TaskSequence[] = ['sequential', 'parallel', 'flexible'];

  // Computed task options for dropdowns
  readonly availableTasks = computed(() => {
    return this.tasks().map(task => ({
      id: task.id,
      name: task.name,
      difficulty: task.difficulty,
      estimatedTime: task.estimatedTime
    }));
  });

  constructor() {
    this.workflowForm = this.createWorkflowForm();
  }

  private createWorkflowForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      outcome: ['', [Validators.required, Validators.minLength(10)]],
      businessValue: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      status: ['draft' as ContentStatus, Validators.required],
      taskSequence: ['sequential' as TaskSequence, Validators.required],
      completionCriteria: ['', [Validators.required, Validators.minLength(10)]],
      // Task Management
      taskIds: this.fb.array([]),
      // Content Attachments
      contentAttachments: this.fb.group({
        videoUrls: this.fb.array([]),
        articleUrls: this.fb.array([]),
        aiPrompts: this.fb.array([]),
        attachmentNotes: ['']
      }),
      // Success Metrics
      successIndicators: this.fb.array([]),
      expectedROI: [''],
      // Prerequisites
      prerequisites: this.fb.array([])
    });
  }

  // Form Array Getters
  get taskIdsArray(): FormArray { return this.workflowForm.get('taskIds') as FormArray; }
  get contentAttachmentsGroup(): FormGroup { return this.workflowForm.get('contentAttachments') as FormGroup; }
  get videoUrlsArray(): FormArray { return this.contentAttachmentsGroup.get('videoUrls') as FormArray; }
  get articleUrlsArray(): FormArray { return this.contentAttachmentsGroup.get('articleUrls') as FormArray; }
  get aiPromptsArray(): FormArray { return this.contentAttachmentsGroup.get('aiPrompts') as FormArray; }
  get successIndicatorsArray(): FormArray { return this.workflowForm.get('successIndicators') as FormArray; }
  get prerequisitesArray(): FormArray { return this.workflowForm.get('prerequisites') as FormArray; }

  // Array Management Methods
  addTaskId(): void {
    this.taskIdsArray.push(this.fb.control('', Validators.required));
  }
  removeTaskId(index: number): void {
    this.taskIdsArray.removeAt(index);
  }
  
  addVideoUrl(): void { this.videoUrlsArray.push(this.fb.control('', Validators.required)); }
  removeVideoUrl(index: number): void { this.videoUrlsArray.removeAt(index); }
  
  addArticleUrl(): void { this.articleUrlsArray.push(this.fb.control('', Validators.required)); }
  removeArticleUrl(index: number): void { this.articleUrlsArray.removeAt(index); }
  
  addAiPrompt(): void { this.aiPromptsArray.push(this.fb.control('', Validators.required)); }
  removeAiPrompt(index: number): void { this.aiPromptsArray.removeAt(index); }

  addSuccessIndicator(): void {
    this.successIndicatorsArray.push(this.fb.control('', Validators.required));
  }
  removeSuccessIndicator(index: number): void {
    this.successIndicatorsArray.removeAt(index);
  }

  addPrerequisite(): void {
    this.prerequisitesArray.push(this.fb.control('', Validators.required));
  }
  removePrerequisite(index: number): void {
    this.prerequisitesArray.removeAt(index);
  }

  showCreateForm(): void {
    this.isEditing.set(false);
    this.editingWorkflowId.set(null);
    this.workflowForm.reset();
    this.workflowForm.patchValue({ 
      status: 'draft',
      taskSequence: 'sequential'
    });
    this.clearAllArrays();
    this.showForm.set(true);
  }

  private clearAllArrays(): void {
    this.taskIdsArray.clear();
    this.videoUrlsArray.clear();
    this.articleUrlsArray.clear();
    this.aiPromptsArray.clear();
    this.successIndicatorsArray.clear();
    this.prerequisitesArray.clear();
  }

  editWorkflow(workflow: LearningWorkflow): void {
    this.isEditing.set(true);
    this.editingWorkflowId.set(workflow.id);
    this.clearAllArrays();
    
    // Populate arrays
    workflow.taskIds.forEach(taskId => this.taskIdsArray.push(this.fb.control(taskId, Validators.required)));
    workflow.contentAttachments.videoUrls.forEach(url => this.videoUrlsArray.push(this.fb.control(url, Validators.required)));
    workflow.contentAttachments.articleUrls.forEach(url => this.articleUrlsArray.push(this.fb.control(url, Validators.required)));
    workflow.contentAttachments.aiPrompts.forEach(prompt => this.aiPromptsArray.push(this.fb.control(prompt, Validators.required)));
    
    if (workflow.successIndicators) {
      workflow.successIndicators.forEach(indicator => this.successIndicatorsArray.push(this.fb.control(indicator, Validators.required)));
    }
    
    if (workflow.prerequisites) {
      workflow.prerequisites.forEach(prereq => this.prerequisitesArray.push(this.fb.control(prereq, Validators.required)));
    }
    
    // Patch form values
    this.workflowForm.patchValue({
      name: workflow.name,
      description: workflow.description,
      outcome: workflow.outcome,
      businessValue: workflow.businessValue,
      category: workflow.category,
      status: workflow.status,
      taskSequence: workflow.taskSequence,
      completionCriteria: workflow.completionCriteria,
      expectedROI: workflow.expectedROI || '',
      contentAttachments: {
        attachmentNotes: workflow.contentAttachments.attachmentNotes || ''
      }
    });
    
    this.showForm.set(true);
  }

  async saveWorkflow(): Promise<void> {
    if (this.workflowForm.invalid) {
      this.markFormGroupTouched(this.workflowForm);
      return;
    }

    const formData: WorkflowFormData = {
      ...this.workflowForm.value,
      taskIds: this.taskIdsArray.value.filter((taskId: string) => taskId.trim()),
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
      },
      successIndicators: this.successIndicatorsArray.value.filter((indicator: string) => indicator.trim()),
      prerequisites: this.prerequisitesArray.value.filter((prereq: string) => prereq.trim())
    };

    try {
      if (this.isEditing()) {
        const workflowId = this.editingWorkflowId();
        if (workflowId) {
          await this.contentManagementService.updateWorkflow(workflowId, formData);
          this.snackBar.open('Workflow updated successfully', 'Close', { duration: 3000 });
        }
      } else {
        await this.contentManagementService.createWorkflow(formData);
        this.snackBar.open('Workflow created successfully', 'Close', { duration: 3000 });
      }
      
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving workflow:', error);
      this.snackBar.open('Error saving workflow', 'Close', { duration: 3000 });
    }
  }

  async duplicateWorkflow(workflow: LearningWorkflow): Promise<void> {
    const formData: WorkflowFormData = {
      name: workflow.name + ' (Copy)',
      description: workflow.description,
      outcome: workflow.outcome,
      businessValue: workflow.businessValue,
      category: workflow.category,
      status: 'draft',
      taskSequence: workflow.taskSequence,
      completionCriteria: workflow.completionCriteria,
      taskIds: [...workflow.taskIds],
      contentAttachments: {
        videoUrls: [...workflow.contentAttachments.videoUrls],
        videoDurations: [...(workflow.contentAttachments.videoDurations || [])],
        articleUrls: [...workflow.contentAttachments.articleUrls],
        articleTitles: [...(workflow.contentAttachments.articleTitles || [])],
        aiPrompts: [...workflow.contentAttachments.aiPrompts],
        aiContexts: [...(workflow.contentAttachments.aiContexts || [])],
        resourceUrls: [...(workflow.contentAttachments.resourceUrls || [])],
        resourceDescriptions: [...(workflow.contentAttachments.resourceDescriptions || [])],
        attachmentNotes: workflow.contentAttachments.attachmentNotes || ''
      },
      successIndicators: workflow.successIndicators ? [...workflow.successIndicators] : [],
      expectedROI: workflow.expectedROI || '',
      prerequisites: workflow.prerequisites ? [...workflow.prerequisites] : []
    };

    try {
      await this.contentManagementService.createWorkflow(formData);
      this.snackBar.open('Workflow duplicated successfully', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error duplicating workflow:', error);
      this.snackBar.open('Error duplicating workflow', 'Close', { duration: 3000 });
    }
  }

  async deleteWorkflow(workflow: LearningWorkflow): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${workflow.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await this.contentManagementService.deleteWorkflow(workflow.id);
      this.snackBar.open('Workflow deleted successfully', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      this.snackBar.open('Error deleting workflow', 'Close', { duration: 3000 });
    }
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.editingWorkflowId.set(null);
    this.workflowForm.reset();
    this.clearAllArrays();
  }

  onStatusFilterChange(status: ContentStatus | 'all'): void {
    this.statusFilter.set(status);
  }

  onSortChange(column: 'name' | 'difficulty' | 'estimatedTime' | 'taskCount'): void {
    if (this.sortBy() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDirection.set('asc');
    }
  }

  // Helper methods for display
  getTaskNames(taskIds: string[]): string {
    return taskIds
      .map(id => this.tasks().find(task => task.id === id)?.name || 'Unknown Task')
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