import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLayoutComponent } from '../../components/layout/menu-layout/menu-layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MenuLayoutComponent],
  template: `
    <app-menu-layout>
      <div class="content">
        <h1>Dashboard</h1>

        <div class="dashboard-cards">
          <div class="card">
            <h3>Revenue Overview</h3>
            <p>$12,345</p>
          </div>
          <div class="card">
            <h3>Expenses Breakdown</h3>
            <p>$8,765</p>
          </div>
          <div class="card">
            <h3>Recent Transactions</h3>
            <p>45 items</p>
          </div>
        </div>

        <div class="transactions-table">
          <h3>Recent Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#001</td>
                <td>Lorem Ipsum</td>
                <td>2023-10-21</td>
                <td>$271.61</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td>#002</td>
                <td>Lorem Ipsum</td>
                <td>2023-10-22</td>
                <td>$72.64</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td>#003</td>
                <td>Lorem Ipsum</td>
                <td>2023-10-23</td>
                <td>$431.41</td>
                <td>Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-menu-layout>
  `,
  styles: [
    `
      .content h1 {
        margin: 0 0 24px 0;
        color: #1f2937;
      }

      .dashboard-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 32px;
      }

      .card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .card h3 {
        margin: 0 0 8px 0;
        color: #6b7280;
        font-size: 14px;
      }

      .card p {
        margin: 0;
        font-size: 24px;
        font-weight: bold;
        color: #1f2937;
      }

      .transactions-table {
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .transactions-table h3 {
        margin: 0;
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        color: #1f2937;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 12px 20px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }

      th {
        background: #f9fafb;
        font-weight: 600;
        color: #6b7280;
      }

      td {
        color: #1f2937;
      }

      tr:last-child td {
        border-bottom: none;
      }
    `,
  ],
})
export class DashboardComponent {}
