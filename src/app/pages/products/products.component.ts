import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Products</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">
          Products module - Product List, Categories, Inventory, Stock Movement,
          Price List
        </p>
      </div>
    </div>
  `,
})
export class ProductsComponent {}
