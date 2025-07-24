# Media Player Integration Guide

## Quick Start

### 1. Component Setup

Add the media player components to your Angular component:

```typescript
import { Component } from '@angular/core';
import { FloatingPlayerComponent } from '@components/media-player/floating-player/floating-player.component';
import { FixedPlayerComponent } from '@components/media-player/fixed-player/fixed-player.component';
import { MediaPlayerFabComponent } from '@components/media-player/fab/media-player-fab.component';
import { MediaPlayerService } from '@components/media-player/services/media-player.service';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    FloatingPlayerComponent,
    FixedPlayerComponent, 
    MediaPlayerFabComponent
  ],
  template: `
    <!-- Your component content -->
    <div class="content">
      <button (click)="playTutorial()">Watch Tutorial</button>
    </div>

    <!-- Media player components -->
    <app-floating-player></app-floating-player>
    <app-fixed-player></app-fixed-player>
    <app-media-player-fab></app-media-player-fab>
  `
})
export class MyComponent {
  constructor(private mediaPlayerService: MediaPlayerService) {}

  playTutorial(): void {
    this.mediaPlayerService.launchFloatingPlayer({
      id: 'my-tutorial',
      url: '/assets/videos/tutorial.mp4',
      title: 'My Tutorial Video',
      description: 'Learn how to use this feature'
    });
  }
}
```

### 2. Global Setup (Recommended)

For application-wide video support, add components to your main app component:

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FloatingPlayerComponent } from '@components/media-player/floating-player/floating-player.component';
import { MediaPlayerFabComponent } from '@components/media-player/fab/media-player-fab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FloatingPlayerComponent,
    MediaPlayerFabComponent
  ],
  template: `
    <div class="app-container">
      <app-navigation></app-navigation>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Global media player components -->
      <app-floating-player></app-floating-player>
      <app-media-player-fab></app-media-player-fab>
    </div>
  `
})
export class AppComponent {}
```

## Integration Patterns

### Pattern 1: Tutorial System

Create a centralized tutorial service that leverages the media player:

```typescript
// tutorial.service.ts
import { Injectable } from '@angular/core';
import { MediaPlayerService } from '@components/media-player/services/media-player.service';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  constructor(private mediaPlayerService: MediaPlayerService) {}

  private tutorials: Tutorial[] = [
    {
      id: 'invoice-creation',
      title: 'Creating Your First Invoice',
      description: 'Step-by-step guide to invoice creation',
      videoUrl: '/assets/tutorials/invoice-creation.mp4',
      category: 'invoicing'
    },
    {
      id: 'expense-tracking',
      title: 'Tracking Business Expenses',
      description: 'Learn to categorize and track expenses',
      videoUrl: '/assets/tutorials/expense-tracking.mp4',
      category: 'expenses'
    }
  ];

  playTutorial(tutorialId: string): void {
    const tutorial = this.tutorials.find(t => t.id === tutorialId);
    if (tutorial) {
      this.mediaPlayerService.launchFloatingPlayer({
        id: tutorial.id,
        url: tutorial.videoUrl,
        title: tutorial.title,
        description: tutorial.description,
        mode: 'floating'
      });
    }
  }

  getTutorialsByCategory(category: string): Tutorial[] {
    return this.tutorials.filter(t => t.category === category);
  }
}
```

Usage in components:
```typescript
// invoice.component.ts
export class InvoiceComponent {
  constructor(private tutorialService: TutorialService) {}

  showInvoiceHelp(): void {
    this.tutorialService.playTutorial('invoice-creation');
  }
}
```

### Pattern 2: Context-Sensitive Help

Implement contextual help videos that appear based on user location:

```typescript
// help.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MediaPlayerService } from '@components/media-player/services/media-player.service';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  constructor(
    private mediaPlayerService: MediaPlayerService,
    private router: Router
  ) {}

  private helpVideos: Record<string, any> = {
    '/dashboard': {
      id: 'dashboard-overview',
      url: '/assets/help/dashboard-guide.mp4',
      title: 'Dashboard Overview',
      description: 'Navigate your dashboard effectively'
    },
    '/invoices': {
      id: 'invoice-management',
      url: '/assets/help/invoice-management.mp4',
      title: 'Invoice Management',
      description: 'Create, edit, and send invoices'
    },
    '/reports': {
      id: 'financial-reports',
      url: '/assets/help/reports-guide.mp4',
      title: 'Financial Reports',
      description: 'Generate and analyze financial reports'
    }
  };

  showContextualHelp(): void {
    const currentRoute = this.router.url;
    const helpVideo = this.helpVideos[currentRoute];
    
    if (helpVideo) {
      this.mediaPlayerService.launchFloatingPlayer({
        ...helpVideo,
        mode: 'floating'
      });
    } else {
      this.showGeneralHelp();
    }
  }

  private showGeneralHelp(): void {
    this.mediaPlayerService.launchFloatingPlayer({
      id: 'general-help',
      url: '/assets/help/getting-started.mp4',
      title: 'Getting Started',
      description: 'FlowAccount basics and overview'
    });
  }
}
```

### Pattern 3: Course/Learning System

Build a structured learning experience:

```typescript
// course.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MediaPlayerService } from '@components/media-player/services/media-player.service';

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private currentCourse$ = new BehaviorSubject<Course | null>(null);
  private currentLesson$ = new BehaviorSubject<Lesson | null>(null);

  constructor(private mediaPlayerService: MediaPlayerService) {
    // Monitor video completion
    this.mediaPlayerService.state$.subscribe(state => {
      if (state.currentTime && state.duration) {
        const progress = state.currentTime / state.duration;
        if (progress >= 0.9) { // 90% completion
          this.markLessonComplete(state.videoId);
        }
      }
    });
  }

  startCourse(courseId: string): void {
    const course = this.getCourse(courseId);
    if (course && course.lessons.length > 0) {
      this.currentCourse$.next(course);
      this.playLesson(course.lessons[0]);
    }
  }

  playLesson(lesson: Lesson): void {
    this.currentLesson$.next(lesson);
    
    this.mediaPlayerService.launchFixedPlayer({
      id: lesson.id,
      url: lesson.videoUrl,
      title: lesson.title,
      mode: 'fixed'
    });
  }

  playNextLesson(): void {
    const course = this.currentCourse$.value;
    const currentLesson = this.currentLesson$.value;
    
    if (course && currentLesson) {
      const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
      const nextLesson = course.lessons[currentIndex + 1];
      
      if (nextLesson) {
        this.playLesson(nextLesson);
      }
    }
  }

  private markLessonComplete(lessonId: string | null): void {
    if (!lessonId) return;
    
    const course = this.currentCourse$.value;
    if (course) {
      const lesson = course.lessons.find(l => l.id === lessonId);
      if (lesson) {
        lesson.completed = true;
        this.saveProgress(course.id, lessonId);
      }
    }
  }

  private saveProgress(courseId: string, lessonId: string): void {
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    if (!progress[courseId]) {
      progress[courseId] = [];
    }
    if (!progress[courseId].includes(lessonId)) {
      progress[courseId].push(lessonId);
    }
    localStorage.setItem('courseProgress', JSON.stringify(progress));
  }

  private getCourse(courseId: string): Course | null {
    // Implementation depends on your data source
    return null;
  }
}
```

### Pattern 4: Feature Onboarding

Guide users through new features with interactive videos:

```typescript
// onboarding.service.ts
import { Injectable } from '@angular/core';
import { MediaPlayerService } from '@components/media-player/services/media-player.service';

interface OnboardingStep {
  id: string;
  title: string;
  videoUrl: string;
  targetElement?: string;
  nextAction?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  constructor(private mediaPlayerService: MediaPlayerService) {}

  private onboardingFlows: Record<string, OnboardingStep[]> = {
    'new-user': [
      {
        id: 'welcome',
        title: 'Welcome to FlowAccount',
        videoUrl: '/assets/onboarding/welcome.mp4'
      },
      {
        id: 'dashboard-tour',
        title: 'Dashboard Tour',
        videoUrl: '/assets/onboarding/dashboard.mp4',
        targetElement: '.dashboard-container'
      },
      {
        id: 'first-invoice',
        title: 'Create Your First Invoice',
        videoUrl: '/assets/onboarding/first-invoice.mp4',
        nextAction: () => this.navigateToInvoices()
      }
    ]
  };

  startOnboarding(flowName: string): void {
    const flow = this.onboardingFlows[flowName];
    if (flow && flow.length > 0) {
      this.playOnboardingStep(flow[0], flow);
    }
  }

  private playOnboardingStep(step: OnboardingStep, flow: OnboardingStep[]): void {
    this.mediaPlayerService.launchFloatingPlayer({
      id: step.id,
      url: step.videoUrl,
      title: step.title,
      mode: 'floating'
    });

    // Highlight target element if specified
    if (step.targetElement) {
      this.highlightElement(step.targetElement);
    }

    // Monitor for video completion to advance to next step
    this.mediaPlayerService.state$.subscribe(state => {
      if (state.videoId === step.id && state.currentTime && state.duration) {
        const progress = state.currentTime / state.duration;
        if (progress >= 0.95) {
          this.advanceToNextStep(step, flow);
        }
      }
    });
  }

  private advanceToNextStep(currentStep: OnboardingStep, flow: OnboardingStep[]): void {
    const currentIndex = flow.findIndex(s => s.id === currentStep.id);
    const nextStep = flow[currentIndex + 1];

    if (currentStep.nextAction) {
      currentStep.nextAction();
    }

    if (nextStep) {
      setTimeout(() => {
        this.playOnboardingStep(nextStep, flow);
      }, 2000); // 2-second delay between steps
    }
  }

  private highlightElement(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('onboarding-highlight');
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        element.classList.remove('onboarding-highlight');
      }, 3000);
    }
  }

  private navigateToInvoices(): void {
    // Navigation logic
  }
}
```

## Advanced Integration Techniques

### State Synchronization

Synchronize video state with your application state:

```typescript
// app-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { MediaPlayerService } from '@components/media-player/services/media-player.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private learningMode$ = new BehaviorSubject<boolean>(false);
  private currentFeature$ = new BehaviorSubject<string | null>(null);

  constructor(private mediaPlayerService: MediaPlayerService) {
    this.setupStateSynchronization();
  }

  private setupStateSynchronization(): void {
    // Enable learning mode when video is playing
    this.mediaPlayerService.state$.subscribe(state => {
      const isWatchingTutorial = state.isPlaying && state.title?.includes('Tutorial');
      this.learningMode$.next(isWatchingTutorial);
    });

    // Combine states for reactive UI updates
    combineLatest([
      this.learningMode$,
      this.currentFeature$,
      this.mediaPlayerService.state$
    ]).subscribe(([learningMode, feature, playerState]) => {
      this.updateUIState({
        learningModeActive: learningMode,
        currentFeature: feature,
        videoPlaying: playerState.isPlaying,
        videoTitle: playerState.title
      });
    });
  }

  private updateUIState(state: any): void {
    // Update global UI state
    document.body.classList.toggle('learning-mode', state.learningModeActive);
  }
}
```

### Custom Video Sources

Integrate with custom video sources or CDNs:

```typescript
// video-source.service.ts
import { Injectable } from '@angular/core';
import { MediaPlayerService } from '@components/media-player/services/media-player.service';

@Injectable({
  providedIn: 'root'
})
export class VideoSourceService {
  constructor(private mediaPlayerService: MediaPlayerService) {}

  private baseUrls = {
    tutorials: 'https://cdn.flowaccount.com/tutorials/',
    help: 'https://cdn.flowaccount.com/help/',
    courses: 'https://cdn.flowaccount.com/courses/'
  };

  playFromCDN(category: string, videoId: string, options: any = {}): void {
    const baseUrl = this.baseUrls[category as keyof typeof this.baseUrls];
    if (!baseUrl) {
      console.error(`Unknown video category: ${category}`);
      return;
    }

    const fullUrl = `${baseUrl}${videoId}.mp4`;
    
    this.mediaPlayerService.launchFloatingPlayer({
      id: `${category}-${videoId}`,
      url: fullUrl,
      title: options.title || 'Video',
      description: options.description,
      mode: options.mode || 'floating'
    });
  }

  // Support for adaptive streaming
  playAdaptiveStream(videoId: string, options: any = {}): void {
    const streamUrl = `https://stream.flowaccount.com/${videoId}/playlist.m3u8`;
    
    this.mediaPlayerService.launchFloatingPlayer({
      id: videoId,
      url: streamUrl,
      title: options.title,
      description: options.description,
      mode: options.mode || 'floating'
    });
  }
}
```

### Analytics Integration

Enhanced analytics tracking for business intelligence:

```typescript
// video-analytics.service.ts
import { Injectable } from '@angular/core';
import { MediaPlayerService } from '@components/media-player/services/media-player.service';

@Injectable({
  providedIn: 'root'
})
export class VideoAnalyticsService {
  constructor(private mediaPlayerService: MediaPlayerService) {
    this.setupAnalyticsTracking();
  }

  private setupAnalyticsTracking(): void {
    this.mediaPlayerService.state$.subscribe(state => {
      this.trackDetailedMetrics(state);
    });
  }

  private trackDetailedMetrics(state: any): void {
    // Track video engagement metrics
    if (state.isPlaying && state.currentTime && state.duration) {
      const engagement = {
        videoId: state.videoId,
        watchTime: state.currentTime,
        totalDuration: state.duration,
        completionRate: (state.currentTime / state.duration) * 100,
        playerMode: state.playerMode,
        playerPosition: state.pipPosition,
        playerSize: state.pipSize,
        timestamp: Date.now()
      };

      // Send to analytics service
      this.sendEngagementData(engagement);
    }
  }

  private sendEngagementData(data: any): void {
    // Integration with your analytics platform
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'video_engagement', {
        custom_parameter_video_id: data.videoId,
        custom_parameter_watch_time: data.watchTime,
        custom_parameter_completion_rate: data.completionRate,
        custom_parameter_player_mode: data.playerMode
      });
    }

    // Or send to custom analytics endpoint
    // this.http.post('/api/analytics/video-engagement', data).subscribe();
  }
}
```

## Testing Integration

### Unit Testing

```typescript
// component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaPlayerService } from '@components/media-player/services/media-player.service';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let mediaPlayerService: jasmine.SpyObj<MediaPlayerService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MediaPlayerService', ['launchFloatingPlayer', 'launchFixedPlayer']);

    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: MediaPlayerService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    mediaPlayerService = TestBed.inject(MediaPlayerService) as jasmine.SpyObj<MediaPlayerService>;
  });

  it('should launch video tutorial', () => {
    component.playTutorial();
    
    expect(mediaPlayerService.launchFloatingPlayer).toHaveBeenCalledWith({
      id: 'my-tutorial',
      url: '/assets/videos/tutorial.mp4',
      title: 'My Tutorial Video',
      description: 'Learn how to use this feature'
    });
  });
});
```

### E2E Testing

```typescript
// e2e/video-player.e2e-spec.ts
import { browser, by, element } from 'protractor';

describe('Video Player Integration', () => {
  beforeEach(() => {
    browser.get('/dashboard');
  });

  it('should launch floating video player', async () => {
    // Click help button
    await element(by.css('[data-test="help-button"]')).click();
    
    // Verify floating player appears
    const floatingPlayer = element(by.css('app-floating-player'));
    expect(await floatingPlayer.isDisplayed()).toBe(true);
    
    // Verify video is playing
    const playButton = element(by.css('.play-pause-button'));
    expect(await playButton.getAttribute('class')).toContain('playing');
  });

  it('should persist video state across navigation', async () => {
    // Start video
    await element(by.css('[data-test="tutorial-button"]')).click();
    
    // Navigate to different page
    await element(by.css('[data-test="invoices-link"]')).click();
    
    // Verify video is still playing
    const floatingPlayer = element(by.css('app-floating-player'));
    expect(await floatingPlayer.isDisplayed()).toBe(true);
  });
});
```

## Performance Considerations

### Lazy Loading

Implement lazy loading for video components:

```typescript
// video-loader.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoLoaderService {
  private componentsLoaded = false;

  async loadVideoComponents(): Promise<void> {
    if (this.componentsLoaded) return;

    // Dynamically import video components when needed
    const { FloatingPlayerComponent } = await import('@components/media-player/floating-player/floating-player.component');
    const { MediaPlayerFabComponent } = await import('@components/media-player/fab/media-player-fab.component');
    
    this.componentsLoaded = true;
  }
}
```

### Memory Management

Ensure proper cleanup to prevent memory leaks:

```typescript
// base-video.component.ts
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MediaPlayerService } from '@components/media-player/services/media-player.service';

@Component({
  template: ''
})
export abstract class BaseVideoComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();

  constructor(protected mediaPlayerService: MediaPlayerService) {
    // Subscribe with automatic cleanup
    this.mediaPlayerService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => this.handleStateChange(state));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected abstract handleStateChange(state: any): void;
}
```

## Troubleshooting Common Integration Issues

### Issue: Videos not loading
**Solution**: Verify video file paths and ensure proper MIME types are configured on your server.

### Issue: State not persisting across routes
**Solution**: Ensure MediaPlayerService is provided at root level and components are properly imported.

### Issue: YouTube videos not working
**Solution**: Check that YouTube iframe API is accessible and not blocked by ad blockers.

### Issue: Multiple player instances
**Solution**: Use the global app-level component placement pattern to ensure singleton behavior.

This integration guide provides comprehensive patterns for implementing the FlowAccount Media Player system in various scenarios. Choose the patterns that best fit your application's architecture and requirements.