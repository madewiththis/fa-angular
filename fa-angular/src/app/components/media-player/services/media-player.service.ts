import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PlayerState {
  videoId: string | null;
  videoUrl: string | null;
  title: string | null | undefined;
  description: string | null | undefined;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isHidden: boolean;
  isPiP: boolean;
  isInitialized: boolean;
  volume: number;
  // Custom PiP properties
  pipPosition: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'center';
  pipPositionBeforeMinimize: PlayerState['pipPosition'] | null;
  pipSize: 'full' | 'half';
  isFloating: boolean;
  isMinimized: boolean;
  wasPlayingBeforeMinimize: boolean;
  timeBeforeMinimize: number | null;
  isFakeFullscreen: boolean;
  // for seeking
  seekTo: number | null;
  // Player mode - floating or fixed
  playerMode: 'floating' | 'fixed';
}

export interface MediaConfig {
  id: string;
  url: string;
  title?: string;
  description?: string;
  startTime?: number;
  mode?: 'floating' | 'fixed';
}

@Injectable({
  providedIn: 'root'
})
export class MediaPlayerService {
  private readonly initialState: PlayerState = {
    videoId: null,
    videoUrl: null,
    title: null,
    description: null,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isHidden: false,
    isPiP: false,
    isInitialized: false,
    volume: 1,
    pipPosition: 'center',
    pipPositionBeforeMinimize: null,
    pipSize: 'half',
    isFloating: false,
    isMinimized: false,
    wasPlayingBeforeMinimize: false,
    timeBeforeMinimize: null,
    isFakeFullscreen: false,
    seekTo: null,
    playerMode: 'fixed',
  };

  private readonly stateSubject = new BehaviorSubject<PlayerState>(this.initialState);
  public readonly state$: Observable<PlayerState> = this.stateSubject.asObservable();
  
  constructor() {}

  get currentState(): PlayerState {
    return this.stateSubject.value;
  }

  initializeVideo(config: MediaConfig): void {
    const currentState = this.currentState;
    
    const savedPosition = this.loadVideoPosition(config.id);
    const startTime = config.startTime !== undefined ? config.startTime : savedPosition;
    const mode = config.mode || 'fixed';
    
    const newState: PlayerState = {
      ...this.initialState,
      videoId: config.id,
      videoUrl: config.url,
      title: config.title,
      description: config.description,
      currentTime: startTime,
      isInitialized: true,
      isFloating: mode === 'floating' ? true : currentState.isFloating,
      pipPosition: currentState.pipPosition,
      pipSize: currentState.pipSize,
      isFakeFullscreen: false,
      playerMode: mode
    };
    
    this.stateSubject.next(newState);
    this.trackEvent('video_init', { 
      videoId: config.id,
      startTime: startTime,
      savedPosition: savedPosition,
      mode: mode
    });
  }

  updateCurrentTime(time: number): void {
    if (this.currentState.videoId) {
      this.updateState({ currentTime: time });
      if (Math.floor(time) % 10 === 0) {
        this.saveVideoPosition(this.currentState.videoId, time);
      }
    }
  }

  updateDuration(duration: number): void {
    this.updateState({ duration });
  }

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

  hide(): void {
    this.updateState({ isHidden: true });
    this.trackEvent('video_hide', { 
      videoId: this.currentState.videoId,
      currentTime: this.currentState.currentTime 
    });
  }

  restore(): void {
    this.updateState({ isHidden: false });
    this.trackEvent('video_restore', { 
      videoId: this.currentState.videoId,
      currentTime: this.currentState.currentTime 
    });
  }

  enterPiP(): void {
    this.updateState({ isPiP: true });
    this.trackEvent('video_pip_enter', { 
      videoId: this.currentState.videoId,
      currentTime: this.currentState.currentTime 
    });
  }

  exitPiP(): void {
    this.updateState({ isPiP: false });
    this.trackEvent('video_pip_exit', { 
      videoId: this.currentState.videoId,
      currentTime: this.currentState.currentTime 
    });
  }

  enterFloating(): void {
    this.updateState({ isFloating: true, playerMode: 'floating' });
    this.trackEvent('video_floating_enter', { 
      videoId: this.currentState.videoId
    });
  }

  enterFixed(): void {
    this.updateState({ isFloating: false, playerMode: 'fixed' });
    this.trackEvent('video_fixed_enter', { 
      videoId: this.currentState.videoId
    });
  }

  exitFloating(): void {
    if(this.currentState.videoId) {
        this.saveVideoPosition(this.currentState.videoId, this.currentState.currentTime);
    }
    this.updateState({ ...this.initialState });
  }

  exitFixed(): void {
    if(this.currentState.videoId) {
        this.saveVideoPosition(this.currentState.videoId, this.currentState.currentTime);
    }
    this.updateState({ ...this.initialState });
  }

  setFloatingPosition(position: PlayerState['pipPosition']): void {
    this.updateState({ pipPosition: position });
    this.trackEvent('video_floating_position_change', { 
      videoId: this.currentState.videoId,
      position: position
    });
  }

  setFloatingSize(size: 'full' | 'half'): void {
    this.updateState({ pipSize: size });
    this.trackEvent('video_floating_size_change', { 
      videoId: this.currentState.videoId,
      size: size
    });
  }

  hasHome(): boolean {
    return !!this.currentState.videoId && !this.currentState.isFloating;
  }

  setVolume(volume: number): void {
    this.updateState({ volume });
  }

  seekTo(time: number): void {
    this.updateState({ seekTo: time, isPlaying: true });
  }

  skipBackward(seconds: number = 10): void {
    const newTime = Math.max(0, this.currentState.currentTime - seconds);
    this.seekTo(newTime);
    this.trackEvent('video_skip_backward', { 
      videoId: this.currentState.videoId,
      fromTime: this.currentState.currentTime,
      toTime: newTime,
      skipAmount: seconds
    });
  }

  skipForward(seconds: number = 10): void {
    const newTime = Math.min(this.currentState.duration || this.currentState.currentTime + seconds, this.currentState.currentTime + seconds);
    this.seekTo(newTime);
    this.trackEvent('video_skip_forward', { 
      videoId: this.currentState.videoId,
      fromTime: this.currentState.currentTime,
      toTime: newTime,
      skipAmount: seconds
    });
  }

  reset(): void {
    this.stateSubject.next(this.initialState);
  }

  isPiPSupported(): boolean {
    return document.pictureInPictureEnabled;
  }

  setFloatingCurrentTime(time: number): void {
    if (this.currentState.isFloating) {
      this.updateState({ currentTime: time });
    }
  }

  minimizeVideo(currentTime: number): void {
    if(this.currentState.isFloating) {
      this.updateState({ 
        wasPlayingBeforeMinimize: this.currentState.isPlaying,
        pipPositionBeforeMinimize: this.currentState.pipPosition,
        timeBeforeMinimize: currentTime,
        isMinimized: true, 
        isPlaying: false
      });
    }
  }

  restoreVideo(): void {
    if(this.currentState.isFloating) {
      this.updateState({ 
        isMinimized: false, 
        isPlaying: this.currentState.wasPlayingBeforeMinimize,
        pipPosition: this.currentState.pipPositionBeforeMinimize || 'center',
        seekTo: this.currentState.timeBeforeMinimize
      });
    }
  }

  toggleFakeFullscreen(): void {
    if(this.currentState.isFloating) {
      this.updateState({ isFakeFullscreen: !this.currentState.isFakeFullscreen });
    }
  }

  seekHandled(): void {
    this.updateState({ seekTo: null });
  }

  togglePlayPause(): void {
    this.updateState({ isPlaying: !this.currentState.isPlaying });
  }

  private saveVideoPosition(videoId: string, currentTime: number): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const positions = JSON.parse(localStorage.getItem('videoPositions') || '{}');
      positions[videoId] = currentTime;
      localStorage.setItem('videoPositions', JSON.stringify(positions));
    } catch (e) {
      console.error('Could not save video position', e);
    }
  }

  private loadVideoPosition(videoId: string): number {
    if (typeof localStorage === 'undefined') return 0;
    try {
      const positions = JSON.parse(localStorage.getItem('videoPositions') || '{}');
      return positions[videoId] || 0;
    } catch (e) {
      console.error('Could not load video position', e);
      return 0;
    }
  }

  private updateState(partialState: Partial<PlayerState>): void {
    this.stateSubject.next({ ...this.currentState, ...partialState });
  }

  private trackEvent(eventName: string, eventData: any): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        ...eventData
      });
    }
    console.log(`Analytics: ${eventName}`, eventData);
  }

  launchFloatingPlayer(config: MediaConfig): void {
    const savedPosition = this.loadVideoPosition(config.id);
    const startTime = config.startTime !== undefined ? config.startTime : savedPosition;

    this.updateState({
      ...this.initialState,
      isFloating: true,
      videoId: config.id,
      videoUrl: config.url,
      title: config.title ?? null,
      description: config.description ?? null,
      currentTime: startTime,
      isPlaying: true,
      playerMode: 'floating'
    });
  }

  launchFixedPlayer(config: MediaConfig): void {
    const savedPosition = this.loadVideoPosition(config.id);
    const startTime = config.startTime !== undefined ? config.startTime : savedPosition;

    this.updateState({
      ...this.initialState,
      isFloating: false,
      videoId: config.id,
      videoUrl: config.url,
      title: config.title ?? null,
      description: config.description ?? null,
      currentTime: startTime,
      isPlaying: true,
      playerMode: 'fixed'
    });
  }
} 