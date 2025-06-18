import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup implements OnInit {
  signupForm: FormGroup;
  currentStep = 1;
  email: string | null = null;

  roles = [
    'Accountant',
    'Bookkeeper',
    'Business Owner',
    'Developer',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      // Step 1
      phoneNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // Step 2
      role: ['', Validators.required],
      companyName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.email = params.get('email');
      if (!this.email) {
        this.email = this.getCookie('user_profile', 'email');
      }
    });
  }

  private getCookie(cookieName: string, key: string): string | null {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        try {
          const cookieValue = c.substring(name.length, c.length);
          const parsedValue = JSON.parse(cookieValue);
          return parsedValue[key] || null;
        } catch (e) {
          console.error('Error parsing cookie', e);
          return null;
        }
      }
    }
    return null;
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (this.signupForm.get('phoneNumber')?.valid && this.signupForm.get('firstName')?.valid && this.signupForm.get('lastName')?.valid) {
        this.currentStep++;
      } else {
        this.markStep1AsTouched();
      }
    } else if (this.currentStep === 2) {
        if (this.signupForm.get('role')?.valid && this.signupForm.get('companyName')?.valid) {
            this.currentStep++;
        } else {
            this.markStep2AsTouched();
        }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  markStep1AsTouched(): void {
    this.signupForm.get('phoneNumber')?.markAsTouched();
    this.signupForm.get('firstName')?.markAsTouched();
    this.signupForm.get('lastName')?.markAsTouched();
  }

  markStep2AsTouched(): void {
    this.signupForm.get('role')?.markAsTouched();
    this.signupForm.get('companyName')?.markAsTouched();
  }

  launchApp(): void {
    if (this.signupForm.valid) {
      console.log('Form Submitted!', this.signupForm.value);

      // Store form data in a session cookie for testing
      const userProfile = {
        company_name: this.signupForm.value.companyName,
        first_name: this.signupForm.value.firstName,
        last_name: this.signupForm.value.lastName,
        email: this.email,
        role: this.signupForm.value.role
      };
      document.cookie = `user_profile=${JSON.stringify(userProfile)};path=/`;


      // Here you would typically send the data to a server
      // and then navigate to the dashboard or app.
      this.router.navigate(['/dashboard']); // Example navigation
    } else {
        console.error('Form is invalid');
        this.markStep1AsTouched();
        this.markStep2AsTouched();
    }
  }
}
