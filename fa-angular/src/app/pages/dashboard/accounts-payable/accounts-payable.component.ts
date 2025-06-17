import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts-payable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Pay Bills (Accounts Payable)</h1>
      <p>This is where the accounts payable content will go.</p>
    </div>
  `,
  styles: [],
})
export class AccountsPayableComponent {} 