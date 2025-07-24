import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apps-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-1">
      <a href="#" class="app-item">
        <img src="assets/logo_fa_small.png" alt="FlowAccount logo" />
        <div>
          <div class="app-title">FlowAccount</div>
          <div class="app-subtitle">Easy Accounting</div>
        </div>
      </a>
      <a href="#" class="app-item">
        <img src="assets/logo_payroll_small.png" alt="Payroll logo" />
        <div>
          <div class="app-title">Payroll</div>
          <div class="app-subtitle">Manage Pay</div>
        </div>
      </a>
      <a href="#" class="app-item">
        <img src="assets/logo_autokey_small.png" alt="AutoKey logo" />
        <div>
          <div class="app-title">AutoKey</div>
          <div class="app-subtitle">AI Document Scanner</div>
        </div>
      </a>
    </div>
  `,
  styles: [
    `
      .app-item {
        display: flex;
        align-items: center;
        padding: 0.75rem; /* 12px */
        border-radius: 1.3rem; /* 8px */
        transition: background-color 0.2s;
        text-decoration: none;
        color: inherit;
      }
      .app-item:hover {
        background-color: #f3f4f6; /* gray-100 */
      }
      .app-item img {
        width: 32px;
        height: 32px;
        margin-right: 1rem; /* 16px */
      }
      .app-title {
        font-weight: 600;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem;
      }
      .app-subtitle {
        font-size: 0.75rem; /* 12px */
        line-height: 1rem;
        color: #6b7280; /* gray-500 */
      }
    `,
  ],
})
export class AppsContentComponent {} 