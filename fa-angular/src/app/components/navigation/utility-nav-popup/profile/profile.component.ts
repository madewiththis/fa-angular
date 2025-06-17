import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-profile-content',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileContentComponent {
  user = {
    name: 'Firstname Lastname',
    email: 'email@example.com',
    phone: '012-345-6789',
    id: 'N12353353',
  };
  selectedLanguage = 'EN';

  constructor(private authService: AuthService) {}

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  }

  logout() {
    this.authService.logout();
  }
}
