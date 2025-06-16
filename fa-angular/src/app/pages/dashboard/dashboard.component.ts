import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DummyChartComponent } from '../../components/placeholders/dummy-chart/dummy-chart.component';
import { DummyTableComponent } from '../../components/placeholders/dummy-table/dummy-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DummyChartComponent, DummyTableComponent],
  template: `
    <div
      class="flex flex-col items-start justify-start h-full w-full pl-[100px]"
    >
      <h1 class="text-3xl font-bold mb-6 mt-2">Dashboard</h1>
      <div class="w-full flex flex-col md:flex-row gap-6 mb-8">
        <app-dummy-chart title="Revenue Overview" />
        <app-dummy-chart title="Expenses Breakdown" />
      </div>
      <app-dummy-table title="Recent Transactions" />
      <app-dummy-table title="Top Customers" />
    </div>
  `,
})
export class DashboardComponent {}
