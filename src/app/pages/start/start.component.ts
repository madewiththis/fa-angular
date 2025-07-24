import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../components/shared/modal/modal.component';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ModalComponent],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  loginForm: any;
  ctaText = 'Continue';
  isRegistered = false;
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalLink = '';
  modalLinkText = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.loginForm
      .get('email')
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((email: string) => {
          if (this.loginForm.get('email').valid) {
            this.isLoading = true;
            setTimeout(() => {
              this.isLoading = false;
              if (email === 'user@company.com') {
                this.ctaText = 'Log in';
                this.isRegistered = true;
              } else {
                this.ctaText = 'Start Free Trial';
                this.isRegistered = false;
              }
            }, 500);
          } else {
            this.ctaText = 'Continue';
            this.isRegistered = false;
          }
        })
      )
      .subscribe();
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }
    
    if (this.isRegistered) {
      this.modalTitle = 'Check your email';
      this.modalMessage = 'We\'ve sent a secure login link to your email address.';
      this.modalLink = '/dashboard';
      this.modalLinkText = 'Log in to Dashboard';
    } else {
      const email = this.loginForm.get('email').value;
      this.modalTitle = 'Create your account';
      this.modalMessage = 'To start your free trial, click the link in the email we sent you.';
      this.modalLink = `/landing/signup`;
      this.router.navigate([this.modalLink], { queryParams: { email } });
      this.modalLinkText = 'Sign Up';
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
} 