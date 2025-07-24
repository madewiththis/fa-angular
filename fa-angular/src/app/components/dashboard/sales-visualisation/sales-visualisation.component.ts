import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-visualisation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sales-visualisation">
      <h2>Sales Visualisation</h2>
      <div class="filters">
        <div class="filter-group">
          <label for="group-by">Grouped by:</label>
          <select id="group-by" [(ngModel)]="selectedGroup">
            <option *ngFor="let group of groups" [value]="group">{{ group }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="date-range">Date Range:</label>
          <select id="date-range" [(ngModel)]="selectedDateRange">
            <option *ngFor="let range of dateRanges" [value]="range">{{ range }}</option>
          </select>
        </div>
      </div>
      <div class="chart-container">
        <!-- Chart will go here -->
        <p>Chart Placeholder</p>
      </div>
      <div class="totals">
        <div class="total">
          <span class="total-label">Total:</span>
          <span class="total-value">$12,345</span>
        </div>
        <div class="grouping-totals">
          <span class="total-label">Grouping Totals:</span>
          <!-- Grouping totals will go here -->
          <p>Grouping Totals Placeholder</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .sales-visualisation {
        background: #fff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      h2 {
        margin: 0 0 16px;
        color: #1f2937;
      }
      .filters {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
      }
      .filter-group {
        display: flex;
        flex-direction: column;
      }
      label {
        margin-bottom: 8px;
        color: #6b7280;
        font-size: 14px;
      }
      select {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background-color: #fff;
        color: #1f2937;
      }
      .chart-container {
        height: 300px;
        background: #f9fafb;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        margin-bottom: 24px;
      }
      .totals {
        display: flex;
        gap: 32px;
      }
      .total, .grouping-totals {
        display: flex;
        flex-direction: column;
      }
      .total-label {
        color: #6b7280;
        font-size: 14px;
        margin-bottom: 4px;
      }
      .total-value {
        font-size: 24px;
        font-weight: bold;
        color: #1f2937;
      }
    `,
  ],
})
export class SalesVisualisationComponent {
  groups = ['Customer', 'Product', 'Salesperson'];
  selectedGroup = this.groups[0];

  dateRanges = [
    'Current Month',
    'Previous Month',
    '2 Months',
    '3 Months',
    '6 Months',
    '1 Year',
    'Current Year',
    'Previous Year',
  ];
  selectedDateRange = this.dateRanges[0];
} 