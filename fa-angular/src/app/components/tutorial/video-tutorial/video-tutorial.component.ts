import { 
  Component, 
  ViewChild, 
  ElementRef, 
  OnInit, 
  OnDestroy, 
  OnChanges,
  Input,
  HostListener,
  Renderer2,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';

import videojs from 'video.js';

import { VideoTutorialService, VideoConfig, TutorialState } from '../services/video-tutorial.service';

@Component({
  selector: 'app-video-tutorial',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './video-tutorial.component.html',
  styleUrls: ['./video-tutorial.component.scss']
})
export class VideoTutorialComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  
  @Input() config: VideoConfig | null = null;
  @Input() autoplay = false;
  @Input() showControls = true;
  @Input() inline = false;

  private player: any = null;
  private destroy$ = new Subject<void>();
  private lastFocusedElement: HTMLElement | null = null;
  
  private readonly tutorialService = inject(VideoTutorialService);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  
  state: TutorialState = this.tutorialService.currentState;

  ngOnInit(): void {
    this.subscribeToState();
    this.subscribeToNavigation();
    
    // Check if there's a floating player instance from navigation
    const existingFloatingPlayer = this.tutorialService.getFloatingPlayerInstance();
    if (existingFloatingPlayer && this.state.isFloating) {
      this.player = existingFloatingPlayer;
    } else if (this.config && this.autoplay) {
      // Only auto-initialize if autoplay is true and no existing PiP player
      setTimeout(() => {
        this.initializePlayer();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Only dispose player if not in floating mode to preserve playback during navigation
    if (!this.state.isFloating) {
      this.disposePlayer();
    }
  }

  private subscribeToState(): void {
    this.tutorialService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.state = state;
        
        if (state.videoUrl && !this.player) {
          this.initializePlayer();
        }
      });
  }

  private subscribeToNavigation(): void {
    // Handle navigation to provide video with a home
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        // If video is playing and user navigates away from its home, enter floating mode
        if (this.player && this.state.isPlaying && this.config && !this.state.isFloating) {
          const hasHome = this.tutorialService.hasHome();
          
          if (!hasHome) {
            // User navigated away from video home, enter floating mode
            this.enterFloatingMode();
          }
        }
      });
  }

  ngOnChanges(): void {
    // When config changes and autoplay is true, initialize the player
    if (this.config && this.autoplay && !this.player) {
      setTimeout(() => {
        this.initializePlayer();
      }, 100);
    }
  }

  private initializePlayer(): void {
    if (!this.config && !this.state.videoUrl) return;
    
    const videoUrl = this.config?.url || this.state.videoUrl;
    const startTime = this.config?.startTime || this.state.currentTime;

    if (!videoUrl) return;

    // Initialize Video.js player
    this.player = videojs(this.videoElement.nativeElement, {
      controls: this.showControls,
      fluid: !this.inline, // Use fluid only when not inline
      responsive: !this.inline, // Use responsive only when not inline
      width: this.inline ? '100%' : undefined,
      height: this.inline ? '100%' : undefined,
      aspectRatio: this.inline ? '16:9' : undefined,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      poster: '', // Add poster image if available
      autoplay: this.autoplay, // Enable autoplay when requested
      sources: [{
        src: videoUrl,
        type: this.getVideoType(videoUrl)
      }],
      controlBar: {
        pictureInPictureToggle: false, // Disable native PiP
        playToggle: true,
        volumePanel: {
          inline: false
        },
        currentTimeDisplay: true,
        timeDivider: true,
        durationDisplay: true,
        progressControl: true,
        fullscreenToggle: true
      },
      plugins: {},
      html5: {
        vhs: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true
        }
      }
    });

    this.setupPlayerEvents();
    this.setupKeyboardShortcuts();

    // Set initial time if provided
    if (startTime > 0) {
      this.player.ready(() => {
        this.player.currentTime(startTime);
      });
    }



    // Initialize service with config if provided
    if (this.config) {
      this.tutorialService.initializeVideo(this.config);
    }
  }

  private setupPlayerEvents(): void {
    if (!this.player) return;

    // Play/Pause events
    this.player.on('play', () => {
      this.tutorialService.setPlaying(true);
    });

    this.player.on('pause', () => {
      this.tutorialService.setPlaying(false);
    });

    // Time update
    this.player.on('timeupdate', () => {
      this.tutorialService.updateCurrentTime(this.player.currentTime());
    });

    // Duration change
    this.player.on('durationchange', () => {
      this.tutorialService.updateDuration(this.player.duration());
    });

    // Volume change
    this.player.on('volumechange', () => {
      this.tutorialService.setVolume(this.player.volume());
    });

    // Note: Native PiP disabled, using custom floating mode instead



    // Error handling
    this.player.on('error', (error: any) => {
      console.error('Video.js error:', error);
      console.error('Video source:', this.player.src());
      console.error('Video element:', this.videoElement.nativeElement);
    });

    // Ready event
    this.player.ready(() => {
      console.log('Video.js player is ready');
      console.log('Video source:', this.player.src());
      console.log('Video duration:', this.player.duration());
    });

    // Load start event
    this.player.on('loadstart', () => {
      console.log('Video load started');
    });

    // Can play event
    this.player.on('canplay', () => {
      console.log('Video can play');
    });
  }



  private setupKeyboardShortcuts(): void {
    // Note: Video.js handles most shortcuts automatically (space, k, arrow keys)
    // We're adding custom shortcuts for hide and PiP
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if (!this.player || this.state.isHidden) return;

    // Only handle shortcuts when video player is focused or visible
    const activeElement = document.activeElement;
    const isVideoFocused = this.videoElement.nativeElement.contains(activeElement as Node) ||
                          activeElement === this.videoElement.nativeElement;

    if (!isVideoFocused && !this.state.isPiP) return;

    switch (event.key.toLowerCase()) {
      case 'h':
        event.preventDefault();
        this.hideVideo();
        break;
      
      case 'p':
        event.preventDefault();
        this.togglePictureInPicture();
        break;
      
      case 'escape':
        if (this.state.isFloating) {
          event.preventDefault();
          this.tutorialService.exitFloating();
        }
        break;
    }
  }

  private hideVideo(): void {
    if (this.player && !this.state.isHidden) {
      // Store current focused element
      this.lastFocusedElement = document.activeElement as HTMLElement;
      
      this.tutorialService.hide();
    }
  }

  restoreVideo(): void {
    if (this.state.isHidden) {
      this.tutorialService.restore();
      
      // Restore focus after a brief delay
      setTimeout(() => {
        if (this.lastFocusedElement) {
          this.lastFocusedElement.focus();
        }
      }, 100);
    }
  }

  private togglePictureInPicture(): void {
    // Use custom floating mode instead of native PiP
    if (this.state.isFloating) {
      this.tutorialService.exitFloating();
    } else {
      this.enterFloatingMode();
    }
  }

  private enterFloatingMode(): void {
    // Store current video state and enter floating mode
    if (this.player && this.config) {
      console.log('🎬 Entering floating mode with player:', !!this.player);
      this.tutorialService.initializeVideo(this.config);
      this.tutorialService.enterFloating();
      this.tutorialService.setFloatingPlayerInstance(this.player);
      console.log('🎬 Floating player instance stored');
    } else {
      console.log('🎬 Cannot enter floating mode - missing player or config');
    }
  }

  private enterPictureInPicture(): void {
    if (this.player && this.player.tech_ && this.player.tech_.el_) {
      // Store current focused element before entering PiP
      this.lastFocusedElement = document.activeElement as HTMLElement;
      
      this.player.tech_.el_.requestPictureInPicture()
        .then(() => {
          // Constrain PiP window to viewport
          this.constrainPiPToViewport();
        })
        .catch((error: any) => {
          console.error('Failed to enter Picture-in-Picture:', error);
        });
    }
  }

  private constrainPiPToViewport(): void {
    // Monitor PiP window position and ensure it stays within viewport
    if (document.pictureInPictureElement) {
      const video = document.pictureInPictureElement as HTMLVideoElement;
      
      // Listen for resize events to maintain viewport constraints
      const handlePiPResize = () => {
        if (document.pictureInPictureElement) {
          // PiP window dimensions are controlled by the browser
          // We can't directly position it, but we can ensure proper aspect ratio
          const aspectRatio = video.videoWidth / video.videoHeight;
          const maxWidth = Math.min(400, window.innerWidth * 0.3);
          const maxHeight = maxWidth / aspectRatio;
          
          // The browser will handle positioning within viewport bounds
          console.log(`PiP constraints: ${maxWidth}x${maxHeight}`);
        }
      };

      video.addEventListener('resize', handlePiPResize);
      
      // Clean up listener when PiP ends
      video.addEventListener('leavepictureinpicture', () => {
        video.removeEventListener('resize', handlePiPResize);
      }, { once: true });
    }
  }

  private exitPictureInPicture(): void {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture()
        .catch((error: any) => {
          console.error('Failed to exit Picture-in-Picture:', error);
        });
    }
  }

  private setupPiPControls(): void {
    // Set up Media Session API for PiP controls
    if ('mediaSession' in navigator && this.player) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.config?.title || 'FlowAccount Tutorial',
        artist: 'FlowAccount',
        album: 'Video Tutorials',
        artwork: [
          { src: '/assets/fa_logo_full.png', sizes: '96x96', type: 'image/png' },
          { src: '/assets/fa_logo_full.png', sizes: '128x128', type: 'image/png' },
          { src: '/assets/fa_logo_full.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/fa_logo_full.png', sizes: '256x256', type: 'image/png' },
        ]
      });

      // Set up action handlers for PiP controls
      navigator.mediaSession.setActionHandler('play', () => {
        if (this.player) {
          this.player.play();
        }
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        if (this.player) {
          this.player.pause();
        }
      });

      navigator.mediaSession.setActionHandler('seekbackward', () => {
        if (this.player) {
          this.player.currentTime(Math.max(0, this.player.currentTime() - 10));
        }
      });

      navigator.mediaSession.setActionHandler('seekforward', () => {
        if (this.player) {
          this.player.currentTime(Math.min(this.player.duration(), this.player.currentTime() + 10));
        }
      });

      navigator.mediaSession.setActionHandler('stop', () => {
        if (this.player) {
          this.player.pause();
          this.exitPictureInPicture();
        }
      });

      // Update position state for scrubbing
      const updatePositionState = () => {
        if (this.player && navigator.mediaSession) {
          navigator.mediaSession.setPositionState({
            duration: this.player.duration() || 0,
            playbackRate: this.player.playbackRate() || 1,
            position: this.player.currentTime() || 0
          });
        }
      };

      // Update position state periodically
      this.player.on('timeupdate', updatePositionState);
      this.player.on('durationchange', updatePositionState);
      this.player.on('ratechange', updatePositionState);
    }

    // Add custom PiP controls overlay
    this.addCustomPiPControls();
  }

  private addCustomPiPControls(): void {
    // Since PiP runs in its own window context, we need to use the Media Session API
    // and enhance keyboard shortcuts for better control
    if (!document.pictureInPictureElement || !this.player) return;

    // Enhanced keyboard controls for PiP
    this.setupPiPKeyboardControls();

    // Show a notification in the main window that explains PiP controls
    this.showPiPControlsNotification();
  }

  private setupPiPKeyboardControls(): void {
    // Enhanced keyboard controls that work in PiP mode
    const handlePiPKeyboard = (event: KeyboardEvent) => {
      if (!this.state.isPiP || !this.player) return;

      switch (event.key.toLowerCase()) {
        case ' ':
        case 'k':
          event.preventDefault();
          if (this.player.paused()) {
            this.player.play();
          } else {
            this.player.pause();
          }
          break;
        
        case '1':
          event.preventDefault();
          this.requestPiPResize(320, 180);
          break;
          
        case '2':
          event.preventDefault();
          this.requestPiPResize(640, 360);
          break;
          
        case 'f':
          event.preventDefault();
          this.requestPiPResize(800, 450);
          break;
          
        case 'escape':
        case 'q':
          event.preventDefault();
          this.exitPictureInPicture();
          break;
      }
    };

    document.addEventListener('keydown', handlePiPKeyboard);
    
    // Store for cleanup
    (document as any)._pipKeyboardHandler = handlePiPKeyboard;
  }

  private showPiPControlsNotification(): void {
    // Create a notification overlay in the main window
    const notification = document.createElement('div');
    notification.className = 'pip-controls-notification';
    notification.innerHTML = `
      <div class="pip-notification-content">
        <div class="pip-notification-header">
          <span class="pip-notification-icon">🎬</span>
          <h3>Video in Picture-in-Picture</h3>
          <button class="pip-close-notification" aria-label="Close notification">✕</button>
        </div>
        <div class="pip-controls-info">
          <div class="pip-control-item">
            <kbd>Space</kbd> or <kbd>K</kbd> - Play/Pause
          </div>
          <div class="pip-control-item">
            <kbd>1</kbd> - Small size (320px)
          </div>
          <div class="pip-control-item">
            <kbd>2</kbd> - Large size (640px)
          </div>
          <div class="pip-control-item">
            <kbd>F</kbd> - Full size (800px)
          </div>
          <div class="pip-control-item">
            <kbd>Esc</kbd> or <kbd>Q</kbd> - Exit PiP
          </div>
        </div>
      </div>
    `;

    // Style the notification
    const style = document.createElement('style');
    style.textContent = `
      .pip-controls-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 300px;
        animation: slideInFromRight 0.3s ease-out;
      }
      
      .pip-notification-content {
        padding: 16px;
      }
      
      .pip-notification-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .pip-notification-icon {
        font-size: 20px;
      }
      
      .pip-notification-header h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
        flex: 1;
      }
      
      .pip-close-notification {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #64748b;
        padding: 4px;
        border-radius: 4px;
      }
      
      .pip-close-notification:hover {
        background: #f1f5f9;
        color: #1e293b;
      }
      
      .pip-controls-info {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      
      .pip-control-item {
        font-size: 12px;
        color: #475569;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .pip-control-item kbd {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: 600;
        color: #334155;
        min-width: 24px;
        text-align: center;
      }
      
      @keyframes slideInFromRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 480px) {
        .pip-controls-notification {
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.pip-close-notification');
    closeBtn?.addEventListener('click', () => {
      notification.remove();
      style.remove();
    });

    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideInFromRight 0.3s ease-out reverse';
        setTimeout(() => {
          notification.remove();
          style.remove();
        }, 300);
      }
    }, 8000);

    // Store references for cleanup
    (document as any)._pipNotification = notification;
    (document as any)._pipNotificationStyle = style;
  }

  private requestPiPResize(width: number, height: number): void {
    // While we can't directly resize the PiP window in most browsers,
    // we can use the Media Session API to provide hints
    if ('mediaSession' in navigator) {
      // Update metadata with size information
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${this.config?.title || 'FlowAccount Tutorial'} (${width}x${height})`,
        artist: 'FlowAccount',
        album: 'Video Tutorials',
        artwork: [
          { src: '/assets/fa_logo_full.png', sizes: '96x96', type: 'image/png' },
        ]
      });

      // Show a brief indication of the requested size
      this.showSizeChangeIndicator(width, height);
    }
  }

  private showSizeChangeIndicator(width: number, height: number): void {
    // Create a temporary indicator
    const indicator = document.createElement('div');
    indicator.textContent = `PiP Size: ${width}x${height}`;
    indicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10001;
      pointer-events: none;
    `;

    document.body.appendChild(indicator);

    // Remove after 2 seconds
    setTimeout(() => {
      indicator.remove();
    }, 2000);
  }



  private removePiPControls(): void {
    // Clean up Media Session API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('stop', null);
    }

    // Clean up keyboard handler
    const keyboardHandler = (document as any)._pipKeyboardHandler;
    if (keyboardHandler) {
      document.removeEventListener('keydown', keyboardHandler);
      (document as any)._pipKeyboardHandler = null;
    }

    // Clean up notification
    const notification = (document as any)._pipNotification;
    const notificationStyle = (document as any)._pipNotificationStyle;
    if (notification) {
      notification.remove();
      (document as any)._pipNotification = null;
    }
    if (notificationStyle) {
      notificationStyle.remove();
      (document as any)._pipNotificationStyle = null;
    }
  }

  private getVideoType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'mp4':
        return 'video/mp4';
      case 'webm':
        return 'video/webm';
      case 'ogg':
        return 'video/ogg';
      case 'm3u8':
        return 'application/x-mpegURL';
      default:
        return 'video/mp4';
    }
  }

  private disposePlayer(): void {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }

  // Public methods for external control
  play(): void {
    if (this.player && !this.state.isHidden) {
      this.player.play();
    }
  }

  pause(): void {
    if (this.player) {
      this.player.pause();
    }
  }

  seekTo(time: number): void {
    if (this.player) {
      this.player.currentTime(time);
    }
  }

  setVolume(volume: number): void {
    if (this.player) {
      this.player.volume(volume);
    }
  }
} 