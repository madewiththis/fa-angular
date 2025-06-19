# Video Tutorial Module

Interactive in-app help video player for FlowAccount built with Angular 17, Video.js v8, and Angular Material v3.

## Features

- **Inline Video Playback**: Smooth video player with custom controls
- **Picture-in-Picture Support**: Switch videos to PiP mode for multitasking
- **Hide/Restore Functionality**: Minimize videos and restore with state preservation
- **Keyboard Shortcuts**: Full accessibility with keyboard controls
- **Progress Tracking**: Resume videos from where you left off
- **Responsive Design**: Works across desktop, tablet, and mobile
- **Analytics Integration**: Built-in GA4 event tracking

## Quick Start

### 1. Install Dependencies

```bash
npm install video.js @types/video.js
# Angular Material should already be installed
```

### 2. Import the Module

```typescript
// In your feature module
import { TutorialModule } from './components/tutorial/tutorial.module';

@NgModule({
  imports: [
    // ... other imports
    TutorialModule.forRoot()
  ]
})
export class YourFeatureModule { }
```

### 3. Use in Components

```typescript
// In your component
import { VideoTutorialService, VideoConfig } from './components/tutorial/services/video-tutorial.service';

export class YourComponent {
  constructor(private tutorialService: VideoTutorialService) {}

  startTutorial() {
    const config: VideoConfig = {
      id: 'dashboard-intro',
      url: 'https://your-cdn.com/tutorials/dashboard-intro.mp4',
      title: 'Dashboard Introduction',
      startTime: 0
    };
    
    this.tutorialService.initializeVideo(config);
  }
}
```

### 4. Add Components to Template

```html
<!-- In your app.component.html or layout component -->
<app-video-tutorial 
  [config]="tutorialConfig" 
  [autoplay]="false">
</app-video-tutorial>

<app-tutorial-fab></app-tutorial-fab>
```

## API Reference

### VideoTutorialService

#### Methods
- `initializeVideo(config: VideoConfig)`: Start a new video tutorial
- `hide()`: Hide the video player
- `restore()`: Restore hidden video player  
- `enterPiP()`: Enter Picture-in-Picture mode
- `exitPiP()`: Exit Picture-in-Picture mode
- `setPlaying(isPlaying: boolean)`: Control playback
- `seekTo(time: number)`: Seek to specific time
- `reset()`: Reset service state

#### State Observable
```typescript
this.tutorialService.state$.subscribe(state => {
  console.log('Video state:', state);
});
```

### VideoConfig Interface
```typescript
interface VideoConfig {
  id: string;              // Unique identifier
  url: string;             // Video URL
  title?: string;          // Optional title
  description?: string;    // Optional description  
  startTime?: number;      // Start time in seconds
}
```

## Keyboard Shortcuts

- **Space/K**: Play/Pause
- **→/←**: Seek ±5 seconds
- **P**: Toggle Picture-in-Picture
- **H**: Hide video
- **Esc**: Exit PiP or cancel hide

## Browser Support

- **Picture-in-Picture**: Chrome 70+, Safari 13.1+, Firefox 122+
- **Video.js**: All modern browsers
- **Graceful Degradation**: PiP button auto-hides on unsupported browsers

## Performance

- **Lazy Loading**: Module can be lazy-loaded
- **Tree Shaking**: Import only needed Video.js components
- **Memory Management**: Automatic cleanup on route changes
- **Optimized Bundle**: ~45KB gzipped with Video.js

## Analytics Events

The module automatically tracks these events:

- `video_init`: Video initialized
- `video_start`: Video started playing
- `video_pause`: Video paused
- `video_hide`: Video hidden
- `video_restore`: Video restored
- `video_pip_enter`: Entered PiP mode
- `video_pip_exit`: Exited PiP mode

## Styling Customization

Override CSS custom properties to match your design:

```scss
:root {
  --fa-primary-color: #your-primary-color;
  --fa-primary-dark: #your-primary-dark;
  // ... other tokens
}
```

## Accessibility

- Full keyboard navigation
- Screen reader support
- High contrast mode support
- Focus management
- ARIA labels and roles

## Examples

### Basic Usage
```typescript
// Simple video tutorial
const basicConfig: VideoConfig = {
  id: 'intro',
  url: '/assets/videos/intro.mp4'
};
this.tutorialService.initializeVideo(basicConfig);
```

### Advanced Usage
```typescript
// With custom start time and metadata
const advancedConfig: VideoConfig = {
  id: 'advanced-features',
  url: 'https://cdn.example.com/tutorials/advanced.mp4',
  title: 'Advanced Features Tutorial',
  description: 'Learn advanced features in 5 minutes',
  startTime: 30 // Start at 30 seconds
};
this.tutorialService.initializeVideo(advancedConfig);
```

### State Management
```typescript
// Listen to state changes
this.tutorialService.state$.subscribe(state => {
  if (state.isHidden) {
    console.log('Video hidden at:', state.currentTime);
  }
  
  if (state.isPiP) {
    console.log('Video in Picture-in-Picture mode');
  }
});
```

## Troubleshooting

### Video Won't Load
- Check video URL is accessible
- Ensure CORS headers are set for cross-origin videos
- Verify video format is supported (MP4, WebM, OGG)

### PiP Not Working
- Check browser support: `this.tutorialService.isPiPSupported()`
- Ensure video is playing before entering PiP
- Check user hasn't disabled PiP in browser settings

### Performance Issues
- Use appropriate video bitrates for your audience
- Consider using adaptive streaming (HLS) for longer videos
- Ensure CDN is geographically distributed

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure accessibility compliance

## License

Part of the FlowAccount Angular application. 