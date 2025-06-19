import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, inject, ElementRef, ChangeDetectorRef, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil, Subscription, firstValueFrom } from 'rxjs';
import videojs from 'video.js';

import { VideoTutorialComponent } from '../video-tutorial/video-tutorial.component';
import { VideoTutorialService, TutorialState } from '../services/video-tutorial.service';

@Component({
  selector: 'app-floating-video',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, VideoTutorialComponent],
  template: `
    <div 
      class="floating-video-container"
      *ngIf="state.isFloating && state.videoUrl"
      [class]="getContainerClasses()"
      [style]="getContainerStyles()"
      [class.minimized-hidden]="state.isMinimized"
    >
      <!-- Video Player -->
      <div class="floating-video-content">
        <app-video-tutorial 
          [config]="getVideoConfig()"
          [autoplay]="false"
          [inline]="true"
          [showControls]="true">
        </app-video-tutorial>
        
        <!-- Position Overlay -->
        <div class="position-overlay" *ngIf="showPositionMenu" (click)="showPositionMenu = false; $event.stopPropagation()">
          <button class="position-btn top-left" (click)="changePosition('top-left'); $event.stopPropagation()" title="Top Left">
            <mat-icon>north_west</mat-icon>
          </button>
          <button class="position-btn top-right" (click)="changePosition('top-right'); $event.stopPropagation()" title="Top Right">
            <mat-icon>north_east</mat-icon>
          </button>
          <button class="position-btn center" (click)="changePosition('center'); $event.stopPropagation()" title="Center">
            <mat-icon>center_focus_strong</mat-icon>
          </button>
          <button class="position-btn bottom-left" (click)="changePosition('bottom-left'); $event.stopPropagation()" title="Bottom Left">
            <mat-icon>south_west</mat-icon>
          </button>
          <button class="position-btn bottom-right" (click)="changePosition('bottom-right'); $event.stopPropagation()" title="Bottom Right">
            <mat-icon>south_east</mat-icon>
          </button>
        </div>
      </div>
      
      <!-- Controls Outside Video Area -->
      <div class="floating-controls-external">
        <!-- Time Display -->
        <div class="time-display">
          {{ formatTime(state.currentTime) }} / {{ formatTime(state.duration) }}
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
          <input 
            type="range" 
            class="progress-bar"
            [value]="state.currentTime" 
            [max]="state.duration || 100"
            (input)="seekTo($event)"
            (mousedown)="onProgressMouseDown()"
            (mouseup)="onProgressMouseUp()"
            title="Seek video"
          />
        </div>
        
        <!-- Control Buttons -->
        <div class="control-buttons">
          <!-- Play/Pause Control -->
          <button 
            mat-icon-button 
            class="control-btn play-pause-btn"
            (click)="togglePlayPause()"
            title="{{ state.isPlaying ? 'Pause' : 'Play' }}"
          >
            <mat-icon>{{ state.isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>
          </button>
          
          <!-- Position Control -->
          <button 
            mat-icon-button 
            class="control-btn"
            (click)="togglePositionMenu()"
            title="Change Position"
          >
            <mat-icon>open_with</mat-icon>
          </button>
          
          <!-- Size Toggle Control -->
          <button 
            mat-icon-button 
            class="control-btn"
            (click)="toggleSize()"
            title="Toggle Size ({{ state.pipSize === 'full' ? 'Switch to Half' : 'Switch to Full' }})"
          >
            <mat-icon>{{ state.pipSize === 'full' ? 'photo_size_select_large' : 'photo_size_select_small' }}</mat-icon>
          </button>
          
          <!-- Fullscreen Control -->
          <button 
            mat-icon-button 
            class="control-btn"
            (click)="enterFullscreen()"
            title="Enter Fullscreen"
          >
            <mat-icon>fullscreen</mat-icon>
          </button>
          
          <!-- Minimize Control -->
          <button 
            mat-icon-button 
            class="control-btn minimize-btn"
            (click)="minimizeVideo()"
            title="Minimize to floating button"
          >
            <mat-icon>minimize</mat-icon>
          </button>
          
          <!-- Close Button -->
          <button 
            mat-icon-button 
            class="control-btn close-btn"
            (click)="closeFloating()"
            title="Close Video"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Minimized Floating Button -->
    <button 
      class="minimized-floating-btn"
      *ngIf="state.isFloating && state.isMinimized && state.videoUrl"
      (click)="onMinimizedButtonClick($event)"
      (mousedown)="$event.stopPropagation()"
      title="Restore video"
      type="button"
    >
      <mat-icon>play_circle_filled</mat-icon>
    </button>
  `,
  styles: [`
    .floating-video-container {
      position: fixed !important;
      z-index: 9999 !important;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid rgba(255, 255, 255, 0.1);
      pointer-events: auto;
      min-width: 320px;
      max-width: calc(100vw - 40px);
      background: transparent;
      display: flex;
      flex-direction: column;
      gap: 0; /* No gap between video and controls */
    }

    .floating-video-container.minimized-hidden {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }

    .floating-video-container:hover {
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .floating-video-container.bottom-right {
      bottom: 20px;
      right: 20px;
    }

    .floating-video-container.bottom-left {
      bottom: 20px;
      left: 20px;
    }

    .floating-video-container.top-right {
      top: 20px;
      right: 20px;
    }

    .floating-video-container.top-left {
      top: 20px;
      left: 20px;
    }

    .floating-video-container.center {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .floating-video-container.size-half {
      width: 320px;
      max-width: calc(100vw - 40px);
    }

    .floating-video-container.size-full {
      width: 480px;
      max-width: calc(100vw - 40px);
    }

    .floating-video-content {
      position: relative;
      border-radius: 12px 12px 0 0;
      overflow: hidden;
      background: transparent;
      margin: 0;
      padding: 0;
      line-height: 0; /* Remove line-height spacing */
    }

    /* Hide the default Video.js controls since we have custom floating controls */
    .floating-video-content ::ng-deep .vjs-control-bar {
      display: none;
    }

    /* Ensure big play button and poster are hidden during playback */
    .floating-video-content ::ng-deep .vjs-big-play-button {
      display: none !important;
    }

    .floating-video-content ::ng-deep .vjs-poster {
      display: none !important;
      opacity: 0 !important;
    }

    /* Hide all potential white overlay elements */
    .floating-video-content ::ng-deep .vjs-loading-spinner {
      display: none !important;
    }

    .floating-video-content ::ng-deep .vjs-waiting .vjs-loading-spinner {
      display: none !important;
    }

    .floating-video-content ::ng-deep .vjs-text-track-display {
      display: none !important;
    }

    /* Force video to be visible and on top */
    .floating-video-content ::ng-deep .vjs-tech {
      opacity: 1 !important;
      visibility: visible !important;
      z-index: 1 !important;
      background: transparent !important;
    }

    /* Remove any background colors that might be causing white fill */
    .floating-video-content ::ng-deep .video-js {
      background-color: transparent !important;
      background: transparent !important;
    }

    .floating-video-content ::ng-deep .vjs-tech {
      background-color: transparent !important;
      background: transparent !important;
    }

    /* Force no spacing on video container */
    .floating-video-content ::ng-deep * {
      margin-bottom: 0 !important;
      margin-top: 0 !important;
    }

    .floating-video-content ::ng-deep .video-tutorial-container {
      margin: 0;
      padding: 0;
      border-radius: 12px 12px 0 0;
      box-shadow: none;
      background: transparent;
    }

    .floating-video-content ::ng-deep .video-wrapper {
      border-radius: 12px 12px 0 0;
      background: transparent;
      margin: 0;
      padding: 0;
    }

    .floating-video-content ::ng-deep .video-js {
      border-radius: 12px 12px 0 0;
      background: transparent;
      width: 100% !important;
      height: auto !important;
      margin: 0;
      padding: 0;
    }

    /* Override the min-height based on floating video size to eliminate gap */
    .floating-video-container.size-half ::ng-deep .video-wrapper .video-js {
      min-height: 180px !important;
    }

    .floating-video-container.size-full ::ng-deep .video-wrapper .video-js {
      min-height: 270px !important;
    }

    .floating-video-content ::ng-deep .vjs-tech {
      width: 100% !important;
      height: auto !important;
      object-fit: contain !important;
      margin: 0;
      padding: 0;
      display: block;
    }

    /* Remove any spacing from Video.js wrapper elements */
    .floating-video-content ::ng-deep .vjs-loading-spinner,
    .floating-video-content ::ng-deep .vjs-big-play-button,
    .floating-video-content ::ng-deep .vjs-poster {
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Ensure no bottom spacing on video elements */
    .floating-video-content ::ng-deep .video-js .vjs-tech {
      vertical-align: top;
    }

    .floating-video-content ::ng-deep .loading-indicator,
    .floating-video-content ::ng-deep .error-state,
    .floating-video-content ::ng-deep .pip-indicator {
      margin: 0 !important;
      padding: 8px !important;
    }

    .floating-controls-external {
      background: rgba(0, 0, 0, 0.9);
      border-radius: 0 0 12px 12px;
      padding: 12px;
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 0;
    }

    .floating-controls-external.always-visible {
      opacity: 1;
    }

    .floating-video-container:hover .floating-controls-external {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .control-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }

    .control-btn {
      width: 36px !important;
      height: 36px !important;
      color: white !important;
      background: rgba(255, 255, 255, 0.15) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      margin: 0 2px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 6px !important;
      padding: 0 !important;
    }

    .control-btn:hover {
      background: rgba(255, 255, 255, 0.25) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
      transform: scale(1.05);
    }

    .control-btn.play-pause-btn {
      background: rgba(59, 130, 246, 0.8) !important;
      border-color: rgba(59, 130, 246, 0.6) !important;
    }

    .control-btn.play-pause-btn:hover {
      background: rgba(59, 130, 246, 1) !important;
      border-color: rgba(59, 130, 246, 0.8) !important;
    }

    .control-btn.close-btn {
      background: rgba(244, 67, 54, 0.8) !important;
      border-color: rgba(244, 67, 54, 0.6) !important;
    }

    .control-btn.close-btn:hover {
      background: rgba(244, 67, 54, 1) !important;
      border-color: rgba(244, 67, 54, 0.8) !important;
    }

    .control-btn.minimize-btn {
      background: rgba(156, 39, 176, 0.8) !important;
      border-color: rgba(156, 39, 176, 0.6) !important;
    }

    .control-btn.minimize-btn:hover {
      background: rgba(156, 39, 176, 1) !important;
      border-color: rgba(156, 39, 176, 0.8) !important;
    }

    .control-btn.debug-btn {
      background: rgba(255, 193, 7, 0.8) !important;
      border-color: rgba(255, 193, 7, 0.6) !important;
    }

    .control-btn.debug-btn:hover {
      background: rgba(255, 193, 7, 1) !important;
      border-color: rgba(255, 193, 7, 0.8) !important;
    }

    .control-btn mat-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .dropdown-wrapper {
      position: relative;
    }

    .progress-container {
      width: 100%;
    }
    
    .progress-bar {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      outline: none;
      transition: opacity 0.2s;
      border: 2px solid white;
    }

    .progress-bar::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      background: #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid white;
    }

    .progress-bar::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid white;
    }

    .time-display {
      width: 100%;
      text-align: center;
      color: rgba(255, 255, 255, 0.9);
      font-size: 13px;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      pointer-events: none;
    }

    /* Position Overlay Styles */
    .position-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(8px);
      border-radius: 12px 12px 0 0;
      z-index: 10000;
      cursor: pointer;
    }

    .floating-video-content .position-overlay {
      bottom: auto;
      height: 100%;
    }

    .position-hint {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      pointer-events: none;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .position-btn {
      position: absolute;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .position-btn:hover {
      background: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.6);
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .position-btn.top-left {
      top: 12px;
      left: 12px;
    }

    .position-btn.top-right {
      top: 12px;
      right: 12px;
    }

    .position-btn.center {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(59, 130, 246, 0.3);
      border-color: rgba(59, 130, 246, 0.5);
    }

    .position-btn.center:hover {
      background: rgba(59, 130, 246, 0.5);
      border-color: rgba(59, 130, 246, 0.7);
      transform: translate(-50%, -50%) scale(1.1);
    }

    .position-btn.bottom-left {
      bottom: 12px;
      left: 12px;
    }

    .position-btn.bottom-right {
      bottom: 12px;
      right: 12px;
    }

    .position-btn mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    /* Minimized Floating Button */
    .minimized-floating-btn {
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 16px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10001 !important;
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: auto !important;
      user-select: none;
      /* Remove default button styling */
      outline: none;
      padding: 0;
      margin: 0;
      font-family: inherit;
      font-size: inherit;
      text-decoration: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }

    .minimized-floating-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-50%) scale(1.05);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }

    .minimized-floating-btn mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: rgba(59, 130, 246, 1) !important;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
  `]
})
export class FloatingVideoComponent implements OnInit, OnDestroy, AfterViewInit {
  private player: any;
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;
  @ViewChild(VideoTutorialComponent) videoTutorial!: VideoTutorialComponent;

  private destroy$ = new Subject<void>();
  public state: TutorialState = {} as TutorialState; // Initialize with a default shape
  public showPositionMenu = false;
  private videoConfig: any = null; // Cache the config to prevent reloading

  @HostBinding('class.hidden') isHidden = true;
  @HostBinding('class.minimized') get isMinimized() {
    return this.state.isMinimized;
  }
  
  // Expose service to the template
  public tutorialService = inject(VideoTutorialService);

  private stateSubscription!: Subscription;
  private resizeObserver!: ResizeObserver;
  private isSeeking = false;
  
  // Use a ReplaySubject to buffer the last state even before the view is initialized
  private lastState: TutorialState | null = null;
  private playerReady = false;

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.stateSubscription = this.tutorialService.state$.subscribe(state => {
      this.lastState = state; // Always store the latest state
      this.handleStateUpdate(state);
      this.cdr.detectChanges(); // Manually trigger change detection
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngAfterViewInit(): void {
    this.initializePlayer();
    
    // Set up a resize observer to detect container size changes
    this.resizeObserver = new ResizeObserver(() => {
      if (this.player) {
        const newWidth = this.videoPlayer.nativeElement.clientWidth;
        const newHeight = this.videoPlayer.nativeElement.clientHeight;
        this.player.dimensions(newWidth, newHeight);
      }
    });
    this.resizeObserver.observe(this.videoPlayer.nativeElement.parentElement);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    const floatingContainer = target.closest('.floating-video-container');
    
    // Only close dropdowns if click was outside the floating video container
    if (!floatingContainer) {
      this.closeDropdowns();
    }
  }

  closeDropdowns(): void {
    console.log('🔄 Closing dropdowns');
    this.showPositionMenu = false;
  }

  togglePositionMenu(): void {
    console.log('🎯 Position menu toggled');
    this.showPositionMenu = !this.showPositionMenu;
  }

  toggleSize(): void {
    console.log('📏 Size menu toggled');
    this.tutorialService.setFloatingSize(this.state.pipSize === 'full' ? 'half' : 'full');
    this.showPositionMenu = false; // Close other menu
  }

  getContainerClasses(): string {
    return `${this.state.pipPosition} size-${this.state.pipSize}`;
  }

  getContainerStyles(): any {
    // Additional dynamic styles if needed
    return {};
  }

  getVideoConfig() {
    // Create config only once to prevent video reloading
    if (!this.videoConfig || 
        this.videoConfig.id !== this.state.videoId || 
        this.videoConfig.url !== this.state.videoUrl) {
      
      console.log('🎬 Creating new video config');
      this.videoConfig = {
        id: this.state.videoId || 'floating_video',
        url: this.state.videoUrl || '',
        title: 'FlowAccount Tutorial',
        startTime: this.state.currentTime
      };
    } else {
      console.log('🎬 Reusing cached video config to prevent reload');
    }
    
    return this.videoConfig;
  }

  changePosition(position: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'center'): void {
    console.log('🎯 changePosition method called with:', position);
    this.tutorialService.setFloatingPosition(position);
    this.showPositionMenu = false;
  }

  enterFullscreen(): void {
    console.log('🔲 Entering fullscreen mode');
    const floatingPlayer = this.tutorialService.getFloatingPlayerInstance();
    
    if (floatingPlayer && floatingPlayer.tech_ && floatingPlayer.tech_.el_) {
      // Try to enter fullscreen on the video element
      const videoElement = floatingPlayer.tech_.el_;
      
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if ((videoElement as any).webkitRequestFullscreen) {
        (videoElement as any).webkitRequestFullscreen();
      } else if ((videoElement as any).mozRequestFullScreen) {
        (videoElement as any).mozRequestFullScreen();
      } else if ((videoElement as any).msRequestFullscreen) {
        (videoElement as any).msRequestFullscreen();
      } else {
        console.log('🔲 Fullscreen not supported on this browser');
      }
    } else {
      console.log('🔲 No video player found for fullscreen');
    }
  }

  closeFloating(): void {
    this.tutorialService.exitFloating();
    this.tutorialService.reset();
  }

  togglePlayPause(): void {
    console.log('🎮 togglePlayPause clicked, current state:', this.state.isPlaying);
    
    // Ensure we have a player connection
    if (!this.tutorialService.getFloatingPlayerInstance() && this.videoTutorial) {
      console.log('🎮 No floating player found, attempting to connect...');
      const player = (this.videoTutorial as any).player;
      if (player) {
        console.log('🎮 Found player in videoTutorial, storing it');
        this.tutorialService.setFloatingPlayerInstance(player);
      }
    }
    
    // Use service methods for consistent behavior
    console.log('🎮 Using service togglePlayPause method');
    this.tutorialService.togglePlayPause();
  }

  // Add a manual method to force connection (for debugging)
  forceConnectPlayer(): void {
    console.log('🔧 Forcing player connection...');
    const player = (this.videoTutorial as any).player;
    this.tutorialService.setFloatingPlayerInstance(player);
  }

  seekTo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const time = parseFloat(input.value);
    this.tutorialService.setFloatingCurrentTime(time);
  }

  onProgressMouseDown(): void {
    // Could be used to pause video while seeking
  }

  onProgressMouseUp(): void {
    // Could be used to resume video after seeking
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) {
      return '0:00';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  onMinimizedButtonClick(event: Event): void {
    console.log('🎬 MINIMIZED BUTTON CLICKED! Event:', event);
    event.stopPropagation();
    event.preventDefault();
    this.restoreVideo();
  }

  minimizeVideo(): void {
    console.log('🔄 Minimizing video');
    this.tutorialService.minimizeVideo();
  }

  restoreVideo(): void {
    console.log('🎬 Restoring video - click detected!');
    console.log('🎬 Current state before restore:', this.state);
    
    // Simply restore the state - let the service handle playback
    this.tutorialService.restoreVideo();
    
    console.log('🎬 Restore called, video should be visible again');
  }

  private initializePlayer(): void {
    if (this.player) {
      this.player.src(this.state.videoUrl);
    } else {
      const options = {
        autoplay: false, // Let the service control autoplay
        controls: false,
        fluid: true,
        aspectRatio: '16:9',
        sources: [{ src: this.state.videoUrl, type: 'video/mp4' }]
      };
      
      this.player = videojs(this.videoPlayer.nativeElement, options, () => {
        console.log('🎬 Player ready!');
        this.playerReady = true;

        // Register the player instance with the service as soon as it's ready
        this.tutorialService.setFloatingPlayerInstance(this.player);

        // Check the last received state now that the player is ready
        if (this.lastState && this.lastState.isPlaying && this.player.paused()) {
          console.log('▶️ Player was ready *after* play state was set. Playing now.');
          this.player.play().catch((e: any) => console.error('Autoplay failed on init:', e));
        }

        // Add event listeners
        this.player.on('timeupdate', () => {
          this.tutorialService.setFloatingCurrentTime(this.player.currentTime());
        });

        // Handle player errors
        this.player.on('error', (error: any) => {
          console.error('Failed to initialize player:', error);
        });
      });
    }
  }

  private handleStateUpdate(state: TutorialState): void {
    this.state = state;
    
    if (this.player && this.playerReady) {
      // Ensure playback state is always in sync
      if (state.isPlaying && this.player.paused()) {
        console.log('▶️ State is playing, but player is paused. Forcing play.');
        this.player.play().catch((e: any) => console.error('State sync play failed:', e));
      } else if (!state.isPlaying && !this.player.paused()) {
        console.log('⏸️ State is paused, but player is playing. Forcing pause.');
        this.player.pause();
      }
    }
    
    // This part handles the visibility of the component itself
    // We only want to show the component if it's in a floating state and has a video
    this.isHidden = !state.isFloating || !state.videoId;
  }
} 