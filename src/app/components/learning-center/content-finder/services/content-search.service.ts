import { Injectable, inject } from '@angular/core';
import { LearningContentService } from '../../services/learning-content.service';
import { LearningContent, ContentType, DifficultyLevel } from '../../models/learning-content.types';
import { 
  ContentSearchCriteria, 
  ContentSearchResult, 
  SearchResponse, 
  SortCriteria,
  SearchSuggestion,
  AvailableFilters 
} from '../models/content-finder.types';

@Injectable({
  providedIn: 'root'
})
export class ContentSearchService {
  private learningContentService = inject(LearningContentService);
  
  // Search cache for performance
  private searchCache = new Map<string, ContentSearchResult[]>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private cacheTimestamps = new Map<string, number>();
  
  /**
   * Main search method - searches content based on criteria
   */
  searchContent(criteria: ContentSearchCriteria): ContentSearchResult[] {
    const cacheKey = this.generateCacheKey(criteria);
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return this.searchCache.get(cacheKey)!;
    }
    
    const startTime = performance.now();
    
    // Get all content
    const allContent = this.getAllContent();
    
    // Apply filters
    let filteredContent = this.applyFilters(allContent, criteria);
    
    // Apply text search if provided
    if (criteria.keyword?.trim()) {
      filteredContent = this.applyTextSearch(filteredContent, criteria.keyword);
    }
    
    // Convert to search results with relevance scores
    let searchResults = filteredContent.map(content => ({
      content,
      relevanceScore: this.calculateRelevanceScore(content, criteria),
      type: content.type as ContentType,
      matchedFields: this.getMatchedFields(content, criteria)
    }));
    
    // Apply sorting
    searchResults = this.applySorting(searchResults, criteria);
    
    // Cache results
    this.cacheResults(cacheKey, searchResults);
    
    return searchResults;
  }
  
  /**
   * Get comprehensive search response with metadata
   */
  getSearchResponse(criteria: ContentSearchCriteria): SearchResponse {
    const startTime = performance.now();
    const results = this.searchContent(criteria);
    const searchTime = performance.now() - startTime;
    
    return {
      results,
      totalCount: results.length,
      searchTime,
      suggestions: this.generateSearchSuggestions(criteria),
      filters: this.getAvailableFilters()
    };
  }
  
  /**
   * Get search suggestions based on current query
   */
  generateSearchSuggestions(criteria: ContentSearchCriteria): string[] {
    const keyword = criteria.keyword?.toLowerCase().trim();
    if (!keyword) return [];
    
    const allContent = this.getAllContent();
    const suggestions = new Set<string>();
    
    // Add category suggestions
    allContent.forEach(content => {
      if (content.category?.toLowerCase().includes(keyword)) {
        suggestions.add(content.category);
      }
      
      // Add title word suggestions
      const titleWords = content.name.toLowerCase().split(' ');
      titleWords.forEach(word => {
        if (word.includes(keyword) && word !== keyword) {
          suggestions.add(word);
        }
      });
      
      // Add tag suggestions
      content.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(keyword)) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }
  
  /**
   * Get popular search suggestions
   */
  getPopularSearchSuggestions(): SearchSuggestion[] {
    // In a real app, this would come from analytics
    return [
      { text: 'create invoice', type: 'keyword', popularity: 95, resultCount: 12 },
      { text: 'quotation', type: 'keyword', popularity: 87, resultCount: 8 },
      { text: 'expense tracking', type: 'keyword', popularity: 82, resultCount: 15 },
      { text: 'reporting', type: 'category', popularity: 78, resultCount: 22 },
      { text: 'tax preparation', type: 'keyword', popularity: 71, resultCount: 9 },
      { text: 'dashboard setup', type: 'keyword', popularity: 69, resultCount: 6 },
      { text: 'contact management', type: 'category', popularity: 64, resultCount: 11 },
      { text: 'payment processing', type: 'keyword', popularity: 58, resultCount: 7 }
    ];
  }
  
  /**
   * Get available filter options
   */
  getAvailableFilters(): AvailableFilters {
    const allContent = this.getAllContent();
    
    const categories = Array.from(new Set(
      allContent.map(c => c.category).filter(Boolean)
    )) as string[];
    
    const tags = Array.from(new Set(
      allContent.flatMap(c => c.tags || [])
    ));
    
    return {
      categories: categories.sort(),
      contentTypes: ['task', 'workflow', 'goal'],
      difficulties: ['beginner', 'intermediate', 'advanced'],
      timeRanges: [
        { min: 0, max: 15 },
        { min: 15, max: 30 },
        { min: 30, max: 60 },
        { min: 60, max: 120 }
      ],
      tags: tags.sort()
    };
  }
  
  /**
   * Clear search cache
   */
  clearCache(): void {
    this.searchCache.clear();
    this.cacheTimestamps.clear();
  }
  
  // Private helper methods
  private getAllContent(): LearningContent[] {
    return [
      ...this.learningContentService.tasks(),
      ...this.learningContentService.workflows(),
      ...this.learningContentService.goals()
    ];
  }
  
  private applyFilters(content: LearningContent[], criteria: ContentSearchCriteria): LearningContent[] {
    return content.filter(item => {
      // Content type filter
      if (criteria.contentType?.length && !criteria.contentType.includes(item.type as ContentType)) {
        return false;
      }
      
      // Category filter
      if (criteria.category?.length && !criteria.category.includes(item.category || '')) {
        return false;
      }
      
      // Difficulty filter
      if (criteria.difficulty?.length && !criteria.difficulty.includes(item.difficulty!)) {
        return false;
      }
      
      // Time range filter
      if (criteria.estimatedTime) {
        const time = item.estimatedTime || 0;
        if (criteria.estimatedTime.min !== undefined && time < criteria.estimatedTime.min) {
          return false;
        }
        if (criteria.estimatedTime.max !== undefined && time > criteria.estimatedTime.max) {
          return false;
        }
      }
      
      // Status filter
      if (criteria.status?.length && !criteria.status.includes(item.status)) {
        return false;
      }
      
      // User role filter
      if (criteria.userRole?.length && item.targetRoles) {
        const hasMatchingRole = criteria.userRole.some(role => 
          item.targetRoles!.includes(role)
        );
        if (!hasMatchingRole) return false;
      }
      
      // Business type filter
      if (criteria.businessType?.length && item.targetBusinessTypes) {
        const hasMatchingBusinessType = criteria.businessType.some(type => 
          item.targetBusinessTypes!.includes(type)
        );
        if (!hasMatchingBusinessType) return false;
      }
      
      return true;
    });
  }
  
  private applyTextSearch(content: LearningContent[], keyword: string): LearningContent[] {
    const searchTerms = keyword.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return content.filter(item => {
      const searchableText = [
        item.name,
        item.description,
        item.category || '',
        ...(item.tags || []),
        item.outcome || '',
        (item as any).businessValue || '',
        (item as any).expectedOutcome || ''
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  }
  
  private calculateRelevanceScore(content: LearningContent, criteria: ContentSearchCriteria): number {
    let score = 0;
    
    // Base score
    score += 0.5;
    
    // Keyword matching score
    if (criteria.keyword?.trim()) {
      const keyword = criteria.keyword.toLowerCase();
      const name = content.name.toLowerCase();
      const description = content.description.toLowerCase();
      
      // Exact title match
      if (name === keyword) score += 0.5;
      // Title contains keyword
      else if (name.includes(keyword)) score += 0.3;
      // Description contains keyword
      else if (description.includes(keyword)) score += 0.2;
      
      // Tag matches
      if (content.tags?.some(tag => tag.toLowerCase().includes(keyword))) {
        score += 0.2;
      }
      
      // Category matches
      if (content.category?.toLowerCase().includes(keyword)) {
        score += 0.2;
      }
    }
    
    // Featured content bonus
    if (content.featured) score += 0.1;
    
    // Priority bonus
    if (content.priority) score += (content.priority / 100) * 0.1;
    
    // Recency bonus
    if (content.lastUpdated && this.isRecentContent(content.lastUpdated)) {
      score += 0.05;
    }
    
    return Math.min(score, 1.0);
  }
  
  private getMatchedFields(content: LearningContent, criteria: ContentSearchCriteria): string[] {
    const matchedFields: string[] = [];
    
    if (criteria.keyword?.trim()) {
      const keyword = criteria.keyword.toLowerCase();
      
      if (content.name.toLowerCase().includes(keyword)) {
        matchedFields.push('name');
      }
      if (content.description.toLowerCase().includes(keyword)) {
        matchedFields.push('description');
      }
      if (content.category?.toLowerCase().includes(keyword)) {
        matchedFields.push('category');
      }
      if (content.tags?.some(tag => tag.toLowerCase().includes(keyword))) {
        matchedFields.push('tags');
      }
    }
    
    return matchedFields;
  }
  
  private applySorting(results: ContentSearchResult[], criteria: ContentSearchCriteria): ContentSearchResult[] {
    const sortBy = criteria.sortBy || 'relevance';
    const sortOrder = criteria.sortOrder || 'desc';
    
    return results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'relevance':
          comparison = a.relevanceScore - b.relevanceScore;
          break;
        case 'name':
          comparison = a.content.name.localeCompare(b.content.name);
          break;
        case 'time':
          comparison = (a.content.estimatedTime || 0) - (b.content.estimatedTime || 0);
          break;
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          comparison = (difficultyOrder[a.content.difficulty!] || 0) - (difficultyOrder[b.content.difficulty!] || 0);
          break;
        case 'lastUpdated':
          const aTime = a.content.lastUpdated?.getTime() || 0;
          const bTime = b.content.lastUpdated?.getTime() || 0;
          comparison = aTime - bTime;
          break;
        default:
          comparison = a.relevanceScore - b.relevanceScore;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }
  
  private generateCacheKey(criteria: ContentSearchCriteria): string {
    return JSON.stringify(criteria);
  }
  
  private isCacheValid(cacheKey: string): boolean {
    if (!this.searchCache.has(cacheKey)) return false;
    
    const timestamp = this.cacheTimestamps.get(cacheKey);
    if (!timestamp) return false;
    
    return Date.now() - timestamp < this.CACHE_DURATION;
  }
  
  private cacheResults(cacheKey: string, results: ContentSearchResult[]): void {
    this.searchCache.set(cacheKey, results);
    this.cacheTimestamps.set(cacheKey, Date.now());
    
    // Clean old cache entries if cache gets too large
    if (this.searchCache.size > 50) {
      const oldestKey = Array.from(this.cacheTimestamps.entries())
        .sort(([,a], [,b]) => a - b)[0][0];
      
      this.searchCache.delete(oldestKey);
      this.cacheTimestamps.delete(oldestKey);
    }
  }
  
  private isRecentContent(lastUpdated: Date): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastUpdated > thirtyDaysAgo;
  }
}