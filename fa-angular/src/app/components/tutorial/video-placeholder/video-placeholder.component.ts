import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VideoTutorialService, VideoConfig } from '../services/video-tutorial.service';

@Component({
  selector: 'app-video-placeholder',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="video-placeholder" (click)="openFloatingVideo()">
      <div class="placeholder-content">
        <div class="thumbnail" [style.background-image]="'url(' + thumbnailUrl + ')'">
          <div class="play-overlay">
            <div class="launch-button">
              <mat-icon>play_circle_outline</mat-icon>
              <span>Launch Video</span>
            </div>
          </div>
        </div>
        <div class="video-info" *ngIf="title || description">
          <h3 class="video-title" *ngIf="title">{{ title }}</h3>
          <p class="video-description" *ngIf="description">{{ description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .video-placeholder {
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f8f9fa;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .video-placeholder:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .placeholder-content {
      position: relative;
    }

    .thumbnail {
      width: 100%;
      height: 200px;
      background-size: cover;
      background-position: center;
      background-color: #e9ecef;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .video-placeholder:hover .play-overlay {
      background: rgba(0, 0, 0, 0.6);
    }

    .launch-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50px;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .video-placeholder:hover .launch-button {
      background: rgba(255, 255, 255, 1);
      transform: scale(1.05);
    }

    .launch-button mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #333;
      margin-right: 8px;
    }

    .launch-button span {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .video-info {
      padding: 16px;
    }

    .video-title {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      line-height: 1.4;
    }

    .video-description {
      margin: 0;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .thumbnail {
        height: 150px;
      }

      .launch-button {
        padding: 8px 16px;
      }

      .launch-button mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      
      .launch-button span {
        font-size: 16px;
      }

      .video-info {
        padding: 12px;
      }

      .video-title {
        font-size: 16px;
      }

      .video-description {
        font-size: 13px;
      }
    }
  `]
})
export class VideoPlaceholderComponent {
  @Input() videoId!: string;
  @Input() videoUrl!: string;
  @Input() title?: string;
  @Input() description?: string;
  @Input() thumbnailUrl?: string;
  @Input() startTime?: number;

  private tutorialService = inject(VideoTutorialService);

  openFloatingVideo(): void {
    console.log('🎬 Opening floating video:', this.videoId);
    
    const config: VideoConfig = {
      id: this.videoId,
      url: this.videoUrl,
      title: this.title || 'Video Tutorial',
      description: this.description,
      startTime: this.startTime || 0
    };

    // Use the new, reliable launch method
    this.tutorialService.launchFloatingVideo(config);
  }
} 