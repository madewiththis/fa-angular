import { Component, inject } from '@angular/core';
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
export class MediaPlayerFabComponent {
  private readonly mediaPlayerService = inject(MediaPlayerService);
  public readonly state$: Observable<PlayerState> = this.mediaPlayerService.state$;
  
  fabState(state: PlayerState): 'hidden' | 'visible' {
    if (state.isMinimized) {
      return 'hidden';
    }
    return state.isHidden && !state.isFloating ? 'visible' : 'hidden';
  }

  restore(): void {
    this.mediaPlayerService.restore();
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
}