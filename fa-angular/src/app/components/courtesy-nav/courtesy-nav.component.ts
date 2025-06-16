import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courtesy-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50">
      <div class="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div class="text-xs text-gray-500">
          FlowAccount Angular - Courtesy Navigation
        </div>
      </div>
    </div>
  `,
})
export class CourtesyNavComponent {}
