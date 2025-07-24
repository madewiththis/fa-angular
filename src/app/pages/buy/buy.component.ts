import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Buy</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">
          Buy module - Purchase Order, Goods Receipt, Purchase Invoice, Debit
          Note, Purchase Report
        </p>
      </div>
    </div>
  `,
})
export class BuyComponent {}
