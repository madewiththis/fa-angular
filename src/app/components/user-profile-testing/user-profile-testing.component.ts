import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingButtonComponent } from './floating-button/floating-button.component';
import { UserProfileTestingModalComponent } from './modal/user-profile-testing-modal.component';

@Component({
  selector: 'app-user-profile-testing',
  standalone: true,
  imports: [
    CommonModule,
    FloatingButtonComponent,
    UserProfileTestingModalComponent,
  ],
  template: `
    <app-floating-button></app-floating-button>
    <app-user-profile-testing-modal></app-user-profile-testing-modal>
  `,
})
export class UserProfileTestingComponent {} 