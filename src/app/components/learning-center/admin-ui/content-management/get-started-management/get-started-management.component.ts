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
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

import { LearningContentService } from '../../../services/learning-content.service';
import { QuickGuideCategory, ContentStatus, LearningTask, LearningWorkflow, LearningGoal } from '../../../models/learning-content.types';

interface QuickGuideCategoryFormData {
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  order: number;
  status: ContentStatus;
  featureMapping?: string;
  assignedTaskIds: string[];
  assignedWorkflowIds: string[];
  assignedGoalIds: string[];
}

@Component({
  selector: 'app-get-started-management',
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
    MatChipsModule,
    MatExpansionModule
  ],
  templateUrl: './get-started-management.component.html',
  styleUrl: './get-started-management.component.scss'
})
export class GetStartedManagementComponent {
  private learningContentService = inject(LearningContentService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // Data
  readonly quickGuideCategories = this.learningContentService.quickGuideCategories;
  readonly tasks = this.learningContentService.tasks;
  readonly workflows = this.learningContentService.workflows;
  readonly goals = this.learningContentService.goals;
  
  // UI State
  isEditing = signal<boolean>(false);
  editingCategoryId = signal<string | null>(null);
  showForm = signal<boolean>(false);
  
  // Form
  categoryForm: FormGroup;
  
  // Table configuration
  displayedColumns = ['order', 'name', 'subtitle', 'status', 'assignedContent', 'actions'];
  
  // Sort
  sortBy = signal<'order' | 'name'>('order');
  sortDirection = signal<'asc' | 'desc'>('asc');
  
  // Computed sorted categories
  readonly sortedCategories = computed(() => {
    let categories = this.quickGuideCategories();
    
    const sortBy = this.sortBy();
    const direction = this.sortDirection();
    
    categories = [...categories].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'order':
          aValue = a.order;
          bValue = b.order;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return categories;
  });

  // Computed statistics for template
  readonly publishedCategoriesCount = computed(() => 
    this.quickGuideCategories().filter(qg => qg.status === 'published').length
  );

  readonly totalAssignedContentCount = computed(() => 
    this.quickGuideCategories().reduce((sum, qg) => sum + this.getTotalAssignedContent(qg), 0)
  );

  // Dropdown options
  readonly statusOptions: ContentStatus[] = ['draft', 'published', 'archived'];
  readonly materialIcons = [
    'dashboard', 'explore', 'point_of_sale', 'shopping_cart', 'receipt_long',
    'account_balance', 'analytics', 'assessment', 'phone_android', 'computer',
    'settings', 'help', 'lightbulb', 'school', 'business', 'work', 'folder',
    'inventory', 'people', 'contact_page', 'event', 'schedule', 'timeline'
  ];

  readonly featureMappingOptions = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'sell', label: 'Sales (Sell)' },
    { value: 'buy', label: 'Purchase (Buy)' },
    { value: 'accounting', label: 'Accounting' },
    { value: 'reports', label: 'Reports' },
    { value: 'products', label: 'Products' },
    { value: 'contacts', label: 'Contacts' },
    { value: 'expenses', label: 'Expenses' },
    { value: 'mobile', label: 'Mobile App' }
  ];

  constructor() {
    this.categoryForm = this.createCategoryForm();
  }

  private createCategoryForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      subtitle: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      icon: ['explore', Validators.required],
      order: [1, [Validators.required, Validators.min(1)]],
      status: ['draft' as ContentStatus, Validators.required],
      featureMapping: [''],
      assignedTaskIds: this.fb.array([]),
      assignedWorkflowIds: this.fb.array([]),
      assignedGoalIds: this.fb.array([])
    });
  }

  // Form Array Getters
  get assignedTaskIdsArray(): FormArray { return this.categoryForm.get('assignedTaskIds') as FormArray; }
  get assignedWorkflowIdsArray(): FormArray { return this.categoryForm.get('assignedWorkflowIds') as FormArray; }
  get assignedGoalIdsArray(): FormArray { return this.categoryForm.get('assignedGoalIds') as FormArray; }

  showCreateForm(): void {
    this.isEditing.set(false);
    this.editingCategoryId.set(null);
    this.categoryForm.reset();
    this.categoryForm.patchValue({ 
      icon: 'explore', 
      status: 'draft', 
      order: this.getNextOrder() 
    });
    this.clearAllArrays();
    this.showForm.set(true);
  }

  private getNextOrder(): number {
    const categories = this.quickGuideCategories();
    return categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 1;
  }

  private clearAllArrays(): void {
    this.assignedTaskIdsArray.clear();
    this.assignedWorkflowIdsArray.clear();
    this.assignedGoalIdsArray.clear();
  }

  editCategory(category: QuickGuideCategory): void {
    this.isEditing.set(true);
    this.editingCategoryId.set(category.id);
    this.clearAllArrays();
    
    // Populate assigned content arrays
    category.assignedTaskIds.forEach(taskId => 
      this.assignedTaskIdsArray.push(this.fb.control(taskId))
    );
    category.assignedWorkflowIds.forEach(workflowId => 
      this.assignedWorkflowIdsArray.push(this.fb.control(workflowId))
    );
    category.assignedGoalIds.forEach(goalId => 
      this.assignedGoalIdsArray.push(this.fb.control(goalId))
    );
    
    // Patch form values
    this.categoryForm.patchValue({
      name: category.name,
      subtitle: category.subtitle,
      description: category.description,
      icon: category.icon,
      order: category.order,
      status: category.status,
      featureMapping: category.featureMapping || ''
    });
    
    this.showForm.set(true);
  }

  async saveCategory(): Promise<void> {
    if (this.categoryForm.invalid) {
      this.markFormGroupTouched(this.categoryForm);
      return;
    }

    const formData: QuickGuideCategoryFormData = {
      ...this.categoryForm.value,
      assignedTaskIds: this.assignedTaskIdsArray.value.filter((id: string) => id),
      assignedWorkflowIds: this.assignedWorkflowIdsArray.value.filter((id: string) => id),
      assignedGoalIds: this.assignedGoalIdsArray.value.filter((id: string) => id)
    };

    try {
      if (this.isEditing()) {
        const categoryId = this.editingCategoryId();
        if (categoryId) {
          await this.learningContentService.updateQuickGuideCategory(categoryId, formData);
          this.snackBar.open('Quick Guide Category updated successfully', 'Close', { duration: 3000 });
        }
      } else {
        await this.learningContentService.createQuickGuideCategory(formData);
        this.snackBar.open('Quick Guide Category created successfully', 'Close', { duration: 3000 });
      }
      
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving category:', error);
      this.snackBar.open('Error saving category', 'Close', { duration: 3000 });
    }
  }

  async deleteCategory(category: QuickGuideCategory): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await this.learningContentService.deleteQuickGuideCategory(category.id);
      this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error deleting category:', error);
      this.snackBar.open('Error deleting category', 'Close', { duration: 3000 });
    }
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.editingCategoryId.set(null);
    this.categoryForm.reset();
    this.clearAllArrays();
  }

  onSortChange(column: 'order' | 'name'): void {
    if (this.sortBy() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDirection.set('asc');
    }
  }

  // Content Assignment Methods
  addTask(): void {
    this.assignedTaskIdsArray.push(this.fb.control(''));
  }

  removeTask(index: number): void {
    this.assignedTaskIdsArray.removeAt(index);
  }

  addWorkflow(): void {
    this.assignedWorkflowIdsArray.push(this.fb.control(''));
  }

  removeWorkflow(index: number): void {
    this.assignedWorkflowIdsArray.removeAt(index);
  }

  addGoal(): void {
    this.assignedGoalIdsArray.push(this.fb.control(''));
  }

  removeGoal(index: number): void {
    this.assignedGoalIdsArray.removeAt(index);
  }

  // Helper methods
  getTaskName(taskId: string): string {
    const task = this.tasks().find(t => t.id === taskId);
    return task ? task.name : 'Unknown Task';
  }

  getWorkflowName(workflowId: string): string {
    const workflow = this.workflows().find(w => w.id === workflowId);
    return workflow ? workflow.name : 'Unknown Workflow';
  }

  getGoalName(goalId: string): string {
    const goal = this.goals().find(g => g.id === goalId);
    return goal ? goal.name : 'Unknown Goal';
  }

  getTotalAssignedContent(category: QuickGuideCategory): number {
    return category.assignedTaskIds.length + 
           category.assignedWorkflowIds.length + 
           category.assignedGoalIds.length;
  }

  getFeatureMappingLabel(featureMapping: string | undefined): string {
    if (!featureMapping) return '';
    const option = this.featureMappingOptions.find(f => f.value === featureMapping);
    return option ? option.label : featureMapping;
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