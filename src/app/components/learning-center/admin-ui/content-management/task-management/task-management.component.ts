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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

import { LearningContentService } from '../../../services/learning-content.service';
import { ContentManagementService, TaskFormData } from '../../../services/content-management.service';
import { LearningTask, DifficultyLevel, ContentStatus } from '../../../models/learning-content.types';

@Component({
  selector: 'app-task-management',
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
    MatTooltipModule,
    MatCheckboxModule,
    MatMenuModule,
    MatChipsModule
  ],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss'
})
export class TaskManagementComponent {
  private learningContentService = inject(LearningContentService);
  private contentManagementService = inject(ContentManagementService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // Data
  readonly tasks = this.learningContentService.tasks;
  
  // UI State
  isEditing = signal<boolean>(false);
  editingTaskId = signal<string | null>(null);
  showForm = signal<boolean>(false);
  
  // Form
  taskForm: FormGroup;
  
  // Table configuration
  displayedColumns = ['select', 'name', 'difficulty', 'estimatedTime', 'status', 'category', 'actions'];
  
  // Search and Filters
  searchQuery = signal<string>('');
  statusFilter = signal<ContentStatus | 'all'>('all');
  difficultyFilter = signal<DifficultyLevel | 'all'>('all');
  categoryFilter = signal<string>('all');
  sortBy = signal<'name' | 'difficulty' | 'estimatedTime'>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  
  // Selection State
  selectedTasks = signal<Set<string>>(new Set());
  selectAll = signal<boolean>(false);
  indeterminate = signal<boolean>(false);
  
  // Active Filters (for filter pills)
  activeFilters = computed(() => {
    const filters = [];
    if (this.searchQuery()) filters.push({ type: 'search', value: this.searchQuery(), label: `Search: "${this.searchQuery()}"` });
    if (this.statusFilter() !== 'all') filters.push({ type: 'status', value: this.statusFilter(), label: `Status: ${this.statusFilter()}` });
    if (this.difficultyFilter() !== 'all') filters.push({ type: 'difficulty', value: this.difficultyFilter(), label: `Difficulty: ${this.difficultyFilter()}` });
    if (this.categoryFilter() !== 'all') filters.push({ type: 'category', value: this.categoryFilter(), label: `Category: ${this.categoryFilter()}` });
    return filters;
  });
  
  // Column Filter Options
  readonly uniqueCategories = computed(() => {
    const categories = new Set(this.tasks().map(task => task.category || 'Uncategorized'));
    return Array.from(categories).sort();
  });
  
  // Selection computed properties
  readonly selectedCount = computed(() => this.selectedTasks().size);
  readonly hasSelection = computed(() => this.selectedCount() > 0);
  readonly isAllSelected = computed(() => {
    const filtered = this.filteredTasks();
    return filtered.length > 0 && this.selectedTasks().size === filtered.length;
  });
  readonly isIndeterminate = computed(() => {
    const selected = this.selectedCount();
    return selected > 0 && selected < this.filteredTasks().length;
  });
  
  // Computed filtered and sorted tasks
  readonly filteredTasks = computed(() => {
    let tasks = this.tasks();
    
    // Apply search filter
    const searchQuery = this.searchQuery().toLowerCase().trim();
    if (searchQuery) {
      tasks = tasks.filter(task => 
        task.name.toLowerCase().includes(searchQuery) ||
        task.description.toLowerCase().includes(searchQuery) ||
        (task.category || '').toLowerCase().includes(searchQuery) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }
    
    // Apply status filter
    const status = this.statusFilter();
    if (status !== 'all') {
      tasks = tasks.filter(task => task.status === status);
    }
    
    // Apply difficulty filter
    const difficulty = this.difficultyFilter();
    if (difficulty !== 'all') {
      tasks = tasks.filter(task => task.difficulty === difficulty);
    }
    
    // Apply category filter
    const category = this.categoryFilter();
    if (category !== 'all') {
      tasks = tasks.filter(task => (task.category || 'Uncategorized') === category);
    }
    
    // Apply sorting
    const sortBy = this.sortBy();
    const direction = this.sortDirection();
    
    tasks = [...tasks].sort((a, b) => {
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
        default:
          return 0;
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return tasks;
  });

  // Dropdown options
  readonly difficultyOptions: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
  readonly statusOptions: ContentStatus[] = ['draft', 'published', 'archived'];
  readonly actionTypes = ['click', 'input', 'navigate', 'wait', 'verify', 'upload', 'select', 'review'];
  readonly completionTypes = ['automatic', 'user_confirmation', 'system_check'];

  constructor() {
    this.taskForm = this.createTaskForm();
  }

  private createTaskForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      outcome: ['', [Validators.required, Validators.minLength(10)]],
      estimatedTime: [10, [Validators.required, Validators.min(1)]],
      difficulty: ['beginner' as DifficultyLevel, Validators.required],
      category: ['', Validators.required],
      tags: this.fb.array([]),
      status: ['draft' as ContentStatus, Validators.required],
      // Content Attachments
      contentAttachments: this.fb.group({
        videoUrls: this.fb.array([]),
        articleUrls: this.fb.array([]),
        aiPrompts: this.fb.array([]),
        attachmentNotes: ['']
      }),
      // Instructions
      instructions: this.fb.group({
        overview: ['', [Validators.required, Validators.minLength(10)]],
        steps: this.fb.array([]),
        expectedResult: ['', [Validators.required, Validators.minLength(10)]]
      }),
      // Completion Criteria
      completionCriteria: this.fb.group({
        type: ['user_confirmation', Validators.required],
        criteria: this.fb.array([])
      }),
      // Optional fields
      tips: this.fb.array([]),
      troubleshooting: this.fb.array([]),
      prerequisites: this.fb.array([])
    });
  }

  // Form Array Getters
  get tagsArray(): FormArray { return this.taskForm.get('tags') as FormArray; }
  get contentAttachmentsGroup(): FormGroup { return this.taskForm.get('contentAttachments') as FormGroup; }
  get videoUrlsArray(): FormArray { return this.contentAttachmentsGroup.get('videoUrls') as FormArray; }
  get articleUrlsArray(): FormArray { return this.contentAttachmentsGroup.get('articleUrls') as FormArray; }
  get aiPromptsArray(): FormArray { return this.contentAttachmentsGroup.get('aiPrompts') as FormArray; }
  get instructionsGroup(): FormGroup { return this.taskForm.get('instructions') as FormGroup; }
  get stepsArray(): FormArray { return this.instructionsGroup.get('steps') as FormArray; }
  get completionCriteriaGroup(): FormGroup { return this.taskForm.get('completionCriteria') as FormGroup; }
  get criteriaArray(): FormArray { return this.completionCriteriaGroup.get('criteria') as FormArray; }
  get tipsArray(): FormArray { return this.taskForm.get('tips') as FormArray; }
  get troubleshootingArray(): FormArray { return this.taskForm.get('troubleshooting') as FormArray; }
  get prerequisitesArray(): FormArray { return this.taskForm.get('prerequisites') as FormArray; }

  // Array Management Methods
  addTag(): void { this.tagsArray.push(this.fb.control('', Validators.required)); }
  removeTag(index: number): void { this.tagsArray.removeAt(index); }
  
  addVideoUrl(): void { this.videoUrlsArray.push(this.fb.control('', Validators.required)); }
  removeVideoUrl(index: number): void { this.videoUrlsArray.removeAt(index); }
  
  addArticleUrl(): void { this.articleUrlsArray.push(this.fb.control('', Validators.required)); }
  removeArticleUrl(index: number): void { this.articleUrlsArray.removeAt(index); }
  
  addAiPrompt(): void { this.aiPromptsArray.push(this.fb.control('', Validators.required)); }
  removeAiPrompt(index: number): void { this.aiPromptsArray.removeAt(index); }

  addStep(): void {
    this.stepsArray.push(this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      action: ['click', Validators.required],
      target: [''],
      inputValue: ['']
    }));
  }
  removeStep(index: number): void { this.stepsArray.removeAt(index); }

  addCriterion(): void {
    this.criteriaArray.push(this.fb.group({
      field: ['', Validators.required],
      operator: ['equals', Validators.required],
      expectedValue: ['', Validators.required]
    }));
  }
  removeCriterion(index: number): void { this.criteriaArray.removeAt(index); }

  addTip(): void { this.tipsArray.push(this.fb.control('', Validators.required)); }
  removeTip(index: number): void { this.tipsArray.removeAt(index); }

  addTroubleshooting(): void {
    this.troubleshootingArray.push(this.fb.group({
      commonIssue: ['', Validators.required],
      solution: ['', Validators.required]
    }));
  }
  removeTroubleshooting(index: number): void { this.troubleshootingArray.removeAt(index); }

  addPrerequisite(): void { this.prerequisitesArray.push(this.fb.control('', Validators.required)); }
  removePrerequisite(index: number): void { this.prerequisitesArray.removeAt(index); }

  showCreateForm(): void {
    this.isEditing.set(false);
    this.editingTaskId.set(null);
    this.taskForm.reset();
    this.taskForm.patchValue({ difficulty: 'beginner', status: 'draft', estimatedTime: 10 });
    this.clearAllArrays();
    this.showForm.set(true);
  }

  private clearAllArrays(): void {
    this.tagsArray.clear();
    this.videoUrlsArray.clear();
    this.articleUrlsArray.clear();
    this.aiPromptsArray.clear();
    this.stepsArray.clear();
    this.criteriaArray.clear();
    this.tipsArray.clear();
    this.troubleshootingArray.clear();
    this.prerequisitesArray.clear();
  }

  editTask(task: LearningTask): void {
    this.isEditing.set(true);
    this.editingTaskId.set(task.id);
    this.clearAllArrays();
    
    // Populate arrays
    task.tags.forEach(tag => this.tagsArray.push(this.fb.control(tag, Validators.required)));
    task.contentAttachments.videoUrls.forEach(url => this.videoUrlsArray.push(this.fb.control(url, Validators.required)));
    task.contentAttachments.articleUrls.forEach(url => this.articleUrlsArray.push(this.fb.control(url, Validators.required)));
    task.contentAttachments.aiPrompts.forEach(prompt => this.aiPromptsArray.push(this.fb.control(prompt, Validators.required)));
    
    task.instructions.steps.forEach(step => {
      this.stepsArray.push(this.fb.group({
        title: [step.title, Validators.required],
        description: [step.description, Validators.required],
        action: [step.action, Validators.required],
        target: [step.target || ''],
        inputValue: [step.inputValue || '']
      }));
    });

    task.completionCriteria.criteria.forEach(criterion => {
      this.criteriaArray.push(this.fb.group({
        field: [criterion.field, Validators.required],
        operator: [criterion.operator, Validators.required],
        expectedValue: [criterion.expectedValue, Validators.required]
      }));
    });

    if (task.tips) task.tips.forEach(tip => this.tipsArray.push(this.fb.control(tip, Validators.required)));
    if (task.troubleshooting) task.troubleshooting.forEach(t => {
      this.troubleshootingArray.push(this.fb.group({
        commonIssue: [t.commonIssue, Validators.required],
        solution: [t.solution, Validators.required]
      }));
    });
    if (task.prerequisites) task.prerequisites.forEach(p => this.prerequisitesArray.push(this.fb.control(p, Validators.required)));
    
    // Patch form values
    this.taskForm.patchValue({
      name: task.name,
      description: task.description,
      outcome: task.outcome,
      estimatedTime: task.estimatedTime,
      difficulty: task.difficulty,
      category: task.category || '',
      status: task.status,
      contentAttachments: {
        attachmentNotes: task.contentAttachments.attachmentNotes || ''
      },
      instructions: {
        overview: task.instructions.overview,
        expectedResult: task.instructions.expectedResult
      },
      completionCriteria: {
        type: task.completionCriteria.type
      }
    });
    
    this.showForm.set(true);
  }

  async saveTask(): Promise<void> {
    if (this.taskForm.invalid) {
      this.markFormGroupTouched(this.taskForm);
      return;
    }

    const formData: TaskFormData = {
      ...this.taskForm.value,
      tags: this.tagsArray.value.filter((tag: string) => tag.trim()),
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
      instructions: {
        overview: this.instructionsGroup.get('overview')?.value,
        steps: this.stepsArray.value,
        expectedResult: this.instructionsGroup.get('expectedResult')?.value
      },
      completionCriteria: {
        type: this.completionCriteriaGroup.get('type')?.value,
        criteria: this.criteriaArray.value
      },
      tips: this.tipsArray.value.filter((tip: string) => tip.trim()),
      troubleshooting: this.troubleshootingArray.value,
      prerequisites: this.prerequisitesArray.value.filter((p: string) => p.trim())
    };

    try {
      if (this.isEditing()) {
        const taskId = this.editingTaskId();
        if (taskId) {
          await this.contentManagementService.updateTask(taskId, formData);
          this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
        }
      } else {
        await this.contentManagementService.createTask(formData);
        this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
      }
      
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving task:', error);
      this.snackBar.open('Error saving task', 'Close', { duration: 3000 });
    }
  }

  async duplicateTask(task: LearningTask): Promise<void> {
    const formData: TaskFormData = {
      name: task.name + ' (Copy)',
      description: task.description,
      outcome: task.outcome,
      estimatedTime: task.estimatedTime,
      difficulty: task.difficulty,
      category: task.category || '',
      tags: [...task.tags],
      status: 'draft',
      contentAttachments: {
        videoUrls: [...task.contentAttachments.videoUrls],
        videoDurations: [...(task.contentAttachments.videoDurations || [])],
        articleUrls: [...task.contentAttachments.articleUrls], 
        articleTitles: [...(task.contentAttachments.articleTitles || [])],
        aiPrompts: [...task.contentAttachments.aiPrompts],
        aiContexts: [...(task.contentAttachments.aiContexts || [])],
        resourceUrls: [...(task.contentAttachments.resourceUrls || [])],
        resourceDescriptions: [...(task.contentAttachments.resourceDescriptions || [])],
        attachmentNotes: task.contentAttachments.attachmentNotes || ''
      },
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
      tips: task.tips ? [...task.tips] : [],
      troubleshooting: task.troubleshooting ? task.troubleshooting.map(t => ({
        commonIssue: t.commonIssue,
        solution: t.solution
      })) : [],
      prerequisites: task.prerequisites ? [...task.prerequisites] : []
    };

    try {
      await this.contentManagementService.createTask(formData);
      this.snackBar.open('Task duplicated successfully', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error duplicating task:', error);
      this.snackBar.open('Error duplicating task', 'Close', { duration: 3000 });
    }
  }

  async deleteTask(task: LearningTask): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${task.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await this.contentManagementService.deleteTask(task.id);
      this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error deleting task:', error);
      this.snackBar.open('Error deleting task', 'Close', { duration: 3000 });
    }
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.editingTaskId.set(null);
    this.taskForm.reset();
    this.clearAllArrays();
  }

  // Search and Filter Methods
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.clearSelection();
  }

  onStatusFilterChange(status: ContentStatus | 'all'): void {
    this.statusFilter.set(status);
    this.clearSelection();
  }

  onDifficultyFilterChange(difficulty: DifficultyLevel | 'all'): void {
    this.difficultyFilter.set(difficulty);
    this.clearSelection();
  }

  onCategoryFilterChange(category: string): void {
    this.categoryFilter.set(category);
    this.clearSelection();
  }

  removeFilter(filterType: string): void {
    switch (filterType) {
      case 'search':
        this.searchQuery.set('');
        break;
      case 'status':
        this.statusFilter.set('all');
        break;
      case 'difficulty':
        this.difficultyFilter.set('all');
        break;
      case 'category':
        this.categoryFilter.set('all');
        break;
    }
    this.clearSelection();
  }

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.difficultyFilter.set('all');
    this.categoryFilter.set('all');
    this.clearSelection();
  }

  onSortChange(column: 'name' | 'difficulty' | 'estimatedTime'): void {
    if (this.sortBy() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDirection.set('asc');
    }
  }

  // Selection Methods
  toggleSelectAll(): void {
    const filteredTasks = this.filteredTasks();
    const currentSelection = new Set(this.selectedTasks());
    
    if (this.isAllSelected()) {
      // Deselect all visible tasks
      filteredTasks.forEach(task => currentSelection.delete(task.id));
    } else {
      // Select all visible tasks
      filteredTasks.forEach(task => currentSelection.add(task.id));
    }
    
    this.selectedTasks.set(currentSelection);
  }

  toggleTaskSelection(taskId: string): void {
    const currentSelection = new Set(this.selectedTasks());
    
    if (currentSelection.has(taskId)) {
      currentSelection.delete(taskId);
    } else {
      currentSelection.add(taskId);
    }
    
    this.selectedTasks.set(currentSelection);
  }

  isTaskSelected(taskId: string): boolean {
    return this.selectedTasks().has(taskId);
  }

  clearSelection(): void {
    this.selectedTasks.set(new Set());
  }

  // Bulk Actions
  async bulkUpdateStatus(newStatus: ContentStatus): Promise<void> {
    const selectedIds = Array.from(this.selectedTasks());
    if (selectedIds.length === 0) {
      this.snackBar.open('No tasks selected', 'Close', { duration: 3000 });
      return;
    }

    try {
      const updatePromises = selectedIds.map(taskId => 
        this.learningContentService.updateTask(taskId, { status: newStatus })
      );
      
      await Promise.all(updatePromises);
      this.snackBar.open(`Updated ${selectedIds.length} tasks to ${newStatus}`, 'Close', { duration: 3000 });
      this.clearSelection();
    } catch (error) {
      console.error('Error updating tasks:', error);
      this.snackBar.open('Error updating tasks', 'Close', { duration: 3000 });
    }
  }

  async bulkUpdateCategory(newCategory: string): Promise<void> {
    const selectedIds = Array.from(this.selectedTasks());
    if (selectedIds.length === 0) {
      this.snackBar.open('No tasks selected', 'Close', { duration: 3000 });
      return;
    }

    try {
      const updatePromises = selectedIds.map(taskId => 
        this.learningContentService.updateTask(taskId, { category: newCategory })
      );
      
      await Promise.all(updatePromises);
      this.snackBar.open(`Updated ${selectedIds.length} tasks to category: ${newCategory}`, 'Close', { duration: 3000 });
      this.clearSelection();
    } catch (error) {
      console.error('Error updating task categories:', error);
      this.snackBar.open('Error updating task categories', 'Close', { duration: 3000 });
    }
  }

  async bulkDelete(): Promise<void> {
    const selectedIds = Array.from(this.selectedTasks());
    if (selectedIds.length === 0) {
      this.snackBar.open('No tasks selected', 'Close', { duration: 3000 });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected tasks? This action cannot be undone.`)) {
      return;
    }

    try {
      const deletePromises = selectedIds.map(taskId => 
        this.learningContentService.deleteTask(taskId)
      );
      
      await Promise.all(deletePromises);
      this.snackBar.open(`Deleted ${selectedIds.length} tasks`, 'Close', { duration: 3000 });
      this.clearSelection();
    } catch (error) {
      console.error('Error deleting tasks:', error);
      this.snackBar.open('Error deleting tasks', 'Close', { duration: 3000 });
    }
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