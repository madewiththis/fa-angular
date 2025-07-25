import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedPlayerComponent } from '../../media-player/fixed-player/fixed-player.component';
import { MediaPlayerService, MediaConfig } from '../../media-player/services/media-player.service';

interface Feature {
  title: string;
  description: string;
  content: string;
  mediaType: 'video' | 'image';
  mediaSrc: string;
  mediaAlt?: string;
}

interface UserRole {
  id: string;
  label: string;
  description?: string;
}

@Component({
  selector: 'app-features-section-v1',
  standalone: true,
  imports: [CommonModule, FixedPlayerComponent],
  templateUrl: './features-section-v1.html',
  styleUrl: './features-section-v1.scss'
})
export class FeaturesSectionV1Component implements OnInit {
  private readonly mediaPlayerService = inject(MediaPlayerService);

  userRoles: UserRole[] = [
    { id: 'owner', label: 'Owners' },
    { id: 'admin', label: 'Admins' },
    { id: 'accountant', label: 'Accountants' },
    { id: 'accounting-firm', label: 'Accounting Partners' }
  ];

  selectedRole: UserRole = this.userRoles[0]; // Owner selected by default

  features: Feature[] = [
    {
      title: 'Online payment',
      description: 'Get paid faster with Stripe, trusted by millions.',
      content: 'Get paid faster with Stripe, trusted by millions of businesses around the world. Receive payments online whether via credit cards, debit cards, Visa, Mastercard, or PromptPay simply by connecting Stripe with FlowAccount. Without a credit card machine, just share an invoice link from FlowAccount to your customers and get paid instantly. Plus, FlowAccount automatically generates accounting records for you.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/customer.gif',
      mediaAlt: 'Online payment processing interface'
    },
    {
      title: 'Invoicing',
      description: 'Create appealing invoices in 1 minute.',
      content: 'Effortless invoicing - Create appealing invoices in 1 minute. Forget Excel, you can generate multi-currency invoices, end-to-end selling and purchasing documents like a pro. Along with the added convenience of an e-Tax Invoice by Time Stamp function, you can fully manage and keep all your documents securely online.',
      mediaType: 'video',
      mediaSrc: 'assets/tutorials/tutorial_quotation.mp4',
      mediaAlt: 'Invoice creation tutorial'
    },
    {
      title: 'Expenses',
      description: 'Track and manage business expenses effortlessly.',
      content: 'Capture receipts, categorize expenses, and track your business spending in real-time. Our smart categorization and receipt scanning features make expense management simple and accurate, helping you stay on top of your finances.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/app.gif',
      mediaAlt: 'Expense tracking dashboard'
    },
    {
      title: 'Payroll',
      description: 'Streamlined payroll processing and compliance.',
      content: 'Manage employee payroll with ease. Calculate wages, taxes, and deductions automatically. Generate payslips, handle statutory contributions, and ensure compliance with local regulations. Save time and reduce errors in your payroll process.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/support.gif',
      mediaAlt: 'Payroll management system'
    },
    {
      title: 'E-Commerce',
      description: 'Integrate your online store seamlessly.',
      content: 'Connect your e-commerce platforms and manage all your sales channels from one place. Synchronize inventory, track orders, and automate your accounting for online sales. Perfect integration with popular e-commerce platforms.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/app.gif',
      mediaAlt: 'E-commerce integration dashboard'
    },
    {
      title: 'Mobile Apps & POS',
      description: 'Take your business anywhere with mobile solutions.',
      content: 'Access your business data on-the-go with our mobile apps. Process sales with our point-of-sale system, manage inventory, and handle transactions from anywhere. Perfect for businesses that need mobility and flexibility.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/customer.gif',
      mediaAlt: 'Mobile app and POS system'
    },
    {
      title: 'Inventory',
      description: 'Real-time inventory tracking and management.',
      content: 'Keep track of your stock levels in real-time. Manage your products, get low stock alerts, and optimize your inventory levels. Our system helps you prevent stockouts and reduce excess inventory costs.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/support.gif',
      mediaAlt: 'Inventory management system'
    },
  ];

  selectedFeature: Feature = this.features[0];

  selectRole(role: UserRole) {
    this.selectedRole = role;
  }

  selectFeature(feature: Feature) {
    this.selectedFeature = feature;
    
    // If the selected feature is a video, initialize the media player
    if (feature.mediaType === 'video') {
      this.initializeVideoPlayer(feature);
    } else {
      // If it's an image, exit the current video player if any
      this.mediaPlayerService.exitFixed();
    }
  }

  private initializeVideoPlayer(feature: Feature) {
    const config: MediaConfig = {
      id: `feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`,
      url: feature.mediaSrc,
      title: feature.title,
      description: feature.description,
      mode: 'fixed'
    };
    
    this.mediaPlayerService.launchFixedPlayer(config);
  }

  ngOnInit() {
    // Initialize with first feature if it's a video
    if (this.selectedFeature.mediaType === 'video') {
      this.initializeVideoPlayer(this.selectedFeature);
    }
  }
} 