import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Expenses</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">
          Expenses module - Expense Claims, Reimbursements, Expense Categories,
          Expense Reports
        </p>
      </div>
    </div>
  `,
})
export class ExpensesComponent {}
