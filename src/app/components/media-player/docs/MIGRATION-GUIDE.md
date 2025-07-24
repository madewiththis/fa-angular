# Media Player Migration Guide

## Overview

This guide explains how to extract the FlowAccount Media Player system from this prototype application and integrate it into your production Angular TypeScript application. The media player is designed to be a completely standalone system that can be copied and integrated into any Angular project.

## Prerequisites

### Target Application Requirements
- **Angular 15+** (tested with Angular 20, but compatible with 15+)
- **TypeScript 4.7+**
- **RxJS 7.4+**
- **Angular Material** (for icons and UI components)
- **Video.js 8.x** (will be installed as part of the process)

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Step 1: Copy Media Player Files

### 1.1 Create Directory Structure

In your target application, create the following directory structure:

```
src/app/components/media-player/
├── docs/                          # Documentation (optional)
├── example/                       # Example component (optional)
├── fab/                          # Minimized player button
│   ├── media-player-fab.component.html
│   ├── media-player-fab.component.scss  
│   └── media-player-fab.component.ts
├── fixed-player/                 # In-page embedded player
│   ├── fixed-player.component.html
│   ├── fixed-player.component.scss
│   └── fixed-player.component.ts
├── floating-player/              # Overlay floating player
│   ├── floating-player.component.html
│   ├── floating-player.component.scss
│   └── floating-player.component.ts
├── services/                     # Core service
│   └── media-player.service.ts
├── video-placeholder/            # Loading states (optional)
│   ├── video-placeholder.component.html
│   ├── video-placeholder.component.scss
│   └── video-placeholder.component.ts
├── video-player/                 # Core video engine
│   └── video-player.component.ts
└── media-player.module.ts        # Module definition (create new)
```

### 1.2 Copy Files

Copy these files from this project to your target application:

**Required Files:**
```bash
# Core service (REQUIRED)
src/app/components/media-player/services/media-player.service.ts

# Core video engine (REQUIRED)  
src/app/components/media-player/video-player/video-player.component.ts

# Player components (choose what you need)
src/app/components/media-player/floating-player/
src/app/components/media-player/fixed-player/
src/app/components/media-player/fab/

# Optional components
src/app/components/media-player/video-placeholder/
src/app/components/media-player/example/
```

## Step 2: Install Dependencies

### 2.1 Install Required Packages

```bash
# Core dependencies
npm install @angular/material @angular/cdk
npm install @angular/animations
npm install rxjs

# Video.js for enhanced video support (optional but recommended)
npm install video.js @types/video.js
```

### 2.2 Update Angular Configuration

Add Video.js to your `angular.json` if you want enhanced video support:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "allowedCommonJsDependencies": [
              "video.js"
            ]
          }
        }
      }
    }
  }
}
```

### 2.3 Import Material Icons

Ensure Angular Material icons are available in your `index.html`:

```html
<!-- Add to <head> section -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

## Step 3: Create Media Player Module

Create a new module file: `src/app/components/media-player/media-player.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Import all media player components
import { MediaPlayerService } from './services/media-player.service';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { FloatingPlayerComponent } from './floating-player/floating-player.component';
import { FixedPlayerComponent } from './fixed-player/fixed-player.component';
import { MediaPlayerFabComponent } from './fab/media-player-fab.component';
import { VideoPlaceholderComponent } from './video-placeholder/video-placeholder.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    // Import standalone components
    VideoPlayerComponent,
    FloatingPlayerComponent,
    FixedPlayerComponent,
    MediaPlayerFabComponent,
    VideoPlaceholderComponent
  ],
  exports: [
    // Export components for use in other modules
    VideoPlayerComponent,
    FloatingPlayerComponent,
    FixedPlayerComponent,
    MediaPlayerFabComponent,
    VideoPlaceholderComponent
  ],
  providers: [
    MediaPlayerService
  ]
})
export class MediaPlayerModule { }
```

**Alternative: Using Standalone Components (Angular 14+)**

If your application uses standalone components, you can skip the module and import components directly:

```typescript
// In your component
import { FloatingPlayerComponent } from './components/media-player/floating-player/floating-player.component';
import { MediaPlayerService } from './components/media-player/services/media-player.service';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [FloatingPlayerComponent], // Direct import
  // ...
})
export class MyComponent {
  constructor(private mediaPlayerService: MediaPlayerService) {}
}
```

## Step 4: Update Import Paths

### 4.1 Fix Import Paths in Copied Files

After copying files, update import paths to match your application structure:

**In each component file, update imports:**

```typescript
// BEFORE (FlowAccount app paths)
import { MediaPlayerService } from '../services/media-player.service';
import { VideoPlayerComponent } from '../video-player/video-player.component';

// AFTER (your app paths - adjust as needed)
import { MediaPlayerService } from '../services/media-player.service';
import { VideoPlayerComponent } from '../video-player/video-player.component';

// Or if you have different structure:
import { MediaPlayerService } from './services/media-player.service';
import { VideoPlayerComponent } from './video-player/video-player.component';
```

### 4.2 Set Up Path Mapping (Optional but Recommended)

Add path mapping to your `tsconfig.json` for cleaner imports:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@media-player/*": ["app/components/media-player/*"],
      "@components/*": ["app/components/*"]
    }
  }
}
```

Then update imports to use the alias:

```typescript
import { MediaPlayerService } from '@media-player/services/media-player.service';
import { FloatingPlayerComponent } from '@media-player/floating-player/floating-player.component';
```

## Step 5: Integration into Your Application

### 5.1 App-Level Integration (Recommended)

Add media player components to your main app component for global availability:

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { FloatingPlayerComponent } from './components/media-player/floating-player/floating-player.component';
import { MediaPlayerFabComponent } from './components/media-player/fab/media-player-fab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // Your existing imports
    FloatingPlayerComponent,
    MediaPlayerFabComponent
  ],
  template: `
    <div class="app-container">
      <!-- Your existing app structure -->
      <app-navigation></app-navigation>
      <router-outlet></router-outlet>
      
      <!-- Add media player components -->
      <app-floating-player></app-floating-player>
      <app-media-player-fab></app-media-player-fab>
    </div>
  `
})
export class AppComponent {}
```

### 5.2 Module-Based Integration

If using modules, import the MediaPlayerModule:

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MediaPlayerModule } from './components/media-player/media-player.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MediaPlayerModule // Add media player module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 5.3 Component-Level Integration

Use the media player in specific components:

```typescript
// example-component.ts
import { Component } from '@angular/core';
import { MediaPlayerService, MediaConfig } from './components/media-player/services/media-player.service';
import { FixedPlayerComponent } from './components/media-player/fixed-player/fixed-player.component';

@Component({
  selector: 'app-tutorial-page',
  standalone: true,
  imports: [FixedPlayerComponent],
  template: `
    <div class="tutorial-content">
      <h1>Tutorial: Getting Started</h1>
      <button (click)="playTutorial()">Watch Tutorial</button>
      
      <!-- Embedded player for in-page content -->
      <div class="video-container">
        <app-fixed-player></app-fixed-player>
      </div>
    </div>
  `
})
export class TutorialPageComponent {
  constructor(private mediaPlayerService: MediaPlayerService) {}

  playTutorial(): void {
    const config: MediaConfig = {
      id: 'getting-started-tutorial',
      url: '/assets/videos/tutorial-getting-started.mp4',
      title: 'Getting Started Tutorial',
      description: 'Learn the basics of our application'
    };
    
    this.mediaPlayerService.launchFixedPlayer(config);
  }
}
```

## Step 6: Asset Management

### 6.1 Video Asset Structure

Organize your video assets in a logical structure:

```
src/assets/videos/
├── tutorials/
│   ├── getting-started.mp4
│   ├── advanced-features.mp4
│   └── troubleshooting.mp4
├── help/
│   ├── dashboard-overview.mp4
│   ├── user-management.mp4
│   └── settings-guide.mp4
└── onboarding/
    ├── welcome.mp4
    ├── first-steps.mp4
    └── feature-tour.mp4
```

### 6.2 Video URL Configuration

Create a configuration service for managing video URLs:

```typescript
// video-config.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoConfigService {
  private readonly baseUrl = '/assets/videos';
  
  // Or use CDN
  // private readonly baseUrl = 'https://your-cdn.com/videos';

  getVideoUrl(category: string, filename: string): string {
    return `${this.baseUrl}/${category}/${filename}.mp4`;
  }

  getTutorialUrl(tutorialName: string): string {
    return this.getVideoUrl('tutorials', tutorialName);
  }

  getHelpUrl(helpTopic: string): string {
    return this.getVideoUrl('help', helpTopic);
  }
}
```

Usage example:
```typescript
// In your component
constructor(
  private mediaPlayerService: MediaPlayerService,
  private videoConfig: VideoConfigService
) {}

playTutorial(): void {
  this.mediaPlayerService.launchFloatingPlayer({
    id: 'dashboard-tutorial',
    url: this.videoConfig.getTutorialUrl('dashboard-overview'),
    title: 'Dashboard Overview'
  });
}
```

## Step 7: Environment-Specific Configuration

### 7.1 Environment Configuration

Set up environment-specific video configurations:

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  videoConfig: {
    enableAnalytics: false,
    baseUrl: '/assets/videos',
    autoSaveInterval: 10000, // 10 seconds
    defaultVolume: 0.8
  }
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  videoConfig: {
    enableAnalytics: true,
    baseUrl: 'https://your-production-cdn.com/videos',
    autoSaveInterval: 5000, // 5 seconds in production
    defaultVolume: 0.8
  }
};
```

### 7.2 Update Media Player Service

Modify the MediaPlayerService to use environment configuration:

```typescript
// In media-player.service.ts, add at the top:
import { environment } from '../../../environments/environment';

// In the service class, update methods:
private saveVideoPosition(videoId: string, currentTime: number): void {
  if (typeof localStorage === 'undefined') return;
  
  // Use environment config for save interval
  const saveInterval = environment.videoConfig.autoSaveInterval / 1000;
  
  try {
    const positions = JSON.parse(localStorage.getItem('videoPositions') || '{}');
    positions[videoId] = currentTime;
    localStorage.setItem('videoPositions', JSON.stringify(positions));
  } catch (e) {
    console.error('Could not save video position', e);
  }
}

private trackEvent(eventName: string, eventData: any): void {
  // Only track if analytics is enabled
  if (!environment.videoConfig.enableAnalytics) return;
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData);
  }
  
  if (!environment.production) {
    console.log(`Analytics: ${eventName}`, eventData);
  }
}
```

## Step 8: Styling Integration

### 8.1 CSS Variables Integration

If your application uses CSS custom properties, you can integrate the media player styling:

```scss
// In your global styles or theme file
:root {
  // Media player color scheme
  --media-player-primary: #1976d2;
  --media-player-secondary: #424242;
  --media-player-background: rgba(0, 0, 0, 0.8);
  --media-player-text: #ffffff;
  --media-player-border-radius: 8px;
  
  // Integration with your app's color scheme
  --media-player-primary: var(--your-app-primary, #1976d2);
  --media-player-secondary: var(--your-app-secondary, #424242);
}
```

### 8.2 Custom Styling

Override media player styles to match your application's design:

```scss
// custom-media-player.scss
.floating-player-container {
  // Override with your app's styling
  border-radius: var(--your-app-border-radius, 12px);
  box-shadow: var(--your-app-shadow, 0 8px 32px rgba(0,0,0,0.3));
  
  .controls-bar {
    background: var(--your-app-surface-color, rgba(255,255,255,0.1));
  }
  
  .play-pause-button {
    color: var(--your-app-primary-color, #1976d2);
  }
}

// Apply your app's button styles
.media-player-button {
  @extend .your-app-button-class;
}
```

## Step 9: Testing Integration

### 9.1 Unit Test Setup

Set up unit tests for the integrated media player:

```typescript
// media-player.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { MediaPlayerService } from './media-player.service';

describe('MediaPlayerService', () => {
  let service: MediaPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaPlayerService]
    });
    service = TestBed.inject(MediaPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should launch floating player with correct config', () => {
    const config = {
      id: 'test-video',
      url: '/test-video.mp4',
      title: 'Test Video'
    };

    service.launchFloatingPlayer(config);
    
    expect(service.currentState.videoId).toBe('test-video');
    expect(service.currentState.isFloating).toBe(true);
  });
});
```

### 9.2 Integration Test Component

Create a test component to verify integration:

```typescript
// media-player-test.component.ts
import { Component } from '@angular/core';
import { MediaPlayerService } from './components/media-player/services/media-player.service';
import { FloatingPlayerComponent } from './components/media-player/floating-player/floating-player.component';

@Component({
  selector: 'app-media-player-test',
  standalone: true,
  imports: [FloatingPlayerComponent],
  template: `
    <div class="test-container">
      <h2>Media Player Integration Test</h2>
      
      <button (click)="testFloatingPlayer()" data-test="floating-test">
        Test Floating Player
      </button>
      
      <button (click)="testVideoState()" data-test="state-test">
        Test Video State
      </button>
      
      <div data-test="state-display">
        Current Video: {{ currentState.title || 'None' }}
        <br>
        Playing: {{ currentState.isPlaying ? 'Yes' : 'No' }}
        <br>
        Time: {{ currentState.currentTime }}s / {{ currentState.duration }}s
      </div>
      
      <app-floating-player></app-floating-player>
    </div>
  `
})
export class MediaPlayerTestComponent {
  currentState = this.mediaPlayerService.currentState;

  constructor(private mediaPlayerService: MediaPlayerService) {
    // Subscribe to state changes for real-time updates
    this.mediaPlayerService.state$.subscribe(state => {
      this.currentState = state;
    });
  }

  testFloatingPlayer(): void {
    this.mediaPlayerService.launchFloatingPlayer({
      id: 'integration-test',
      url: '/assets/videos/test-video.mp4',
      title: 'Integration Test Video',
      description: 'Testing media player integration'
    });
  }

  testVideoState(): void {
    console.log('Current Media Player State:', this.currentState);
  }
}
```

## Step 10: Production Deployment Checklist

### 10.1 Pre-Deployment Verification

- [ ] **Dependencies installed**: All required packages are in package.json
- [ ] **Import paths updated**: All import statements point to correct locations
- [ ] **Environment config**: Production settings are properly configured
- [ ] **Video assets**: All video files are accessible in production environment
- [ ] **Build success**: Application builds without errors
- [ ] **Type checking**: No TypeScript errors
- [ ] **Testing**: Unit tests pass and integration tests work

### 10.2 Performance Optimization

```typescript
// Lazy load media player components when needed
const loadMediaPlayer = () => import('./components/media-player/floating-player/floating-player.component')
  .then(m => m.FloatingPlayerComponent);

// Use in router or dynamic loading
{
  path: 'tutorial',
  loadComponent: loadMediaPlayer
}
```

### 10.3 Error Handling

Add error boundaries for production:

```typescript
// error-handler.service.ts
import { Injectable } from '@angular/core';
import { MediaPlayerService } from './components/media-player/services/media-player.service';

@Injectable({
  providedIn: 'root'
})
export class MediaPlayerErrorHandler {
  constructor(private mediaPlayerService: MediaPlayerService) {}

  handleVideoError(error: any, videoId: string): void {
    console.error(`Video error for ${videoId}:`, error);
    
    // Reset player state
    this.mediaPlayerService.reset();
    
    // Show user-friendly error message
    this.showErrorToUser('Video failed to load. Please try again.');
    
    // Track error for analytics
    this.trackError(error, videoId);
  }

  private showErrorToUser(message: string): void {
    // Integrate with your app's notification system
  }

  private trackError(error: any, videoId: string): void {
    // Send error to your logging service
  }
}
```

## Step 11: Documentation for Your Team

### 11.1 Create Internal Documentation

Create a README specific to your implementation:

```markdown
# Media Player Implementation - [Your App Name]

## Quick Start
```typescript
// Launch tutorial video
this.mediaPlayerService.launchFloatingPlayer({
  id: 'feature-tutorial',
  url: this.videoConfig.getTutorialUrl('feature-overview'),
  title: 'Feature Overview'
});
```

## Available Videos
- Tutorial videos: `/assets/videos/tutorials/`
- Help videos: `/assets/videos/help/`
- Onboarding: `/assets/videos/onboarding/`

## Team Guidelines
1. Use descriptive video IDs for progress tracking
2. Always provide titles for accessibility
3. Test video loading in development environment
4. Follow naming convention: `category-feature-version`

## Troubleshooting
- Video not loading: Check file path and MIME types
- Player not appearing: Verify component imports
- State not persisting: Check localStorage availability
```

### 11.2 Training Materials

Create examples specific to your application's use cases:

```typescript
// examples/help-system-integration.ts
export class HelpSystemExample {
  constructor(private mediaPlayerService: MediaPlayerService) {}

  // Context-sensitive help for your specific features
  showInvoiceHelp(): void {
    this.mediaPlayerService.launchFloatingPlayer({
      id: 'invoice-help-2024',
      url: '/assets/help/invoice-creation.mp4',
      title: 'Creating Invoices - Help Guide'
    });
  }

  showReportHelp(): void {
    this.mediaPlayerService.launchFloatingPlayer({
      id: 'reports-help-2024', 
      url: '/assets/help/financial-reports.mp4',
      title: 'Financial Reports - Help Guide'
    });
  }
}
```

## Summary

This migration guide provides a complete process for extracting the FlowAccount Media Player and integrating it into your production Angular TypeScript application. The media player system is designed to be:

- **Self-contained**: All dependencies are clearly defined
- **Modular**: Use only the components you need
- **Configurable**: Adapt to your application's requirements
- **Production-ready**: Includes error handling, testing, and optimization

Follow these steps sequentially, and you'll have a fully functional, professional video player system integrated into your production application.

## Migration Support

If you encounter issues during migration:

1. **Check import paths**: Most issues stem from incorrect import statements
2. **Verify dependencies**: Ensure all required packages are installed
3. **Test incrementally**: Start with basic functionality before adding advanced features
4. **Use the test component**: The provided test component helps verify integration

The media player system has been designed for easy extraction and integration, making it straightforward to implement in your production environment.