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
  relevantRoles?: string[]; // Add this to filter features by role
}

interface UserRole {
  id: string;
  label: string;
  description?: string;
}

type ViewState = 'cards' | 'content';

@Component({
  selector: 'app-features-section-v2',
  standalone: true,
  imports: [CommonModule, FixedPlayerComponent],
  templateUrl: './features-section-v2.html',
  styleUrl: './features-section-v2.scss'
})
export class FeaturesSectionV2Component implements OnInit {
  private readonly mediaPlayerService = inject(MediaPlayerService);

  // View state management
  currentView: ViewState = 'cards';
  selectedFeature: Feature | null = null;

  userRoles: UserRole[] = [
    { id: 'owner', label: 'Owners' },
    { id: 'admin', label: 'Admins' },
    { id: 'accountant', label: 'Accountants' },
    { id: 'accounting-firm', label: 'Accounting Firms' }
  ];

  selectedRole: UserRole = this.userRoles[0]; // Owner selected by default

  features: Feature[] = [
    {
      title: 'Online payment',
      description: 'Get paid faster with Stripe, trusted by millions.',
      content: 'Get paid faster with Stripe, trusted by millions of businesses around the world. Receive payments online whether via credit cards, debit cards, Visa, Mastercard, or PromptPay simply by connecting Stripe with FlowAccount. Without a credit card machine, just share an invoice link from FlowAccount to your customers and get paid instantly. Plus, FlowAccount automatically generates accounting records for you.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/customer.gif',
      mediaAlt: 'Online payment processing interface',
      relevantRoles: ['owner', 'admin', 'accountant']
    },
    {
      title: 'Invoicing',
      description: 'Create appealing invoices in 1 minute.',
      content: 'Effortless invoicing - Create appealing invoices in 1 minute. Forget Excel, you can generate multi-currency invoices, end-to-end selling and purchasing documents like a pro. Along with the added convenience of an e-Tax Invoice by Time Stamp function, you can fully manage and keep all your documents securely online.',
      mediaType: 'video',
      mediaSrc: 'assets/tutorials/tutorial_quotation.mp4',
      mediaAlt: 'Invoice creation tutorial',
      relevantRoles: ['owner', 'admin', 'accountant', 'accounting-firm']
    },
    {
      title: 'Expenses',
      description: 'Track and manage business expenses effortlessly.',
      content: 'Capture receipts, categorize expenses, and track your business spending in real-time. Our smart categorization and receipt scanning features make expense management simple and accurate, helping you stay on top of your finances.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/app.gif',
      mediaAlt: 'Expense tracking dashboard',
      relevantRoles: ['owner', 'admin', 'accountant']
    },
    {
      title: 'Payroll',
      description: 'Streamlined payroll processing and compliance.',
      content: 'Manage employee payroll with ease. Calculate wages, taxes, and deductions automatically. Generate payslips, handle statutory contributions, and ensure compliance with local regulations. Save time and reduce errors in your payroll process.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/support.gif',
      mediaAlt: 'Payroll management system',
      relevantRoles: ['owner', 'admin', 'accounting-firm']
    },
    {
      title: 'E-Commerce',
      description: 'Integrate your online store seamlessly.',
      content: 'Connect your e-commerce platforms and manage all your sales channels from one place. Synchronize inventory, track orders, and automate your accounting for online sales. Perfect integration with popular e-commerce platforms.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/app.gif',
      mediaAlt: 'E-commerce integration dashboard',
      relevantRoles: ['owner', 'admin']
    },
    {
      title: 'Mobile Apps & POS',
      description: 'Take your business anywhere with mobile solutions.',
      content: 'Access your business data on-the-go with our mobile apps. Process sales with our point-of-sale system, manage inventory, and handle transactions from anywhere. Perfect for businesses that need mobility and flexibility.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/customer.gif',
      mediaAlt: 'Mobile app and POS system',
      relevantRoles: ['owner', 'admin']
    },
    {
      title: 'Inventory',
      description: 'Real-time inventory tracking and management.',
      content: 'Keep track of your stock levels in real-time. Manage your products, get low stock alerts, and optimize your inventory levels. Our system helps you prevent stockouts and reduce excess inventory costs.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/support.gif',
      mediaAlt: 'Inventory management system',
      relevantRoles: ['owner', 'admin']
    },
    {
      title: 'Reports & Analytics',
      description: 'Get insights into your business performance.',
      content: 'Generate comprehensive reports and gain valuable insights into your business performance. Track key metrics, analyze trends, and make data-driven decisions with our powerful reporting tools.',
      mediaType: 'image',
      mediaSrc: 'assets/landingpage/hero/app.gif',
      mediaAlt: 'Reports and analytics dashboard',
      relevantRoles: ['owner', 'admin', 'accountant', 'accounting-firm']
    }
  ];

  // Get features filtered by selected role
  get filteredFeatures(): Feature[] {
    return this.features.filter(feature => 
      !feature.relevantRoles || feature.relevantRoles.includes(this.selectedRole.id)
    );
  }

  selectRole(role: UserRole) {
    this.selectedRole = role;
    
    // If we're in content view, try to maintain it
    if (this.currentView === 'content') {
      const newFilteredFeatures = this.features.filter(feature => 
        !feature.relevantRoles || feature.relevantRoles.includes(role.id)
      );
      
      // Check if current selected feature is still available for the new role
      const currentFeatureStillAvailable = this.selectedFeature && 
        newFilteredFeatures.some(feature => feature.title === this.selectedFeature!.title);
      
      if (currentFeatureStillAvailable) {
        // Keep the current feature selected
        return;
      } else if (newFilteredFeatures.length > 0) {
        // Select the first available feature for the new role
        this.selectFeature(newFilteredFeatures[0]);
        return;
      } else {
        // No features available for this role, go back to card view
        this.currentView = 'cards';
        this.selectedFeature = null;
        this.mediaPlayerService.exitFixed();
      }
    } else {
      // We're in card view, stay in card view but reset selection
      this.selectedFeature = null;
      this.mediaPlayerService.exitFixed();
    }
  }

  selectFeature(feature: Feature) {
    this.selectedFeature = feature;
    this.currentView = 'content';
    
    // If the selected feature is a video, initialize the media player
    if (feature.mediaType === 'video') {
      this.initializeVideoPlayer(feature);
    } else {
      // If it's an image, exit the current video player if any
      this.mediaPlayerService.exitFixed();
    }
  }

  closeContent() {
    this.currentView = 'cards';
    this.selectedFeature = null;
    this.mediaPlayerService.exitFixed();
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
    // Start in card view
    this.currentView = 'cards';
    this.selectedFeature = null;
  }
} 