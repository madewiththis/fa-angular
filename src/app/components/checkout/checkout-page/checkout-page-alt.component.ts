import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'app-checkout-page-alt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-page-alt.component.html',
  styleUrl: './checkout-page-alt.component.scss'
})
export class CheckoutPageAltComponent implements OnInit {
  checkoutForm: FormGroup;
  showCvv = false;
  
  paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'Credit Card',
      icon: 'fas fa-credit-card',
      selected: true
    },
    {
      id: 'scan-to-pay', 
      name: 'Scan to Pay',
      icon: 'fas fa-qrcode',
      selected: false
    },
    {
      id: 'bank-account',
      name: 'Bank Account', 
      icon: 'fas fa-university',
      selected: false
    }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      // Credit card form fields
      cardNumber: ['1234 1234 1234 1234', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      nameOnCard: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Component initialization
  }

  selectPaymentMethod(methodId: string) {
    this.paymentMethods.forEach(method => {
      method.selected = method.id === methodId;
    });
  }

  getSelectedPaymentMethod(): PaymentMethod | undefined {
    return this.paymentMethods.find(method => method.selected);
  }

  toggleCvvVisibility() {
    this.showCvv = !this.showCvv;
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    event.target.value = formattedValue;
    this.checkoutForm.patchValue({ cardNumber: formattedValue });
  }

  formatExpirationDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.checkoutForm.patchValue({ expirationDate: value });
  }

  goBack() {
    this.router.navigate(['/packages']);
  }
} 