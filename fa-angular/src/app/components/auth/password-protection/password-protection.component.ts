import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-protection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <!-- For now, we'll just pass through the content -->
      <!-- In a real app, this would check authentication -->
      <ng-content></ng-content>
    </div>
  `,
})
export class PasswordProtectionComponent {}
