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
  isPhoneCopied = false;
  isIdCopied = false;

  constructor(private authService: AuthService) {}

  copyToClipboard(text: string, type: 'phone' | 'id') {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (type === 'phone') {
          this.isPhoneCopied = true;
          setTimeout(() => (this.isPhoneCopied = false), 2000);
        } else if (type === 'id') {
          this.isIdCopied = true;
          setTimeout(() => (this.isIdCopied = false), 2000);
        }
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  }

  logout() {
    this.authService.logout();
  }
}
