import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-password-protection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-protection.component.html',
  styleUrls: ['./password-protection.component.scss']
})
export class PasswordProtectionComponent {
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.authService.login(this.password)) {
      this.router.navigate(['/']);
    } else {
      this.error = 'Incorrect password';
    }
  }
}
