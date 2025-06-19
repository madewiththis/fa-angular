import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TutorialState {
  videoId: string | null;
  videoUrl: string | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isHidden: boolean;
  isPiP: boolean;
  isInitialized: boolean;
  volume: number;
  // Custom PiP properties
  pipPosition: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'center';
  pipSize: 'full' | 'half';
  isFloating: boolean;
  isMinimized: boolean;
  wasPlayingBeforeMinimize: boolean;
}

export interface VideoConfig {
  id: string;
  url: string;
  title?: string;
  description?: string;
  startTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VideoTutorialService {
  private readonly initialState: TutorialState = {
    videoId: null,
    videoUrl: null,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isHidden: false,
    isPiP: false,
    isInitialized: false,
    volume: 1,
    pipPosition: 'center',
    pipSize: 'half',
    isFloating: false,
    isMinimized: false,
    wasPlayingBeforeMinimize: false
  };

  private readonly stateSubject = new BehaviorSubject<TutorialState>(this.initialState);
  public readonly state$: Observable<TutorialState> = this.stateSubject.asObservable();
  
  // Keep reference to player instance for floating mode during navigation
  private floatingPlayerInstance: any = null;

  constructor() {}

  get currentState(): TutorialState {
    return this.stateSubject.value;
  }

  /**
   * Initialize a new video tutorial
   */
  initializeVideo(config: VideoConfig): void {
    const currentState = this.currentState;
    
    // Load saved position if no explicit start time provided
    const savedPosition = this.loadVideoPosition(config.id);
    const startTime = config.startTime !== undefined ? config.startTime : savedPosition;
    
    const newState: TutorialState = {
      ...this.initialState,
      videoId: config.id,
      videoUrl: config.url,
      currentTime: startTime,
      isInitialized: true,
      // Preserve floating state if it exists
      isFloating: currentState.isFloating,
      pipPosition: currentState.pipPosition,
      pipSize: currentState.pipSize
    };
    
    this.stateSubject.next(newState);
    this.trackEvent('video_init', { 
      videoId: config.id,
      startTime: startTime,
      savedPosition: savedPosition
    });
  }

  /**
   * Update the current playback time
   */
  updateCurrentTime(time: number): void {
    if (this.currentState.videoId) {
      this.updateState({ currentTime: time });
      
      // Periodically save position during playback (every 10 seconds)
      if (time > 0 && Math.floor(time) % 10 === 0) {
        this.saveVideoPosition(this.currentState.videoId, time);
      }
    }
  }

  /**
   * Update the video duration
   */
  updateDuration(duration: number): void {
    this.updateState({ duration });
  }

  /**
   * Set playing state
   */
  setPlaying(isPlaying: boolean): void {
    this.updateState({ isPlaying });
    
    if (isPlaying) {
      this.trackEvent('video_start', { 
        videoId: this.currentState.videoId,
        currentTime: this.currentState.currentTime 
      });
    } else {
      this.trackEvent('video_pause', { 
        videoId: this.currentState.videoId,
        currentTime: this.currentState.currentTime 
      });
    }
  }

  /**
   * Hide the video player
   */
  hide(): void {
    this.updateState({ isHidden: true });
    this.trackEvent('video_hide', { 
      videoId: this.currentState.videoId,
      currentTime: this.currentState.currentTime 
    });
  }

  /**
   * Restore the video player from hidden state
   */
  restore(): void {
    this.updateState({ isHidden: false });
    this.trackEvent('video_restore', { 
      videoId: this.currentState.videoId,
      currentTime: this.currentState.currentTime 
    });
  }

  /**
   * Enter Picture-in-Picture mode
   */
  enterPiP(): void {
    this.updateState({ isPiP: true });
    this.trackEvent('video_pip_enter', { 
      videoId: this.currentState.videoId,
      currentTime: this.currentState.currentTime 
    });
  }

  /**
   * Exit Picture-in-Picture mode
   */
  exitPiP(): void {
    this.updateState({ isPiP: false });
    this.floatingPlayerInstance = null; // Clear reference when exiting PiP
    this.trackEvent('video_pip_exit', { 
      videoId: this.currentState.videoId,
      currentTime: this.currentState.currentTime 
    });
  }

  /**
   * Store player instance for floating mode persistence
   */
  setFloatingPlayerInstance(player: any): void {
    console.log('🎬 Service: setFloatingPlayerInstance called with player:', !!player);
    console.log('🎬 Service: Current isFloating state:', this.currentState.isFloating);
    
    // Prevent overwriting if we already have the same instance
    if (this.floatingPlayerInstance === player) {
      console.log('🎬 Service: Same player instance already stored, skipping');
      return;
    }
    
    // Always store the player when explicitly called - don't depend on state timing
    this.floatingPlayerInstance = player;
    console.log('🎬 Service: Player instance stored successfully');
  }

  /**
   * Get stored player instance for floating mode
   */
  getFloatingPlayerInstance(): any {
    console.log('🎬 Service: getFloatingPlayerInstance called');
    console.log('🎬 Service: Current isFloating state:', this.currentState.isFloating);
    console.log('🎬 Service: Has stored player:', !!this.floatingPlayerInstance);
    return this.floatingPlayerInstance;
  }

  /**
   * Control video playback directly
   */
  playVideo(): void {
    console.log('🎮 Service: playVideo called');
    console.log('🎮 Service: Has floating player instance:', !!this.floatingPlayerInstance);
    
    if (this.floatingPlayerInstance && typeof this.floatingPlayerInstance.play === 'function') {
      console.log('🎮 Service: Calling play() on floating player');
      try {
        this.floatingPlayerInstance.play();
        this.updateState({ isPlaying: true });
      } catch (error) {
        console.error('🎮 Service: Error playing video:', error);
      }
    } else {
      console.log('🎮 Service: No valid floating player instance to play');
      this.updateState({ isPlaying: true }); // Update state anyway
    }
  }

  /**
   * Pause video directly
   */
  pauseVideo(): void {
    console.log('🎮 Service: pauseVideo called');
    console.log('🎮 Service: Has floating player instance:', !!this.floatingPlayerInstance);
    
    if (this.floatingPlayerInstance && typeof this.floatingPlayerInstance.pause === 'function') {
      console.log('🎮 Service: Calling pause() on floating player');
      try {
        this.floatingPlayerInstance.pause();
        this.updateState({ isPlaying: false });
      } catch (error) {
        console.error('🎮 Service: Error pausing video:', error);
      }
    } else {
      console.log('🎮 Service: No valid floating player instance to pause');
      this.updateState({ isPlaying: false }); // Update state anyway
    }
  }

  /**
   * Toggle play/pause
   */
  togglePlayPause(): void {
    if (this.currentState.isPlaying) {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
  }

  /**
   * Enter floating mode (custom PiP)
   */
  enterFloating(): void {
    console.log('🎬 Service: Entering floating mode');
    this.updateState({ 
      isFloating: true, 
      isHidden: false,
      isPiP: false, // Ensure we're not in native PiP when floating
      isMinimized: false // Ensure we're not minimized when entering floating
    });
    this.trackEvent('video_floating_enter', { 
      videoId: this.currentState.videoId,
      currentTime: this.currentState.currentTime 
    });
  }

  /**
   * Exit floating mode
   */
  exitFloating(): void {
    // Save current position before exiting
    if (this.currentState.videoId && this.currentState.currentTime > 0) {
      this.saveVideoPosition(this.currentState.videoId, this.currentState.currentTime);
    }
    
    this.updateState({ isFloating: false });
    // Clear the floating player instance when exiting floating mode
    this.floatingPlayerInstance = null;
    console.log('🎬 Service: Cleared floating player instance on exit');
    this.trackEvent('video_floating_exit', { 
      videoId: this.currentState.videoId,
      currentTime: this.currentState.currentTime 
    });
  }

  /**
   * Set floating position
   */
  setFloatingPosition(position: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'center'): void {
    console.log('🎯 Service: setFloatingPosition called with:', position);
    console.log('🎯 Service: Current position:', this.currentState.pipPosition);
    this.updateState({ pipPosition: position });
    console.log('🎯 Service: Position updated to:', position);
    this.trackEvent('video_floating_position', { 
      videoId: this.currentState.videoId,
      position: position 
    });
  }

  /**
   * Set floating size
   */
  setFloatingSize(size: 'full' | 'half'): void {
    console.log('📏 Service: setFloatingSize called with:', size);
    console.log('📏 Service: Current size:', this.currentState.pipSize);
    this.updateState({ pipSize: size });
    console.log('📏 Service: Size updated to:', size);
    this.trackEvent('video_floating_size', { 
      videoId: this.currentState.videoId,
      size: size 
    });
  }

  /**
   * Check if video has a home (original location)
   */
  hasHome(): boolean {
    // Check if we're on a page that can display the video inline
    const currentPath = window.location.pathname;
    return currentPath.includes('/dashboard/get-started') || 
           currentPath.includes('/tutorial') ||
           currentPath.includes('/help');
  }

  /**
   * Update volume
   */
  setVolume(volume: number): void {
    this.updateState({ volume: Math.max(0, Math.min(1, volume)) });
  }

  /**
   * Seek to specific time
   */
  seekTo(time: number): void {
    this.updateState({ currentTime: Math.max(0, Math.min(this.currentState.duration, time)) });
  }

  /**
   * Reset the service state
   */
  reset(): void {
    // Save current position before resetting
    if (this.currentState.videoId && this.currentState.currentTime > 0) {
      this.saveVideoPosition(this.currentState.videoId, this.currentState.currentTime);
    }
    
    this.stateSubject.next(this.initialState);
  }

  /**
   * Check if Picture-in-Picture is supported
   */
  isPiPSupported(): boolean {
    return 'pictureInPictureEnabled' in document;
  }

  /**
   * Set current time from floating player
   */
  setFloatingCurrentTime(time: number): void {
    console.log('🎯 Service: setFloatingCurrentTime called with:', time);
    this.updateState({ currentTime: time });
    if (this.floatingPlayerInstance) {
      this.floatingPlayerInstance.currentTime(time);
    }
  }

  /**
   * Save video position to localStorage
   */
  private saveVideoPosition(videoId: string, currentTime: number): void {
    if (videoId && currentTime > 0) {
      try {
        const key = `video_position_${videoId}`;
        localStorage.setItem(key, currentTime.toString());
        console.log(`💾 Saved video position for ${videoId}: ${currentTime}s`);
      } catch (error) {
        console.warn('Failed to save video position:', error);
      }
    }
  }

  /**
   * Load video position from localStorage
   */
  private loadVideoPosition(videoId: string): number {
    if (videoId) {
      try {
        const key = `video_position_${videoId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          const position = parseFloat(saved);
          console.log(`📖 Loaded video position for ${videoId}: ${position}s`);
          return position;
        }
      } catch (error) {
        console.warn('Failed to load video position:', error);
      }
    }
    return 0;
  }

  /**
   * Clear saved video position
   */
  private clearVideoPosition(videoId: string): void {
    if (videoId) {
      try {
        const key = `video_position_${videoId}`;
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared video position for ${videoId}`);
      } catch (error) {
        console.warn('Failed to clear video position:', error);
      }
    }
  }

  /**
   * Clear all saved video positions (for debugging)
   */
  clearAllSavedPositions(): void {
    try {
      const keys = Object.keys(localStorage);
      const videoPositionKeys = keys.filter(key => key.startsWith('video_position_'));
      
      videoPositionKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log(`🗑️ Cleared ${videoPositionKeys.length} saved video positions`);
    } catch (error) {
      console.warn('Failed to clear saved positions:', error);
    }
  }

  private updateState(partialState: Partial<TutorialState>): void {
    const currentState = this.currentState;
    const newState = { ...currentState, ...partialState };
    this.stateSubject.next(newState);
  }

  private trackEvent(eventName: string, eventData: any): void {
    // Integration with existing GA4 wrapper
    // This should be replaced with your actual analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        custom_parameter_1: eventData.videoId,
        custom_parameter_2: eventData.currentTime,
        ...eventData
      });
    }
    
    // Console log for development
    console.log(`Tutorial Analytics: ${eventName}`, eventData);
  }

  /**
   * A dedicated method to launch a video directly into floating mode and play it.
   * This ensures all state changes happen in a single update.
   */
  launchFloatingVideo(config: VideoConfig): void {
    console.log('🚀 Service: Launching floating video with config:', config);
    this.initializeVideo(config); // This sets up videoId, url, etc.
    
    // Update all relevant states for a direct launch
    this.updateState({
      isFloating: true,
      isPlaying: true, // Set to play immediately
      isMinimized: false,
      pipPosition: 'center', // Default to center
      pipSize: 'full', // Launch in the larger size
      wasPlayingBeforeMinimize: false, // Reset this state
      isHidden: false,
      isPiP: false
    });
    
    this.trackEvent('video_floating_launch', { 
      videoId: config.id
    });
  }

  /**
   * Minimize floating video to a small button
   */
  minimizeVideo(): void {
    console.log('🔽 Service: minimizeVideo called');
    console.log('🔽 Service: Current playing state:', this.currentState.isPlaying);
    
    // Check actual player state to be sure
    let actuallyPlaying = this.currentState.isPlaying;
    if (this.floatingPlayerInstance && typeof this.floatingPlayerInstance.paused === 'function') {
      actuallyPlaying = !this.floatingPlayerInstance.paused();
      console.log('🔽 Service: Player actual state (not paused):', actuallyPlaying);
    }
    
    const wasPlaying = actuallyPlaying;
    console.log('🔽 Service: Will store wasPlayingBeforeMinimize as:', wasPlaying);
    
    if (this.floatingPlayerInstance && wasPlaying) {
      console.log('🔽 Service: Pausing video before minimize');
      this.floatingPlayerInstance.pause();
    }
    
    this.updateState({ 
      isMinimized: true,
      isPlaying: false,
      wasPlayingBeforeMinimize: wasPlaying
    });
    
    console.log('🔽 Service: State after minimize:', this.currentState);
    
    this.trackEvent('video_minimized', { 
      videoId: this.currentState.videoId,
      wasPlaying: wasPlaying
    });
  }

  /**
   * Restore video from minimized state
   */
  restoreVideo(): void {
    console.log('🔼 Service: restoreVideo called');
    console.log('🔼 Service: Current state before restore:', this.currentState);
    console.log('🔼 Service: wasPlayingBeforeMinimize:', this.currentState.wasPlayingBeforeMinimize);
    console.log('🔼 Service: isMinimized:', this.currentState.isMinimized);
    
    const wasPlaying = this.currentState.wasPlayingBeforeMinimize;
    
    this.updateState({ 
      isMinimized: false,
      wasPlayingBeforeMinimize: false
    });
    
    console.log('🔼 Service: State updated, new state:', this.currentState);
    
    this.trackEvent('video_restored', { 
      videoId: this.currentState.videoId,
      resumedPlayback: wasPlaying
    });
    
    // Handle playback restoration separately to avoid conflicts
    if (wasPlaying) {
      console.log('🔼 Service: Will attempt to restore playback in 300ms');
      setTimeout(() => {
        console.log('🔼 Service: Attempting to restore playback now');
        console.log('🔼 Service: Has player instance:', !!this.floatingPlayerInstance);
        console.log('🔼 Service: Current isPlaying:', this.currentState.isPlaying);
        
        if (this.floatingPlayerInstance && !this.currentState.isPlaying) {
          console.log('🔼 Service: Calling play() on player instance');
          try {
            // Simply resume playback without triggering reload events
            this.floatingPlayerInstance.play();
            this.updateState({ isPlaying: true });
            console.log('🔼 Service: Playback restored successfully');
          } catch (error) {
            console.error('🔼 Service: Error restoring playback:', error);
          }
        } else {
          console.log('🔼 Service: Skipping playback restore - no player or already playing');
        }
      }, 300);
    } else {
      console.log('🔼 Service: Video was not playing before minimize, not restoring playback');
    }
  }
} 