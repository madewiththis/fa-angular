# Media Player API Reference

## MediaPlayerService

**Location**: `src/app/components/media-player/services/media-player.service.ts`

### Interfaces

#### PlayerState
```typescript
interface PlayerState {
  videoId: string | null;                    // Unique video identifier
  videoUrl: string | null;                   // Video source URL
  title: string | null;                      // Video title
  description: string | null;                // Video description
  currentTime: number;                       // Current playback position (seconds)
  duration: number;                          // Total video duration (seconds)
  isPlaying: boolean;                        // Playback state
  isHidden: boolean;                         // Hidden state (for FAB display)
  isPiP: boolean;                           // Picture-in-picture mode (future use)
  isInitialized: boolean;                   // Video loaded state
  volume: number;                           // Volume level (0-1)
  pipPosition: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'center';
  pipPositionBeforeMinimize: PlayerState['pipPosition'] | null;
  pipSize: 'full' | 'half';                // Player size
  isFloating: boolean;                      // Floating/overlay mode
  isMinimized: boolean;                     // Minimized state
  wasPlayingBeforeMinimize: boolean;        // Playback state before minimize
  timeBeforeMinimize: number | null;        // Time position before minimize
  isFakeFullscreen: boolean;                // Full-screen overlay mode
  seekTo: number | null;                    // Pending seek operation
  playerMode: 'floating' | 'fixed';        // Player display mode
}
```

#### MediaConfig
```typescript
interface MediaConfig {
  id: string;                               // Required: Unique identifier for progress tracking
  url: string;                              // Required: Video URL (HTML5 or YouTube)
  title?: string;                           // Optional: Display title
  description?: string;                     // Optional: Video description
  startTime?: number;                       // Optional: Start position in seconds
  mode?: 'floating' | 'fixed';            // Optional: Player mode (default: 'fixed')
}
```

### Properties

#### state$: Observable<PlayerState>
```typescript
public readonly state$: Observable<PlayerState>
```
Observable stream of player state changes. Subscribe to receive real-time updates.

**Example:**
```typescript
this.mediaPlayerService.state$.subscribe(state => {
  if (state.isPlaying) {
    console.log('Video is playing');
  }
});
```

#### currentState: PlayerState
```typescript
get currentState(): PlayerState
```
Current state snapshot without subscription.

**Example:**
```typescript
const currentTime = this.mediaPlayerService.currentState.currentTime;
```

### Methods

#### initializeVideo(config: MediaConfig): void
Initialize video with configuration. Use `launchFloatingPlayer()` or `launchFixedPlayer()` instead for typical usage.

#### launchFloatingPlayer(config: MediaConfig): void
```typescript
launchFloatingPlayer(config: MediaConfig): void
```
Start floating overlay player with specified configuration.

**Parameters:**
- `config` - MediaConfig object with video details

**Example:**
```typescript
this.mediaPlayerService.launchFloatingPlayer({
  id: 'tutorial-1',
  url: '/assets/videos/tutorial.mp4',
  title: 'Getting Started',
  description: 'Basic tutorial video',
  startTime: 0,
  mode: 'floating'
});
```

#### launchFixedPlayer(config: MediaConfig): void
```typescript
launchFixedPlayer(config: MediaConfig): void
```
Start embedded/fixed player with specified configuration.

**Parameters:**
- `config` - MediaConfig object with video details

**Example:**
```typescript
this.mediaPlayerService.launchFixedPlayer({
  id: 'lesson-1',
  url: 'https://youtube.com/watch?v=abc123',
  title: 'Lesson 1',
  mode: 'fixed'
});
```

#### updateCurrentTime(time: number): void
```typescript
updateCurrentTime(time: number): void
```
Update current playback time. Automatically saves progress every 10 seconds.

**Parameters:**
- `time` - Current time in seconds

#### updateDuration(duration: number): void
```typescript
updateDuration(duration: number): void
```
Update video total duration.

**Parameters:**
- `duration` - Total duration in seconds

#### setPlaying(isPlaying: boolean): void
```typescript
setPlaying(isPlaying: boolean): void
```
Set playback state and trigger analytics tracking.

**Parameters:**
- `isPlaying` - True for playing, false for paused

#### hide(): void
```typescript
hide(): void
```
Hide player (shows FAB button).

#### restore(): void
```typescript
restore(): void
```
Restore hidden player.

#### enterFloating(): void
```typescript
enterFloating(): void
```
Switch to floating mode.

#### enterFixed(): void
```typescript
enterFixed(): void
```
Switch to fixed mode.

#### exitFloating(): void
```typescript
exitFloating(): void
```
Exit floating player and save progress.

#### exitFixed(): void
```typescript
exitFixed(): void
```
Exit fixed player and save progress.

#### setFloatingPosition(position: PlayerState['pipPosition']): void
```typescript
setFloatingPosition(position: PlayerState['pipPosition']): void
```
Set floating player position.

**Parameters:**
- `position` - One of: 'bottom-right', 'top-right', 'bottom-left', 'top-left', 'center'

**Example:**
```typescript
this.mediaPlayerService.setFloatingPosition('top-right');
```

#### setFloatingSize(size: 'full' | 'half'): void
```typescript
setFloatingSize(size: 'full' | 'half'): void
```
Set floating player size.

**Parameters:**
- `size` - 'full' or 'half'

**Example:**
```typescript
this.mediaPlayerService.setFloatingSize('full');
```

#### setVolume(volume: number): void
```typescript
setVolume(volume: number): void
```
Set volume level.

**Parameters:**
- `volume` - Volume level between 0 and 1

**Example:**
```typescript
this.mediaPlayerService.setVolume(0.8); // 80% volume
```

#### seekTo(time: number): void
```typescript
seekTo(time: number): void
```
Seek to specific time position.

**Parameters:**
- `time` - Target time in seconds

**Example:**
```typescript
this.mediaPlayerService.seekTo(120); // Seek to 2 minutes
```

#### skipBackward(seconds: number = 10): void
```typescript
skipBackward(seconds: number = 10): void
```
Skip backward by specified seconds.

**Parameters:**
- `seconds` - Number of seconds to skip (default: 10)

**Example:**
```typescript
this.mediaPlayerService.skipBackward(30); // Skip back 30 seconds
```

#### skipForward(seconds: number = 10): void
```typescript
skipForward(seconds: number = 10): void
```
Skip forward by specified seconds.

**Parameters:**
- `seconds` - Number of seconds to skip (default: 10)

**Example:**
```typescript
this.mediaPlayerService.skipForward(15); // Skip forward 15 seconds
```

#### minimizeVideo(currentTime: number): void
```typescript
minimizeVideo(currentTime: number): void
```
Minimize floating player (shows FAB).

**Parameters:**
- `currentTime` - Current playback position

#### restoreVideo(): void
```typescript
restoreVideo(): void
```
Restore minimized player to previous state.

#### toggleFakeFullscreen(): void
```typescript
toggleFakeFullscreen(): void
```
Toggle full-screen overlay mode.

#### togglePlayPause(): void
```typescript
togglePlayPause(): void
```
Toggle between play and pause states.

#### reset(): void
```typescript
reset(): void
```
Reset player to initial state.

#### seekHandled(): void
```typescript
seekHandled(): void
```
Notify service that seek operation is complete.

#### isPiPSupported(): boolean
```typescript
isPiPSupported(): boolean
```
Check if browser supports Picture-in-Picture.

**Returns:**
- `boolean` - True if PiP is supported

## Component APIs

### FloatingPlayerComponent

**Selector**: `app-floating-player`

#### Properties
- `state: PlayerState` - Current player state
- `showPositionSelector: boolean` - Position selector visibility
- `isHovering: boolean` - Mouse hover state
- `showVolumeSlider: boolean` - Volume control visibility

#### Methods
- `close(): void` - Close floating player
- `minimize(): void` - Minimize player
- `restore(): void` - Restore from minimized
- `togglePositionSelector(): void` - Show/hide position selector
- `toggleFullscreen(): void` - Toggle fullscreen mode
- `toggleSize(): void` - Toggle between full/half size
- `setPosition(position): void` - Set player position
- `skipBackward(): void` - Skip backward 10 seconds
- `skipForward(): void` - Skip forward 10 seconds

### FixedPlayerComponent

**Selector**: `app-fixed-player`

#### Properties
- `state: PlayerState` - Current player state
- `isHovering: boolean` - Mouse hover state
- `showVolumeSlider: boolean` - Volume control visibility

#### Methods
- `toggleFullscreen(): void` - Toggle fullscreen mode
- `onProgressBarClick(event): void` - Handle progress bar clicks
- `formatTime(seconds): string` - Format time display

### VideoPlayerComponent

**Selector**: `app-video-player`

#### Inputs
- `@Input() src: string` - Video source URL
- `@Input() isPlaying: boolean` - Playback state
- `@Input() seekTime: number | null` - Seek position
- `@Input() volume: number` - Volume level

#### Outputs
- `@Output() timeUpdate: EventEmitter<number>` - Time updates
- `@Output() durationChange: EventEmitter<number>` - Duration changes
- `@Output() loaded: EventEmitter<void>` - Video loaded
- `@Output() seeked: EventEmitter<void>` - Seek completed

#### Methods
- `getCurrentTime(): number` - Get current playback time

### MediaPlayerFabComponent

**Selector**: `app-media-player-fab`

#### Properties
- `state$: Observable<PlayerState>` - Player state stream
- `showVolumeSlider: boolean` - Volume control visibility

#### Methods
- `restore(): void` - Restore minimized player
- `minimize(event): void` - Minimize player
- `close(event): void` - Close player
- `formatTime(seconds): string` - Format time display

## Usage Patterns

### Basic Video Launch
```typescript
// Launch floating tutorial
this.mediaPlayerService.launchFloatingPlayer({
  id: 'invoice-tutorial',
  url: '/assets/tutorials/invoicing.mp4',
  title: 'How to Create Invoices'
});

// Launch embedded lesson
this.mediaPlayerService.launchFixedPlayer({
  id: 'accounting-basics',
  url: '/assets/courses/accounting-101.mp4',
  title: 'Accounting Basics',
  mode: 'fixed'
});
```

### State Monitoring
```typescript
// Subscribe to all state changes
this.mediaPlayerService.state$.subscribe(state => {
  this.currentVideo = state.title;
  this.isVideoPlaying = state.isPlaying;
  this.videoProgress = state.currentTime / state.duration;
});

// Get current state snapshot
const { isPlaying, currentTime } = this.mediaPlayerService.currentState;
```

### Programmatic Control
```typescript
// Control playback
this.mediaPlayerService.setPlaying(true);
this.mediaPlayerService.seekTo(300); // 5 minutes
this.mediaPlayerService.setVolume(0.5); // 50% volume

// Control floating player
this.mediaPlayerService.setFloatingPosition('top-left');
this.mediaPlayerService.setFloatingSize('full');
this.mediaPlayerService.minimizeVideo(currentTime);
```

### Event Handling
```typescript
// Handle video events
onVideoEvent(eventType: string): void {
  switch(eventType) {
    case 'play':
      this.mediaPlayerService.setPlaying(true);
      break;
    case 'pause':
      this.mediaPlayerService.setPlaying(false);
      break;
    case 'ended':
      this.showNextVideoSuggestion();
      break;
  }
}
```

### Analytics Integration
```typescript
// Service automatically tracks these events:
// - video_init: Video initialization
// - video_start: Playback start
// - video_pause: Playback pause
// - video_skip_forward: Forward skip
// - video_skip_backward: Backward skip
// - video_floating_position_change: Position changes
// - video_floating_size_change: Size changes

// Events include contextual data:
// { videoId, currentTime, position, size, etc. }
```