import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Contacts</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">
          Contacts module - Customers, Suppliers, Employees, Contact Groups
        </p>
      </div>
    </div>
  `,
})
export class ContactsComponent {}
