import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CaseStudy {
  id: string;
  companyName: string;
  businessType: string;
  useCase: string;
  keyFeatures: string[];
  quote: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  overview: {
    title: string;
    description: string;
    videoUrl: string;
  };
}

@Component({
  selector: 'app-social-proof',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-proof.component.html',
  styleUrl: './social-proof.component.scss'
})
export class SocialProofComponent {
  selectedCaseStudy: CaseStudy;
  
  caseStudies: CaseStudy[] = [
    {
      id: 'meether',
      companyName: 'Me Ther Co., Ltd.',
      businessType: 'Textile & Clothing Business - 22 Years',
      useCase: 'Fast document issuance and mobile accessibility to respond to customers instantly, anywhere',
      keyFeatures: [
        'Complete 4-document flow: Quotation → Invoice → Tax Invoice → Receipt',
        'Mobile access from anywhere - no need to return to office',
        'Instant document printing with just a tap on "Print"',
        'Multi-user support for accounting staff access'
      ],
      quote: 'Speed is our competitive advantage. Being able to send quotations immediately means customers approve faster. In today\'s world, speed is everything: when a client places an order and we can respond quickly, we impress them.',
      author: {
        name: 'Chanunwat Netiphatthanawat',
        title: 'Owner, Me Ther Co., Ltd.',
        avatar: '/assets/avatars/chanunwat.jpg'
      },
      overview: {
        title: 'Speed as Competitive Advantage',
        description: 'A 22-year textile and clothing business specializing in rush jobs. Their fastest delivery: 700 pieces with 5-color screen printing completed in 24 hours.',
        videoUrl: 'https://www.youtube.com/watch?v=YDxnJlKb9Kc'
      }
    },
    {
      id: 'evo-technology',
      companyName: 'Evo Technology',
      businessType: 'Green-tech EV Charging Solutions',
      useCase: 'Creating a paperless workflow aligned with ESG principles and professional service delivery through clean UI design',
      keyFeatures: [
        'Low-cost SaaS model with minimal upfront investment risk',
        'Professional UI that reassures customers of quality service',
        'Data-driven insights for cost reduction and operational improvements',
        'No accounting background required - like having a "fifth partner"'
      ],
      quote: 'FlowAccount became our unofficial "fifth partner," making the accounting and finance side manageable for four co-founders who had zero accounting or finance expertise.',
      author: {
        name: 'Nick (Poomphat Lohachun)',
        title: 'Founder, Evo Technology',
        avatar: '/assets/avatars/nick-evo.jpg'
      },
      overview: {
        title: 'EV Charging Network Nationwide',
        description: 'A green-tech company providing EV charging solutions with over 300 charging points across the country, growing with government clean energy policies.',
        videoUrl: 'https://www.youtube.com/watch?v=PagUUbE8OGM'
      }
    },
    {
      id: 'ppb-garage',
      companyName: 'PPB Garage',
      businessType: 'Truck & Tank Manufacturing',
      useCase: 'Digital transformation with online accounting software to create a comprehensive online backend management system',
      keyFeatures: [
        'Customer data management across the country',
        'Reduced paper resource consumption',
        'Mobile business overview access anytime',
        'Accounting system that scales with large businesses'
      ],
      quote: 'FlowAccount helped us completely transform our company direction toward a digital system, reducing paper usage and enabling us to track business overview anytime.',
      author: {
        name: 'Petch Mahajitrasattaya',
        title: 'Executive, PPB Garage Co., Ltd.',
        avatar: '/assets/avatars/khun-petch.jpg'
      },
      overview: {
        title: 'Digital Transformation - 3rd Generation',
        description: 'A 3rd generation truck manufacturing business embracing full digital transformation to modernize their operations.',
        videoUrl: 'https://www.youtube.com/watch?v=hjDfJR2YrC0'
      }
    }
  ];

  constructor() {
    this.selectedCaseStudy = this.caseStudies[0]; // Default to first case study
  }

  selectCaseStudy(caseStudy: CaseStudy): void {
    this.selectedCaseStudy = caseStudy;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2); // Limit to 2 characters for better display
  }
} 