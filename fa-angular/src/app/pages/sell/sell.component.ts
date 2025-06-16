import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Sell</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">
          Sell module - Invoice, Receipt, Delivery Order, Credit Note, Sales
          Report
        </p>
      </div>
    </div>
  `,
})
export class SellComponent {}
