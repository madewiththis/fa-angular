import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Reports</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">
          Reports module - Profit & Loss, Balance Sheet, Cash Flow, Trial
          Balance, Aged Receivable
        </p>
      </div>
    </div>
  `,
})
export class ReportsComponent {}
