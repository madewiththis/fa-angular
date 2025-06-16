import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50">
      <div
        class="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200"
      >
        <div
          class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <span class="text-white text-sm font-medium">U</span>
        </div>
        <div class="text-sm text-gray-700">User Profile</div>
      </div>
    </div>
  `,
})
export class UserProfileComponent {}
