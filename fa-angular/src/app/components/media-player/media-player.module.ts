import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MediaPlayerService } from './services/media-player.service';
import { FloatingPlayerComponent } from './floating-player/floating-player.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { MediaPlayerFabComponent } from './fab/media-player-fab.component';
import { VideoPlaceholderComponent } from './video-placeholder/video-placeholder.component';
import { FixedPlayerComponent } from './fixed-player/fixed-player.component';
import { MediaPlayerExampleComponent } from './example/media-player-example.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    FloatingPlayerComponent,
    VideoPlayerComponent,
    MediaPlayerFabComponent,
    VideoPlaceholderComponent,
    FixedPlayerComponent,
    MediaPlayerExampleComponent,
  ],
  exports: [
    FloatingPlayerComponent,
    VideoPlayerComponent,
    MediaPlayerFabComponent,
    VideoPlaceholderComponent,
    FixedPlayerComponent,
    MediaPlayerExampleComponent,
  ],
  providers: [MediaPlayerService],
})
export class MediaPlayerModule {} 