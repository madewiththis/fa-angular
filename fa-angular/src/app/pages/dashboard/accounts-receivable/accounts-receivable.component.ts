import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts-receivable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Collect Money (Accounts Receivable)</h1>
      <p>This is where the accounts receivable content will go.
      <br> Quotes to Send
      <br/> Invoices to Send
      <br/> Invoices to 
      <br/>
      <br/>
      <br/>
      </p>
    </div>
  `,
  styles: [],
})
export class AccountsReceivableComponent {} 