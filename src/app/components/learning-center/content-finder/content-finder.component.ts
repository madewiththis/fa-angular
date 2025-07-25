import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { LearningContentService } from '../services/learning-content.service';
import { ContentFinderService } from './services/content-finder.service';
import { ContentSearchService } from './services/content-search.service';
import { ContentSearchCriteria, ContentSearchResult } from './models/content-finder.types';
import { LearningContent, ContentType, DifficultyLevel } from '../models/learning-content.types';

@Component({
  selector: 'app-content-finder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatChipsModule,
    MatSelectModule
  ],
  templateUrl: './content-finder.component.html',
  styleUrls: ['./content-finder.component.scss']
})
export class ContentFinderComponent {
  private learningContentService = inject(LearningContentService);
  private contentFinderService = inject(ContentFinderService);
  private contentSearchService = inject(ContentSearchService);
  
  // Component state
  readonly isOpen = signal(false);
  readonly selectedTab = signal(0);
  readonly selectedPreview = signal<LearningContent | null>(null);
  readonly showPreviewPanel = signal(false);
  
  // Search state
  readonly searchQuery = signal('');
  readonly selectedContentTypes = signal<ContentType[]>(['task', 'workflow', 'goal']);
  readonly selectedDifficulty = signal<DifficultyLevel[]>(['beginner', 'intermediate']);
  readonly selectedCategory = signal<string>('');
  
  // Current context
  readonly currentPageContext = signal('general');
  readonly previousPageContext = signal<string | null>(null);
  readonly showBackButton = signal(false);
  
  // Search criteria computed from state
  readonly searchCriteria = computed<ContentSearchCriteria>(() => ({
    keyword: this.searchQuery().trim(),
    contentType: this.selectedContentTypes(),
    difficulty: this.selectedDifficulty(),
    category: this.selectedCategory() ? [this.selectedCategory()] : undefined,
    status: ['published'],
    sortBy: 'relevance'
  }));
  
  // Content results
  readonly searchResults = computed(() => {
    const criteria = this.searchCriteria();
    if (!criteria.keyword && !criteria.category) {
      return this.getDefaultContent();
    }
    return this.contentSearchService.searchContent(criteria);
  });
  
  // Content organization
  readonly contentByCategory = computed(() => {
    const allContent = this.learningContentService.tasks()
      .concat(this.learningContentService.workflows())
      .concat(this.learningContentService.goals())
      .filter(content => content.status === 'published');
    
    const categoryGroups = new Map<string, LearningContent[]>();
    
    allContent.forEach(content => {
      const category = content.category || 'General';
      if (!categoryGroups.has(category)) {
        categoryGroups.set(category, []);
      }
      categoryGroups.get(category)!.push(content);
    });
    
    return Array.from(categoryGroups.entries()).map(([category, items]) => ({
      category,
      items: items.slice(0, 8) // Limit to 8 items per category
    }));
  });
  
  // Contextual recommendations
  readonly contextualRecommendations = computed(() => {
    return this.contentFinderService.getRecommendations(5);
  });
  
  constructor() {
    // Initialize component
  }
  
  // Public methods
  open(): void {
    this.isOpen.set(true);
  }
  
  close(): void {
    this.isOpen.set(false);
    this.resetState();
  }
  
  onSearch(): void {
    // Search is automatically triggered by computed searchResults
    this.selectedTab.set(0); // Switch to search results tab
  }
  
  selectContent(content: LearningContent): void {
    // Store context for back navigation
    this.contentFinderService.setReturnContext(
      this.currentPageContext(),
      this.previousPageContext()
    );
    
    // Notify parent component to load content
    this.contentSelected(content);
    
    // Close finder
    this.close();
  }
  
  previewContent(content: LearningContent): void {
    this.selectedPreview.set(content);
    this.showPreviewPanel.set(true);
  }
  
  closePreview(): void {
    this.showPreviewPanel.set(false);
    this.selectedPreview.set(null);
  }
  
  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.selectedTab.set(0); // Switch to results tab
  }
  
  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedContentTypes.set(['task', 'workflow', 'goal']);
    this.selectedDifficulty.set(['beginner', 'intermediate']);
  }
  
  backToCurrentPage(): void {
    if (this.previousPageContext()) {
      this.previousPageContext.set(null);
      this.showBackButton.set(false);
      // TODO: Restore original page content in parent
    }
  }
  
  // Private methods
  private getDefaultContent(): ContentSearchResult[] {
    // Show contextual recommendations when no search criteria
    return this.contextualRecommendations().map(content => ({
      content,
      relevanceScore: 0.8,
      type: content.type as ContentType
    }));
  }
  
  private contentSelected(content: LearningContent): void {
    // This would emit to parent component
    // For now, log the selection
    console.log('Content selected:', content);
    
    // TODO: Emit content selection event to parent
    // this.contentSelectionEmitter.emit(content);
  }
  
  private resetState(): void {
    this.selectedPreview.set(null);
    this.showPreviewPanel.set(false);
    this.selectedTab.set(0);
  }
  
  // Helper methods for template
  getContentTypeIcon(type: ContentType): string {
    switch (type) {
      case 'task': return 'assignment';
      case 'workflow': return 'account_tree';
      case 'goal': return 'flag';
      default: return 'help';
    }
  }
  
  getDifficultyColor(difficulty: DifficultyLevel): string {
    switch (difficulty) {
      case 'beginner': return 'primary';
      case 'intermediate': return 'accent';
      case 'advanced': return 'warn';
      default: return 'primary';
    }
  }
  
  formatEstimatedTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
}