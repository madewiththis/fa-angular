import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MediaPlayerService, PlayerState } from '../services/media-player.service';
import { VideoPlayerComponent } from '../video-player/video-player.component';

@Component({
  selector: 'app-floating-player',
  standalone: true,
  imports: [CommonModule, MatIconModule, VideoPlayerComponent],
  templateUrl: './floating-player.component.html',
  styleUrls: ['./floating-player.component.scss'],
  animations: [
    trigger('playerAnimation', [
      state('void', style({ transform: 'scale(0.8) translateY(20%)', opacity: 0 })),
      state('*', style({ transform: 'scale(1) translateY(0)', opacity: 1 })),
      transition('void => *', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('* => void', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ]),
    trigger('glassButtonAnimation', [
      state('void', style({ transform: 'scale(0.8) translateX(20%)', opacity: 0 })),
      state('*', style({ transform: 'scale(1) translateX(0)', opacity: 1 })),
      transition('void => *', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('* => void', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ])
  ]
})
export class FloatingPlayerComponent implements OnInit, OnDestroy {
  @ViewChild(VideoPlayerComponent) videoPlayer!: VideoPlayerComponent;
  @ViewChild('playerContainer') playerContainer!: ElementRef<HTMLDivElement>;

  private readonly destroy$ = new Subject<void>();
  public readonly mediaPlayerService = inject(MediaPlayerService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  state!: PlayerState;
  showPositionSelector = false;
  isHovering = false;
  showVolumeSlider = false;
  readonly Math = Math;
  private previousVolume = 1; // Store volume before muting
  private volumeHideTimeout: any;
  
  constructor() {
    this.mediaPlayerService.state$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      this.state = state;
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.volumeHideTimeout) {
      clearTimeout(this.volumeHideTimeout);
    }
  }
  
  onMouseLeavePlayer(): void {
    this.isHovering = false;
    if (this.showPositionSelector) {
      this.togglePositionSelector(false);
    }
  }

  onMouseEnterPlayer(): void {
    this.isHovering = true;
  }

  // Methods called from template
  onTimeUpdate(time: number): void {
    this.mediaPlayerService.updateCurrentTime(time);
  }

  onDurationChange(duration: number): void {
    this.mediaPlayerService.updateDuration(duration);
  }

  onSeeked(): void {
    if (this.state.seekTo !== null) {
      this.mediaPlayerService.seekHandled();
    }
  }

  onLoaded(): void {
    // anything to do here? maybe for future use
  }

  close(): void {
    this.mediaPlayerService.exitFloating();
  }

  minimize(): void {
    const currentTime = this.videoPlayer?.getCurrentTime() || this.state.currentTime;
    this.mediaPlayerService.minimizeVideo(currentTime);
  }

  restore(): void {
    this.mediaPlayerService.restoreVideo();
  }

  togglePositionSelector(show?: boolean): void {
    this.showPositionSelector = show !== undefined ? show : !this.showPositionSelector;
  }
  
  toggleFullscreen(): void {
    this.mediaPlayerService.toggleFakeFullscreen();
  }

  toggleSize(): void {
    const newSize = this.state.pipSize === 'full' ? 'half' : 'full';
    this.mediaPlayerService.setFloatingSize(newSize);
  }

  setPosition(position: PlayerState['pipPosition']): void {
    this.mediaPlayerService.setFloatingPosition(position);
    this.togglePositionSelector(false);
  }

  onProgressBarClick(event: MouseEvent): void {
    if (!this.state.duration) return;

    const progressBar = event.currentTarget as HTMLDivElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const fraction = Math.max(0, Math.min(1, clickX / width));
    const newTime = this.state.duration * fraction;

    this.mediaPlayerService.seekTo(newTime);
  }
  
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  get progressPercent(): number {
    if (!this.state.duration) return 0;
    return (this.state.currentTime / this.state.duration) * 100;
  }
  
  // Volume control methods
  showVolumeControl(): void {
    if (this.volumeHideTimeout) {
      clearTimeout(this.volumeHideTimeout);
      this.volumeHideTimeout = null;
    }
    this.showVolumeSlider = true;
  }

  hideVolumeControl(): void {
    // Add a delay before hiding to allow mouse movement to slider
    this.volumeHideTimeout = setTimeout(() => {
      this.showVolumeSlider = false;
    }, 300); // 300ms delay
  }

  toggleMute(): void {
    if (this.state.volume > 0) {
      // Currently has volume, so mute it
      this.previousVolume = this.state.volume;
      this.mediaPlayerService.setVolume(0);
    } else {
      // Currently muted, so restore previous volume
      this.mediaPlayerService.setVolume(this.previousVolume);
    }
  }

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const volume = parseFloat(target.value);
    this.mediaPlayerService.setVolume(volume);
    
    // Update previousVolume if volume is not 0 (so we can restore it later)
    if (volume > 0) {
      this.previousVolume = volume;
    }
  }

  getVolumeIcon(volume: number): string {
    if (volume === 0) {
      return 'volume_off';
    } else if (volume < 0.5) {
      return 'volume_down';
    } else {
      return 'volume_up';
    }
  }

  get playerClasses(): Record<string, boolean> {
    return {
      'floating-player-container': true,
      [`position-${this.state.pipPosition}`]: !this.state.isFakeFullscreen,
      [`size-${this.state.pipSize}`]: !this.state.isFakeFullscreen,
      'fake-fullscreen': this.state.isFakeFullscreen
    };
  }
}