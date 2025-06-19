import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FloatingVideoComponent } from './components/tutorial/floating-video/floating-video.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FloatingVideoComponent],
  template: `
    <div class="app-layout">
      <router-outlet />
    </div>
    <!-- Floating video completely outside normal document flow -->
    <app-floating-video style="position: absolute; top: 0; left: 0; width: 0; height: 0; pointer-events: none;"></app-floating-video>
  `,
  styleUrls: ['./app.scss'],
})
export class AppComponent {
  title = 'FlowAccount X';
}
