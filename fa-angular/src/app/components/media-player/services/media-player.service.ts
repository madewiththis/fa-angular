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
  pipSize: 'full' | 'half';
  isFloating: boolean;
  isMinimized: boolean;
  wasPlayingBeforeMinimize: boolean;
  isFakeFullscreen: boolean;
  // for seeking
  seekTo: number | null;
}

export interface MediaConfig {
  id: string;
  url: string;
  title?: string;
  description?: string;
  startTime?: number;
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
    pipSize: 'half',
    isFloating: false,
    isMinimized: false,
    wasPlayingBeforeMinimize: false,
    isFakeFullscreen: false,
    seekTo: null,
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
    
    const newState: PlayerState = {
      ...this.initialState,
      videoId: config.id,
      videoUrl: config.url,
      title: config.title,
      description: config.description,
      currentTime: startTime,
      isInitialized: true,
      isFloating: currentState.isFloating,
      pipPosition: currentState.pipPosition,
      pipSize: currentState.pipSize,
      isFakeFullscreen: false
    };
    
    this.stateSubject.next(newState);
    this.trackEvent('video_init', { 
      videoId: config.id,
      startTime: startTime,
      savedPosition: savedPosition
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
    this.updateState({ isFloating: true });
    this.trackEvent('video_floating_enter', { 
      videoId: this.currentState.videoId
    });
  }

  exitFloating(): void {
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

  minimizeVideo(): void {
    if(this.currentState.isFloating) {
      this.updateState({ isMinimized: true, isPlaying: false });
    }
  }

  restoreVideo(): void {
    if(this.currentState.isFloating) {
      this.updateState({ isMinimized: false, isPlaying: true });
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
    });
  }
} 