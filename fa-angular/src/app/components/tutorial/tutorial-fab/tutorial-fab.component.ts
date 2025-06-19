import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

import { VideoTutorialService, TutorialState } from '../services/video-tutorial.service';

@Component({
  selector: 'app-tutorial-fab',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './tutorial-fab.component.html',
  styleUrls: ['./tutorial-fab.component.scss']
})
export class TutorialFabComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly tutorialService = inject(VideoTutorialService);
  
  state: TutorialState = this.tutorialService.currentState;
  showFab = false;

  ngOnInit(): void {
    this.tutorialService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.state = state;
        
        // Show FAB when video is hidden and initialized
        const shouldShow = state.isHidden && state.isInitialized && state.videoId;
        
        if (shouldShow !== this.showFab) {
          // Add delay for smooth animation
          if (shouldShow) {
            setTimeout(() => {
              this.showFab = true;
            }, 300);
          } else {
            this.showFab = false;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  restoreVideo(): void {
    this.tutorialService.restore();
  }

  getPlaybackProgress(): number {
    if (this.state.duration === 0) return 0;
    return (this.state.currentTime / this.state.duration) * 100;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
} 