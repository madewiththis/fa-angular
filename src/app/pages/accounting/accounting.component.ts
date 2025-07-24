import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Accounting</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">
          Accounting module - Journal Entry, Chart of Accounts, Bank
          Reconciliation, Asset Management, Closing Period
        </p>
      </div>
    </div>
  `,
})
export class AccountingComponent {}
