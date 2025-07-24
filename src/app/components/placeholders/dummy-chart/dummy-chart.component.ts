import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dummy-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white rounded-lg shadow p-4 mb-6">
      <div class="font-semibold mb-2">{{ title }}</div>
      <div class="h-64 flex items-end justify-start bg-gray-50 p-4 gap-4">
        <div
          *ngFor="let bar of bars"
          class="w-full bg-blue-400"
          [style.height.%]="bar.height"
        ></div>
      </div>
    </div>
  `,
})
export class DummyChartComponent {
  @Input() title = 'Chart';

  bars = Array.from({ length: 12 }, () => ({
    height: Math.random() * 100,
  }));
}
