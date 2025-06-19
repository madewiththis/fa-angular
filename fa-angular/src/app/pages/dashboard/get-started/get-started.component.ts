import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MediaPlayerFabComponent } from '../../../components/media-player/fab/media-player-fab.component';
import { VideoPlaceholderComponent } from '../../../components/media-player/video-placeholder/video-placeholder.component';
import { MediaConfig, MediaPlayerService } from '../../../components/media-player/services/media-player.service';

@Component({
  selector: 'app-get-started',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MediaPlayerFabComponent, VideoPlaceholderComponent],
  template: `
    <div class="get-started-container">
      <!-- Video Tutorial Section -->
      <div class="video-section">
        <h2>🎥 Video Tutorial</h2>
        <p>Click below to launch the tutorial video.</p>
        
        <div class="video-container">
          <app-video-placeholder
            [videoId]="testVideoConfig.id"
            [videoUrl]="testVideoConfig.url"
            [title]="testVideoConfig.title"
            [description]="testVideoConfig.description"
          ></app-video-placeholder>

          <app-video-placeholder
            [videoId]="youtubeVideoConfig.id"
            [videoUrl]="youtubeVideoConfig.url"
            [title]="youtubeVideoConfig.title"
            [description]="youtubeVideoConfig.description"
          ></app-video-placeholder>
        </div>
      </div>
    </div>
    
    <!-- Tutorial FAB for hidden videos -->
    <app-media-player-fab></app-media-player-fab>
  `,
  styles: [
    `
      .get-started-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 48px 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .video-section {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 48px;
        text-align: center;
        width: 100%;
        max-width: 800px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }

      .video-section h2 {
        margin: 0 0 8px;
        color: #1e293b;
        font-size: 2rem;
        font-weight: 700;
      }

      .video-section > p {
        margin: 0 0 32px;
        color: #64748b;
        font-size: 1.125rem;
      }

      .video-container {
        max-width: 600px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      @media (max-width: 768px) {
        .get-started-container, .video-section {
          padding: 24px;
        }
        .video-section h2 {
          font-size: 1.75rem;
        }
      }
    `,
  ],
})
export class GetStartedComponent {
  readonly mediaPlayerService = inject(MediaPlayerService);

  testVideoConfig: MediaConfig = {
    id: 'test_tutorial',
    url: '/assets/tutorials/tutorial_quotation.mp4',
    title: 'FlowAccount Tutorial - Test Video',
    description: 'This is a test video to demonstrate the video tutorial system capabilities.',
    startTime: 0
  };

  youtubeVideoConfig: MediaConfig = {
    id: 'youtube_test',
    url: 'https://www.youtube.com/watch?v=LiYV9XKnvjk',
    title: 'Learn more about the DAC event',
    description: 'Learn more about the DAC event from this youtube video.',
    startTime: 0
  };
} 