import { Injectable, inject, signal } from '@angular/core';
import { LearningContentService } from '../../services/learning-content.service';
import { LearningContent, ContentType, DifficultyLevel, UserRole, BusinessType } from '../../models/learning-content.types';
import { 
  ContentRecommendation, 
  NavigationContext, 
  UserContext, 
  ContentFinderState,
  RecommendationType 
} from '../models/content-finder.types';

@Injectable({
  providedIn: 'root'
})
export class ContentFinderService {
  private learningContentService = inject(LearningContentService);
  
  // Component state management
  private readonly state = signal<ContentFinderState>({
    isOpen: false,
    currentContext: 'general',
    previousContext: null,
    searchHistory: [],
    selectedFilters: {
      status: ['published'],
      sortBy: 'relevance'
    },
    lastSearchResults: []
  });
  
  // Navigation context
  private readonly navigationContext = signal<NavigationContext>({
    currentPage: 'general',
    previousPage: null,
    userContext: {
      userRole: 'business_owner',
      businessType: 'small_business',
      currentFeature: 'general'
    }
  });
  
  // Public state accessors
  readonly currentState = this.state.asReadonly();
  readonly currentNavigation = this.navigationContext.asReadonly();
  
  /**
   * Get contextual content recommendations based on current user context
   */
  getRecommendations(maxResults: number = 5): LearningContent[] {
    const context = this.navigationContext().userContext;
    const allContent = this.getAllContent();
    
    // Score content based on relevance to current context
    const scoredContent = allContent.map(content => ({
      content,
      score: this.calculateRelevanceScore(content, context)
    }));
    
    // Sort by relevance score and return top results
    return scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(item => item.content);
  }
  
  /**
   * Get smart recommendations with reasoning
   */
  getSmartRecommendations(maxResults: number = 5): ContentRecommendation[] {
    const context = this.navigationContext().userContext;
    const allContent = this.getAllContent();
    
    return allContent
      .map(content => this.createRecommendation(content, context))
      .filter(rec => rec.confidence > 0.3)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxResults);
  }
  
  /**
   * Set current page context for better recommendations
   */
  setCurrentContext(page: string, feature?: string): void {
    const current = this.navigationContext();
    this.navigationContext.set({
      ...current,
      previousPage: current.currentPage,
      currentPage: page,
      userContext: {
        ...current.userContext,
        currentFeature: feature || page
      }
    });
    
    // Update state
    const currentState = this.state();
    this.state.set({
      ...currentState,
      previousContext: currentState.currentContext,
      currentContext: page
    });
  }
  
  /**
   * Set user context for personalized recommendations
   */
  setUserContext(userContext: Partial<UserContext>): void {
    const current = this.navigationContext();
    this.navigationContext.set({
      ...current,
      userContext: {
        ...current.userContext,
        ...userContext
      }
    });
  }
  
  /**
   * Set return context for back navigation
   */
  setReturnContext(currentPage: string, previousPage: string | null): void {
    const current = this.navigationContext();
    this.navigationContext.set({
      ...current,
      currentPage,
      previousPage
    });
  }
  
  /**
   * Add search term to history
   */
  addToSearchHistory(searchTerm: string): void {
    if (!searchTerm.trim()) return;
    
    const currentState = this.state();
    const history = currentState.searchHistory;
    
    // Remove if already exists and add to front
    const filteredHistory = history.filter(term => term !== searchTerm);
    const newHistory = [searchTerm, ...filteredHistory].slice(0, 10); // Keep last 10
    
    this.state.set({
      ...currentState,
      searchHistory: newHistory
    });
  }
  
  /**
   * Get search history
   */
  getSearchHistory(): string[] {
    return this.state().searchHistory;
  }
  
  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    const currentState = this.state();
    this.state.set({
      ...currentState,
      searchHistory: []
    });
  }
  
  /**
   * Get content suitable for current context
   */
  getContextualContent(): LearningContent[] {
    const context = this.navigationContext().userContext;
    const allContent = this.getAllContent();
    
    // Filter content based on user role and business type
    return allContent.filter(content => {
      // Check if content is suitable for user role
      if (content.targetRoles && !content.targetRoles.includes(context.userRole)) {
        return false;
      }
      
      // Check if content is suitable for business type
      if (content.targetBusinessTypes && !content.targetBusinessTypes.includes(context.businessType)) {
        return false;
      }
      
      return content.status === 'published';
    });
  }
  
  /**
   * Get featured content for homepage/default view
   */
  getFeaturedContent(): LearningContent[] {
    const allContent = this.getAllContent();
    
    return allContent
      .filter(content => content.featured && content.status === 'published')
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, 6);
  }
  
  // Private helper methods
  private getAllContent(): LearningContent[] {
    return [
      ...this.learningContentService.tasks(),
      ...this.learningContentService.workflows(),
      ...this.learningContentService.goals()
    ].filter(content => content.status === 'published');
  }
  
  private calculateRelevanceScore(content: LearningContent, context: UserContext): number {
    let score = 0;
    
    // Base score for published content
    if (content.status === 'published') score += 0.5;
    
    // Bonus for matching user role
    if (content.targetRoles?.includes(context.userRole)) score += 0.3;
    
    // Bonus for matching business type
    if (content.targetBusinessTypes?.includes(context.businessType)) score += 0.2;
    
    // Bonus for matching current feature/page
    if (content.category?.toLowerCase().includes(context.currentFeature.toLowerCase())) score += 0.4;
    
    // Bonus for appropriate difficulty
    const userLevel = this.getUserSkillLevel(context);
    if (content.difficulty === userLevel) score += 0.3;
    else if (this.isDifficultyAppropriate(content.difficulty!, userLevel)) score += 0.1;
    
    // Bonus for featured content
    if (content.featured) score += 0.2;
    
    // Bonus for recent content
    if (content.lastUpdated && this.isRecentContent(content.lastUpdated)) score += 0.1;
    
    return Math.min(score, 1.0); // Cap at 1.0
  }
  
  private createRecommendation(content: LearningContent, context: UserContext): ContentRecommendation {
    const score = this.calculateRelevanceScore(content, context);
    const reason = this.generateRelevanceReason(content, context);
    const type = this.determineRecommendationType(content, context);
    
    return {
      content,
      relevanceReason: reason,
      recommendationType: type,
      confidence: score
    };
  }
  
  private generateRelevanceReason(content: LearningContent, context: UserContext): string {
    const reasons: string[] = [];
    
    if (content.targetRoles?.includes(context.userRole)) {
      reasons.push(`relevant for ${context.userRole.replace('_', ' ')}`);
    }
    
    if (content.category?.toLowerCase().includes(context.currentFeature.toLowerCase())) {
      reasons.push(`matches your current page (${context.currentFeature})`);
    }
    
    if (content.featured) {
      reasons.push('popular content');
    }
    
    if (content.difficulty === this.getUserSkillLevel(context)) {
      reasons.push(`${content.difficulty} level matches your experience`);
    }
    
    return reasons.length > 0 
      ? `Recommended because it's ${reasons.join(' and ')}`
      : 'General recommendation';
  }
  
  private determineRecommendationType(content: LearningContent, context: UserContext): RecommendationType {
    if (content.category?.toLowerCase().includes(context.currentFeature.toLowerCase())) {
      return 'direct-answer';
    }
    
    if (content.targetRoles?.includes(context.userRole)) {
      return 'contextual';
    }
    
    if (content.featured) {
      return 'related';
    }
    
    return 'follow-up';
  }
  
  private getUserSkillLevel(context: UserContext): DifficultyLevel {
    // Simple heuristic based on user role
    switch (context.userRole) {
      case 'student':
      case 'new_user':
        return 'beginner';
      case 'business_owner':
      case 'freelancer':
        return 'intermediate';
      case 'accountant':
      case 'bookkeeper':
        return 'advanced';
      default:
        return 'beginner';
    }
  }
  
  private isDifficultyAppropriate(contentDifficulty: DifficultyLevel, userLevel: DifficultyLevel): boolean {
    const levels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
    const contentIndex = levels.indexOf(contentDifficulty);
    const userIndex = levels.indexOf(userLevel);
    
    // Content should be at most one level above user's level
    return contentIndex <= userIndex + 1;
  }
  
  private isRecentContent(lastUpdated: Date): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastUpdated > thirtyDaysAgo;
  }
}