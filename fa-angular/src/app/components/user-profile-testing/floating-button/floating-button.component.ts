import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileTestingService } from '../../../services/user-profile-testing.service';

@Component({
  selector: 'app-floating-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-button-container">
      <button 
        class="floating-button"
        (click)="openModal()"
        title="User Profile Testing"
        aria-label="Open User Profile Testing Modal">
        <span class="material-icons">science</span>
      </button>
    </div>
  `,
  styleUrls: ['./floating-button.component.scss'],
})
export class FloatingButtonComponent {
  constructor(private userProfileTestingService: UserProfileTestingService) {}

  openModal() {
    this.userProfileTestingService.openModal();
  }
} 