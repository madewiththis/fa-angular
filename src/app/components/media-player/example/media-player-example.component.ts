import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaPlayerService, MediaConfig } from '../services/media-player.service';
import { FloatingPlayerComponent } from '../floating-player/floating-player.component';
import { FixedPlayerComponent } from '../fixed-player/fixed-player.component';

@Component({
  selector: 'app-media-player-example',
  standalone: true,
  imports: [CommonModule, FloatingPlayerComponent, FixedPlayerComponent],
  template: `
    <div class="example-container">
      <h1>Media Player Example</h1>
      
      <div class="controls">
        <button (click)="launchFloatingPlayer()" class="launch-btn">
          Launch Floating Player
        </button>
        <button (click)="launchFixedPlayer()" class="launch-btn">
          Launch Fixed Player
        </button>
      </div>

      <div class="content">
        <h2>Fixed Player (In-place)</h2>
        <p>This player fits within the content and doesn't have size, position, or minimize controls:</p>
        
        <div class="fixed-player-wrapper">
          <app-fixed-player></app-fixed-player>
        </div>

        <p>Content continues here after the fixed player...</p>
      </div>

      <!-- Floating player will appear as overlay -->
      <app-floating-player></app-floating-player>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .launch-btn {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #0056b3;
      }
    }

    .content {
      line-height: 1.6;
    }

    .fixed-player-wrapper {
      width: 100%;
      height: 400px;
      margin: 20px 0;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
  `]
})
export class MediaPlayerExampleComponent {
  constructor(private mediaPlayerService: MediaPlayerService) {}

  launchFloatingPlayer(): void {
    const config: MediaConfig = {
      id: 'floating-demo',
      url: '/assets/tutorials/tutorial_quotation.mp4',
      title: 'Floating Player Demo',
      description: 'This is a floating player with full controls',
      mode: 'floating'
    };
    
    this.mediaPlayerService.launchFloatingPlayer(config);
  }

  launchFixedPlayer(): void {
    const config: MediaConfig = {
      id: 'fixed-demo',
      url: '/assets/tutorials/tutorial_quotation.mp4',
      title: 'Fixed Player Demo',
      description: 'This is a fixed player with limited controls',
      mode: 'fixed'
    };
    
    this.mediaPlayerService.launchFixedPlayer(config);
  }
} 