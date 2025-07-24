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
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let row of tableData; let i = index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                #{{ (i + 1).toString().padStart(3, '0') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ row.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ row.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ row.amount | currency }}
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
      name: 'Lorem Ipsum',
      amount: 271.61,
      date: '2023-10-21',
      status: 'Completed',
    },
    {
      name: 'Lorem Ipsum',
      amount: 72.64,
      date: '2023-10-22',
      status: 'Completed',
    },
    {
      name: 'Lorem Ipsum',
      amount: 431.41,
      date: '2023-10-23',
      status: 'Completed',
    },
    {
      name: 'Lorem Ipsum',
      amount: 641.34,
      date: '2023-10-24',
      status: 'Completed',
    },
    {
      name: 'Lorem Ipsum',
      amount: 363.43,
      date: '2023-10-25',
      status: 'Completed',
    },
    {
      name: 'Lorem Ipsum',
      amount: 178.88,
      date: '2023-10-26',
      status: 'Completed',
    },
    {
      name: 'Lorem Ipsum',
      amount: 344.01,
      date: '2023-10-27',
      status: 'Completed',
    },
    {
      name: 'Lorem Ipsum',
      amount: 356.56,
      date: '2023-10-28',
      status: 'Completed',
    },
    {
      name: 'Lorem Ipsum',
      amount: 6.64,
      date: '2023-10-29',
      status: 'Completed',
    },
    {
      name: 'Lorem Ipsum',
      amount: 175.89,
      date: '2023-10-210',
      status: 'Completed',
    },
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
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
