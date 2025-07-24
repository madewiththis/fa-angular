import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil, Observable } from 'rxjs';
import { MediaPlayerService, PlayerState } from '../services/media-player.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-media-player-fab',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './media-player-fab.component.html',
  styleUrls: ['./media-player-fab.component.scss'],
  animations: [
    trigger('fabAnimation', [
      state('hidden', style({
        transform: 'scale(0.8) translateX(100%)',
        opacity: 0,
        pointerEvents: 'none'
      })),
      state('visible', style({
        transform: 'scale(1) translateX(0)',
        opacity: 1
      })),
      transition('hidden <=> visible', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class MediaPlayerFabComponent implements OnInit {
  private readonly mediaPlayerService = inject(MediaPlayerService);
  public readonly state$: Observable<PlayerState> = this.mediaPlayerService.state$;
  
  // Volume control properties
  public showVolumeSlider = false;
  public readonly Math = Math; // Expose Math object to template
  
  ngOnInit() {
    // Component initialized
  }
  
  fabState(state: PlayerState): 'hidden' | 'visible' {
    // Temporarily show FAB when there's any video loaded for testing volume control
    if (state.videoId && state.isInitialized) {
      return 'visible';
    }
    
    if (state.isMinimized) {
      return 'hidden';
    }
    return state.isHidden && !state.isFloating ? 'visible' : 'hidden';
  }

  restore(): void {
    this.mediaPlayerService.restore();
  }

  minimize(event: MouseEvent): void {
    event.stopPropagation();
    this.mediaPlayerService.minimizeVideo(this.mediaPlayerService.currentState.currentTime);
  }

  close(event: MouseEvent): void {
    event.stopPropagation();
    this.mediaPlayerService.exitFloating();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Volume control methods
  toggleVolumeSlider(event: MouseEvent): void {
    event.stopPropagation();
    this.showVolumeSlider = !this.showVolumeSlider;
  }

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const volume = parseFloat(target.value);
    this.mediaPlayerService.setVolume(volume);
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
}