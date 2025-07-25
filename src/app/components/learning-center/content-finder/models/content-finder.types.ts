import { LearningContent, ContentType, DifficultyLevel, ContentStatus, UserRole, BusinessType } from '../../models/learning-content.types';

// Search and filtering interfaces
export interface ContentSearchCriteria {
  // Text search
  keyword?: string;
  
  // Content filters
  contentType?: ContentType[];
  category?: string[];
  
  // User-specific filters
  difficulty?: DifficultyLevel[];
  estimatedTime?: TimeRange;
  userRole?: UserRole[];
  businessType?: BusinessType[];
  
  // Content status
  status?: ContentStatus[];
  
  // Sorting options
  sortBy?: SortCriteria;
  sortOrder?: 'asc' | 'desc';
}

export interface TimeRange {
  min?: number;
  max?: number;
}

export type SortCriteria = 'relevance' | 'time' | 'difficulty' | 'lastUpdated' | 'name';

export interface ContentSearchResult {
  content: LearningContent;
  relevanceScore: number;
  type: ContentType;
  matchedFields?: string[];
}

// Content discovery interfaces
export interface ContentRecommendation {
  content: LearningContent;
  relevanceReason: string;
  recommendationType: RecommendationType;
  confidence: number;
}

export type RecommendationType = 'direct-answer' | 'related' | 'follow-up' | 'contextual';

export interface ContentHierarchy {
  goal?: LearningContent;
  workflows: LearningContent[];
  tasks: LearningContent[];
}

// Content finder state
export interface ContentFinderState {
  isOpen: boolean;
  currentContext: string;
  previousContext: string | null;
  searchHistory: string[];
  selectedFilters: ContentSearchCriteria;
  lastSearchResults: ContentSearchResult[];
}

// Navigation and context
export interface NavigationContext {
  currentPage: string;
  previousPage: string | null;
  userContext: UserContext;
  returnContent?: LearningContent;
}

export interface UserContext {
  userRole: UserRole;
  businessType: BusinessType;
  currentFeature: string;
  availableTime?: number;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  preferredContentTypes: ContentType[];
  preferredDifficulty: DifficultyLevel[];
  preferredFormat: ContentFormat[];
  language: string;
}

export type ContentFormat = 'video' | 'text' | 'interactive' | 'quick-steps';

// Analytics and tracking
export interface ContentSelectionEvent {
  contentId: string;
  contentType: ContentType;
  searchQuery?: string;
  selectionContext: string;
  timestamp: Date;
  userContext: UserContext;
}

export interface SearchAnalytics {
  query: string;
  resultCount: number;
  selectedResult?: string;
  timestamp: Date;
  userContext: UserContext;
  refinements: number;
}

// Content preview
export interface ContentPreviewData {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: DifficultyLevel;
  category: string;
  tags: string[];
  lastUpdated: Date;
  completionStatus?: CompletionStatus;
  relevanceScore?: number;
  contentFormats: ContentFormats;
  preview?: ContentPreview;
}

export interface ContentFormats {
  hasVideo: boolean;
  hasStepByStep: boolean;
  hasQuickSteps: boolean;
  hasInteractive: boolean;
  hasExternalLink: boolean;
}

export interface ContentPreview {
  summary: string;
  keyPoints: string[];
  prerequisites?: string[];
  expectedOutcome: string;
  relatedContent: string[];
}

export type CompletionStatus = 'not-started' | 'in-progress' | 'completed';

// Error handling
export interface ContentFinderError {
  type: ContentFinderErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}

export type ContentFinderErrorType = 
  | 'search-failed'
  | 'content-not-found'
  | 'service-unavailable'
  | 'invalid-criteria'
  | 'timeout'
  | 'unknown';

// Service responses
export interface SearchResponse {
  results: ContentSearchResult[];
  totalCount: number;
  searchTime: number;
  suggestions?: string[];
  filters?: AvailableFilters;
}

export interface AvailableFilters {
  categories: string[];
  contentTypes: ContentType[];
  difficulties: DifficultyLevel[];
  timeRanges: TimeRange[];
  tags: string[];
}

// Content organization
export interface ContentCategory {
  name: string;
  description: string;
  icon: string;
  contentCount: number;
  subcategories?: ContentCategory[];
  featuredContent: LearningContent[];
}

export interface ContentCollection {
  id: string;
  name: string;
  description: string;
  contentIds: string[];
  createdBy: string;
  isPublic: boolean;
  tags: string[];
  lastUpdated: Date;
}

// Advanced search features
export interface SavedSearch {
  id: string;
  name: string;
  criteria: ContentSearchCriteria;
  createdBy: string;
  isShared: boolean;
  useCount: number;
  lastUsed: Date;
}

export interface SearchSuggestion {
  text: string;
  type: 'keyword' | 'category' | 'content-title' | 'tag';
  popularity: number;
  resultCount: number;
}

// Content finder configuration
export interface ContentFinderConfig {
  maxResults: number;
  enablePreview: boolean;
  enableSavedSearches: boolean;
  enableSearchHistory: boolean;
  defaultSortBy: SortCriteria;
  enableAnalytics: boolean;
  searchDebounceMs: number;
  cacheTimeout: number;
}