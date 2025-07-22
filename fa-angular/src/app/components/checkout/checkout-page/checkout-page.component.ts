import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

interface InvoiceType {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

interface PackageOption {
  id: string;
  duration: string;
  price: number;
  discountInfo: string;
  selected: boolean;
}

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent implements OnInit {
  checkoutForm: FormGroup;
  showCvv = false;
  planName: string = '';
  total: number = 0;
  isTaxWithheld = false;
  withholdingAmount = 0;
  
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

  invoiceTypes: InvoiceType[] = [
    { id: 'corporation', name: 'Corporation', icon: 'fas fa-building', selected: true },
    { id: 'individual', name: 'Individual', icon: 'fas fa-user', selected: false }
  ];

  packageOptions: PackageOption[] = [];
  private pricingData: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.checkoutForm = this.fb.group({
      // Credit card form fields
      cardNumber: ['1234 1234 1234', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      nameOnCard: ['', Validators.required],
      
      // Tax invoice form fields
      invoiceType: ['corporation'],
      companyName: ['', Validators.required],
      fullName: [''],
      address: ['', Validators.required],
      zipCode: [''],
      taxId: ['', Validators.required],
      branchNumber: ['Head Office']
    }, { updateOn: 'blur' });
  }

  get f() { return this.checkoutForm.controls; }

  ngOnInit() {
    this.http.get('/assets/data/pricing.json').subscribe(data => {
      this.pricingData = data;
      this.route.queryParams.subscribe(params => {
        const planKey = params['plan'] || 'pro';
        const billing = params['billing'] || 'oneYear';
        
        const planData = this.pricingData[planKey];
        if (planData) {
          this.planName = planData.name;
          this.packageOptions = [
            { id: 'twoYears', duration: '2 Years', price: planData.twoYears.price, discountInfo: planData.twoYears.discountInfo, selected: false },
            { id: 'oneYear', duration: '1 Year', price: planData.oneYear.price, discountInfo: planData.oneYear.discountInfo, selected: false },
            { id: 'monthly', duration: 'Monthly', price: planData.monthly.price, discountInfo: planData.monthly.discountInfo, selected: false }
          ];
          this.selectPackageOption(billing);
        }
      });
    });

    this.checkoutForm.get('invoiceType')?.valueChanges.subscribe(invoiceType => {
      this.updateValidators(invoiceType);
    });
    this.updateValidators(this.checkoutForm.get('invoiceType')?.value);
  }

  confirmPayment() {
    if (this.checkoutForm.invalid) {
      return;
    }
    alert('Payment successful!');
  }

  updateValidators(invoiceType: string) {
    const companyName = this.checkoutForm.get('companyName');
    const fullName = this.checkoutForm.get('fullName');

    if (invoiceType === 'corporation') {
      companyName?.setValidators(Validators.required);
      fullName?.setValidators(null);
      fullName?.setValue('');
    } else { // individual
      companyName?.setValidators(null);
      companyName?.setValue('');
      fullName?.setValidators(Validators.required);
    }
    companyName?.updateValueAndValidity();
    fullName?.updateValueAndValidity();
  }

  toggleTaxWithholding() {
    this.isTaxWithheld = !this.isTaxWithheld;
    if (this.isTaxWithheld) {
      this.withholdingAmount = this.total * 0.03;
    } else {
      this.withholdingAmount = 0;
    }
  }

  selectPackageOption(optionId: string) {
    this.packageOptions.forEach(option => {
      option.selected = option.id === optionId;
      if (option.selected) {
        this.total = option.price;
        if (this.isTaxWithheld) {
          this.withholdingAmount = this.total * 0.03;
        }
      }
    });
  }

  selectPaymentMethod(methodId: string) {
    this.paymentMethods.forEach(method => {
      method.selected = method.id === methodId;
    });
  }

  getSelectedPaymentMethod(): PaymentMethod | undefined {
    return this.paymentMethods.find(method => method.selected);
  }

  selectInvoiceType(typeId: string) {
    this.invoiceTypes.forEach(type => {
      type.selected = type.id === typeId;
    });
    this.checkoutForm.get('invoiceType')?.setValue(typeId);
  }

  getSelectedInvoiceType(): string {
    const selected = this.invoiceTypes.find(type => type.selected);
    return selected ? selected.id : 'corporation';
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