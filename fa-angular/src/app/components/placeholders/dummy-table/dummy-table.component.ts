import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dummy-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white rounded-lg shadow p-4 mb-6">
      <div class="font-semibold mb-4">{{ title }}</div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let row of tableData">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ row.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ row.amount | currency }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ row.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  [class]="getStatusClass(row.status)"
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ row.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class DummyTableComponent {
  @Input() title = 'Table';

  tableData = [
    {
      name: 'Invoice #001',
      amount: 1250.0,
      date: '2024-01-15',
      status: 'Paid',
    },
    {
      name: 'Invoice #002',
      amount: 850.5,
      date: '2024-01-14',
      status: 'Pending',
    },
    {
      name: 'Invoice #003',
      amount: 2100.0,
      date: '2024-01-13',
      status: 'Paid',
    },
    {
      name: 'Invoice #004',
      amount: 450.75,
      date: '2024-01-12',
      status: 'Overdue',
    },
    {
      name: 'Invoice #005',
      amount: 1800.0,
      date: '2024-01-11',
      status: 'Paid',
    },
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
