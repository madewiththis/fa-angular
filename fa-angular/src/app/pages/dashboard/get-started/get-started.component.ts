import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TutorialFabComponent } from '../../../components/tutorial/tutorial-fab/tutorial-fab.component';
import { VideoPlaceholderComponent } from '../../../components/tutorial/video-placeholder/video-placeholder.component';
import { VideoConfig, VideoTutorialService } from '../../../components/tutorial/services/video-tutorial.service';

@Component({
  selector: 'app-get-started',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TutorialFabComponent, VideoPlaceholderComponent],
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
        </div>
      </div>
    </div>
    
    <!-- Tutorial FAB for hidden videos -->
    <app-tutorial-fab></app-tutorial-fab>
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
  readonly tutorialService = inject(VideoTutorialService);

  testVideoConfig: VideoConfig = {
    id: 'test_tutorial',
    url: '/assets/tutorials/tutorial_quotation.mp4',
    title: 'FlowAccount Tutorial - Test Video',
    description: 'This is a test video to demonstrate the video tutorial system capabilities.',
    startTime: 0
  };
} 