import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface SubFeature {
  name: string;
  standard: boolean | string;
  pro: boolean | string;
  proBusiness: boolean | string;
}

interface FeatureSection {
  key: string;
  label: string;
  expanded: boolean;
  subFeatures: SubFeature[];
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  savings: number;
  currency: string;
  buttonText: string;
  buttonSubtext: string;
  users: string;
  features: {
    selling: boolean;
    buying: boolean;
    assetManagement: boolean;
    payroll: boolean;
    mobilePOS: boolean;
    inventoryManagement: boolean;
    apiIntegrations: boolean;
    ecommerceIntegrations: boolean;
  };
}

@Component({
  selector: 'app-package-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-selection.component.html',
  styleUrl: './package-selection.component.scss'
})
export class PackageSelectionComponent {
  selectedPlan: PricingPlan | null = null;
  billingCycle: 'monthly' | 'annual' = 'annual';

  plans: PricingPlan[] = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Popular with start-ups',
      monthlyPrice: 199,
      annualPrice: 165,
      savings: 398,
      currency: '฿',
      buttonText: 'Start Free Trial',
      buttonSubtext: '30 Days, No Credit Card',
      users: '1 user',
      features: {
        selling: true,
        buying: true,
        assetManagement: true,
        payroll: true,
        mobilePOS: true,
        inventoryManagement: false,
        apiIntegrations: false,
        ecommerceIntegrations: false
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Popular with service businesses',
      monthlyPrice: 299,
      annualPrice: 249,
      savings: 598,
      currency: '฿',
      buttonText: 'Start Free Trial',
      buttonSubtext: '30 Days, No Credit Card',
      users: 'Unlimited users',
      features: {
        selling: true,
        buying: true,
        assetManagement: true,
        payroll: true,
        mobilePOS: true,
        inventoryManagement: true,
        apiIntegrations: false,
        ecommerceIntegrations: false
      }
    },
    {
      id: 'pro-business',
      name: 'Pro Business',
      description: 'Popular with e-Commerce',
      monthlyPrice: 549,
      annualPrice: 457,
      savings: 1098,
      currency: '฿',
      buttonText: 'Start Free Trial',
      buttonSubtext: '30 Days, No Credit Card',
      users: 'Unlimited users',
      features: {
        selling: true,
        buying: true,
        assetManagement: true,
        payroll: true,
        mobilePOS: true,
        inventoryManagement: true,
        apiIntegrations: true,
        ecommerceIntegrations: true
      }
    }
  ];

  featureSections: FeatureSection[] = [
    {
      key: 'users',
      label: 'Number of Users',
      expanded: false,
      subFeatures: []
    },
    {
      key: 'selling',
      label: 'Selling: Invoices & Quotes',
      expanded: false,
      subFeatures: [
        {
          name: 'Core Selling Documents: Quotations, Billing Notes/Invoices/Delivery Notes/Tax Invoices, Receipts',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Advanced Selling Tools: Abbreviated invoices; Issue Credit & Debit Notes; Sum-total billing',
          standard: false,
          pro: true,
          proBusiness: true
        }
      ]
    },
    {
      key: 'buying',
      label: 'Buying: Bills & Expenses',
      expanded: false,
      subFeatures: [
        {
          name: 'Track expenses (Expense Note)',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Set multiple tax rates for withholding taxes',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Track expenses & tax rates; AutoKey OCR with batch import',
          standard: '100 scans/month',
          pro: '100 scans/month',
          proBusiness: 'Unlimited scans'
        },
        {
          name: 'Purchasing & Payments: Schedule payment and payment voucher, Purchase Orders, Inventory Received Notes',
          standard: false,
          pro: true,
          proBusiness: true
        }
      ]
    },
    {
      key: 'assetManagement',
      label: 'Asset Management & Depreciation',
      expanded: false,
      subFeatures: [
        {
          name: 'Asset Registry & Categorization:Record detailed info, create presets & custom categories',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Depreciation & Valuation: Create presets for value & depreciation of asset types',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Documentation: Attach files & images to each asset',
          standard: true,
          pro: true,
          proBusiness: true
        }
      ]
    },
    {
      key: 'payroll',
      label: 'Payroll',
      expanded: false,
      subFeatures: [
        {
          name: 'Calculate and prepare payroll',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Help calculate withholding tax and social security',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Manage departments and employee records',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Send payslips and 50 Tawi by email in batch',
          standard: false,
          pro: false,
          proBusiness: true
        },
        {
          name: 'Prepare files for withholding tax (P.N.D. 1 and P.N.D. 1 kor) and social security online submission',
          standard: false,
          pro: false,
          proBusiness: true
        },
        {
          name: 'Support banks payroll templates',
          standard: false,
          pro: false,
          proBusiness: true
        }
      ]
    },
    {
      key: 'mobilePOS',
      label: 'MobilePOS',
      expanded: false,
      subFeatures: [
        {
          name: 'Basic Sales (keypad payments, product selection, share receipt, tax-invoice)',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'QR Payments (static & dynamic QR codes)',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Payment Method Reports',
          standard: true,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Barcode Scanner',
          standard: false,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Advanced Reports (top-product & sales-by-staff)',
          standard: false,
          pro: true,
          proBusiness: true
        }
      ]
    },
    {
      key: 'inventoryManagement',
      label: 'Inventory Management',
      expanded: false,
      subFeatures: [
        {
          name: 'Integration of inventory management system with sales/purchase documents',
          standard: false,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Support sales and purchase in multiple unit',
          standard: false,
          pro: true,
          proBusiness: true
        },
        {
          name: 'Supports up to 20 warehouses',
          standard: false,
          pro: false,
          proBusiness: true
        }
      ]
    },
    {
      key: 'apiIntegrations',
      label: 'API Integrations',
      expanded: false,
      subFeatures: [
        {
          name: 'API access',
          standard: false,
          pro: false,
          proBusiness: true
        }
      ]
    },
    {
      key: 'ecommerceIntegrations',
      label: 'e-Commerce Integrations',
      expanded: false,
      subFeatures: [
        {
          name: 'Connect FlowAccount to Lazada, Shopee, and Tiktok Shop to get automatic billing and inventory updates',
          standard: false,
          pro: false,
          proBusiness: true
        },
        {
          name: 'Connect multiple Shopee and Lazada stores to your account',
          standard: false,
          pro: false,
          proBusiness: true
        }
      ]
    }
  ];

  constructor(private router: Router) {}

  selectPlan(plan: PricingPlan) {
    this.selectedPlan = plan;
  }

  startFreeTrial(plan: PricingPlan) {
    // Navigate to checkout or start trial process
    this.router.navigate(['/checkout'], {
      queryParams: {
        plan: plan.id,
        billing: this.billingCycle
      }
    });
  }

  openChat() {
    // Open chat functionality
    console.log('Opening chat...');
  }

  callSupport() {
    // Call support functionality
    window.open('tel:02-026-8989');
  }

  getFeatureValue(plan: PricingPlan, featureKey: string): boolean {
    const features = plan.features as any;
    return features[featureKey] || false;
  }

  goBack() {
    // Navigate back to the previous page or dashboard
    this.router.navigate(['/dashboard']);
  }

  toggleFeatureSection(section: FeatureSection) {
    section.expanded = !section.expanded;
  }

  getSubFeatureValue(subFeature: SubFeature, planType: 'standard' | 'pro' | 'proBusiness'): boolean | string {
    return subFeature[planType];
  }
}