import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MediaPlayerService, MediaConfig } from '../services/media-player.service';

@Component({
  selector: 'app-video-placeholder',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './video-placeholder.component.html',
  styleUrls: ['./video-placeholder.component.scss']
})
export class VideoPlaceholderComponent {
  @Input({ required: true }) videoId!: string;
  @Input({ required: true }) videoUrl!: string;
  @Input() title?: string;
  @Input() description?: string;
  @Input() thumbnailUrl?: string;
  
  private readonly mediaPlayerService = inject(MediaPlayerService);

  playVideo(): void {
    this.mediaPlayerService.launchFloatingPlayer({
      id: this.videoId,
      url: this.videoUrl,
      title: this.title,
      description: this.description
    });
  }
} 