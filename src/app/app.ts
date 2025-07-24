import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FloatingPlayerComponent } from './components/media-player/floating-player/floating-player.component';
import { FeatureFlagService } from './services/feature-flag.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FloatingPlayerComponent],
  template: `
    <div class="app-layout">
      <router-outlet />
    </div>
    <!-- Floating video completely outside normal document flow -->
    <app-floating-player style="position: absolute; top: 0; left: 0; width: 0; height: 0; pointer-events: none;"></app-floating-player>
  `,
  styleUrls: ['./app.scss'],
})
export class AppComponent {
  title = 'FlowAccount X';
  
  // Inject FeatureFlagService to ensure it's available globally
  private featureFlagService = inject(FeatureFlagService);
  
  constructor() {
    console.log('🏁 App started with Feature Flag Service available globally');
  }
}
