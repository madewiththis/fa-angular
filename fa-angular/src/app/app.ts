import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-layout">
      <router-outlet />
    </div>
  `,
  styleUrls: ['./app.scss'],
})
export class AppComponent {
  title = 'FlowAccount X';
}
