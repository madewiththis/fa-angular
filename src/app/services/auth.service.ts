import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly password = 'liquidflow'; // In a real app, this should not be hardcoded
  private readonly sessionTimeout = 30 * 60 * 1000; // 30 minutes

  constructor(private router: Router) { }

  login(password: string): boolean {
    if (password === this.password) {
      const expiryTime = new Date().getTime() + this.sessionTimeout;
      localStorage.setItem('sessionExpiry', expiryTime.toString());
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('sessionExpiry');
    this.router.navigate(['/landing/home']);
  }

  isAuthenticated(): boolean {
    const expiryTime = localStorage.getItem('sessionExpiry');
    if (!expiryTime) {
      return false;
    }

    const isExpired = new Date().getTime() > parseInt(expiryTime, 10);
    if (isExpired) {
      this.logout();
      return false;
    }

    return true;
  }
} 