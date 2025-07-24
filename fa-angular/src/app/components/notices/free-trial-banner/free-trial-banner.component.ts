import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-free-trial-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-blue-600 text-white text-center py-2 px-4 text-sm">
      <span>🎉 Free Trial Active - 14 days remaining</span>
      <button class="ml-4 text-blue-200 hover:text-white underline">
        Upgrade Now
      </button>
    </div>
  `,
})
export class FreeTrialBannerComponent {}
