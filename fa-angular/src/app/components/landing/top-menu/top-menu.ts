import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.scss'
})
export class TopMenuComponent {
  menu = [
    {
      title: 'Products',
      items: [
        { name: 'FlowAccount', description: 'Cloud accounting software for small businesses and solo entrepreneurs' },
        { name: 'MobilePOS', description: 'Mobile POS for retail/service businesses' },
        { name: 'Payroll', description: 'Online payroll solution for SMEs' },
        { name: 'AutoKey', description: 'Receipt management and document storage tool' },
        { name: 'Review FlowAccount', description: '(User feedback/review link)' }
      ]
    },
    {
      title: 'Features',
      items: [
        { name: 'Features for Business Owners', description: '' },
        { name: 'Features for Accountants', description: '' },
        { name: 'Document', description: '' },
        { name: 'Inventory Management', description: '' },
        { name: 'Online Payment', description: '' },
        { name: 'Connect with Shopee / Lazada / TikTok Shop', description: '' },
        { name: 'FlowAccount Open API', description: '' }
      ]
    },
    {
      title: 'Pricing',
      isLink: true,
      link: '/pricing'
    },
    {
      title: 'Services',
      items: [
        { name: 'Business Registration', description: 'Assistance with company registration' },
        { name: 'Find an Accounting Firm', description: 'Connects users with partner firms' },
        { name: 'Google Workspace', description: 'Special offers for Workspace via FlowAccount' }
      ]
    },
    {
      title: 'Partner',
      items: [
        { name: 'Accounting Firm Partner', description: 'Partner program for firms' },
        { name: 'For Education', description: 'FlowAccount for academic institutions' },
        { name: 'Our Integrations', description: 'Business/accounting tool integrations' }
      ]
    },
    {
      title: 'Academy',
      items: [
        { name: 'Accounting Knowledge', description: 'Educational resources for businesses and firms' },
        { name: 'Seminars', description: 'Learn accounting and taxes at your own pace' },
        { name: 'Tutorials', description: 'Video feature explanations' },
        { name: 'FlowAccount Manual Guide', description: 'In-depth how-to guide' },
        { name: 'FAQ', description: 'Frequently asked questions' }
      ]
    }
  ];
}
