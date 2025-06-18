import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.html',
  styleUrl: './features-section.scss'
})
export class FeaturesSectionComponent {
  features = [
    {
      title: 'Get Quotes Accepted',
      description:
        'Create and send professional quotations in minutes. Track their status and get notified when they\'re accepted, so you can start work faster.',
    },
    {
      title: 'Collect Payment',
      description:
        'Accept online payments from customers. We partner with leading payment gateways to make it easy for you to get paid.',
    },
    {
      title: 'Manage Expenses',
      description:
        'Track your business expenses and get a clear overview of your spending. Capture receipts and categorize expenses on the go.',
    },
    {
      title: 'Track Inventory',
      description:
        'Keep track of your stock levels in real-time. Manage your products, and get low stock alerts to never miss a sale.',
    },
  ];

  selectedFeature: any = this.features[0];

  selectFeature(feature: any) {
    this.selectedFeature = feature;
  }
}
