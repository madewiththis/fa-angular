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
  
  constructor() {
    this.mediaPlayerService.state$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      this.state = state;
      
      if(this.state.seekTo !== null) {
        // We need to inform the service that the seek has been handled 
        // to avoid getting into a loop.
        // Use setTimeout to ensure the child component's ngOnChanges has time to fire.
        setTimeout(() => this.mediaPlayerService.seekHandled(), 0);
      }
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Methods called from template
  onTimeUpdate(time: number): void {
    this.mediaPlayerService.updateCurrentTime(time);
  }

  onDurationChange(duration: number): void {
    this.mediaPlayerService.updateDuration(duration);
  }

  onLoaded(): void {
    // anything to do here? maybe for future use
  }

  close(): void {
    this.mediaPlayerService.exitFloating();
  }

  minimize(): void {
    this.mediaPlayerService.minimizeVideo();
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
  
  get playerClasses(): Record<string, boolean> {
    return {
      'floating-player-container': true,
      [`position-${this.state.pipPosition}`]: !this.state.isFakeFullscreen,
      [`size-${this.state.pipSize}`]: !this.state.isFakeFullscreen,
      'fake-fullscreen': this.state.isFakeFullscreen
    };
  }
}