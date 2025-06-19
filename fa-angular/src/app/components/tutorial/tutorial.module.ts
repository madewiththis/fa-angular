import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { VideoTutorialService } from './services/video-tutorial.service';

// Re-export components for easier imports
export { VideoTutorialComponent } from './video-tutorial/video-tutorial.component';
export { TutorialFabComponent } from './tutorial-fab/tutorial-fab.component';
export { VideoPlaceholderComponent } from './video-placeholder/video-placeholder.component';
export { VideoTutorialService, type VideoConfig, type TutorialState } from './services/video-tutorial.service';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    VideoTutorialService
  ]
})
export class TutorialModule {
  static forRoot() {
    return {
      ngModule: TutorialModule,
      providers: [VideoTutorialService]
    };
  }
} 