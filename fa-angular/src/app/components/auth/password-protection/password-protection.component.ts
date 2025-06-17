import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
export class PasswordProtectionComponent implements OnInit, OnDestroy {
  password = '';
  error = '';

  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  private intervalId: any;
  private matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789日木人月金大土水中火本年一二三四五六七八九十';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.startMatrixRain();
  }

  ngOnDestroy() {
    this.stopMatrixRain();
  }

  login() {
    if (this.authService.login(this.password)) {
      this.router.navigate(['/']);
    } else {
      this.error = 'Incorrect password';
    }
  }

  private startMatrixRain() {
    let placeholder = '';
    const placeholderLength = 20;
  
    this.intervalId = setInterval(() => {
      if (this.passwordInput && document.activeElement !== this.passwordInput.nativeElement) {
        const randomChar = this.matrixChars.charAt(Math.floor(Math.random() * this.matrixChars.length));
        placeholder = randomChar + placeholder;
        if (placeholder.length > placeholderLength) {
          placeholder = placeholder.substring(0, placeholderLength);
        }
        this.passwordInput.nativeElement.placeholder = placeholder;
      }
    }, 100);
  }

  private stopMatrixRain() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private generateMatrixString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += this.matrixChars.charAt(Math.floor(Math.random() * this.matrixChars.length));
    }
    return result;
  }
}
