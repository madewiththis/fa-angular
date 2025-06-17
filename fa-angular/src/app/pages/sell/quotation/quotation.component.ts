import { Component } from '@angular/core';
import { MenuLayoutComponent } from '../../../components/layout/menu-layout/menu-layout.component';
import { SearchInputComponent } from '../../../components/shared/search-input/search-input.component';
import { FilterButtonComponent } from '../../../components/shared/filter-button/filter-button.component';
import { ActionButtonComponent } from '../../../components/shared/action-button/action-button.component';
import { DataTableComponent } from '../../../components/shared/data-table/data-table.component';
import { DataTableColumn } from '../../../components/shared/data-table/data-table.model';

@Component({
  selector: 'app-quotation',
  standalone: true,
  imports: [
    MenuLayoutComponent,
    SearchInputComponent,
    FilterButtonComponent,
    ActionButtonComponent,
    DataTableComponent
  ],
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent {
  
  columns: DataTableColumn[] = [
    { key: 'select', header: '' },
    { key: 'docDate', header: 'Doc Date' },
    { key: 'docNo', header: 'Doc No' },
    { key: 'customerProject', header: 'Customer/Project' },
    { key: 'grandTotal', header: 'Grand Total' },
    { key: 'status', header: 'Status' },
  ];

  statusOptions = [
    'All',
    'Awaiting',
    'Approved',
    'Issued',
    'Rejected',
    'Partials',
    'Deposited',
    'Deleted',
  ];

  data = [
    { select: false, docDate: '15/01/2024', docNo: 'QT-001', customerProject: 'John Doe', grandTotal: 1500.50, status: 'Issued' },
    { select: false, docDate: '16/01/2024', docNo: 'QT-002', customerProject: 'Jane Smith', grandTotal: 2500.00, status: 'Approved' },
    { select: false, docDate: '17/01/2024', docNo: 'QT-003', customerProject: 'Peter Jones', grandTotal: 800.75, status: 'Awaiting' },
    { select: false, docDate: '18/01/2024', docNo: 'QT-004', customerProject: 'The Tech Company', grandTotal: 12500.00, status: 'Rejected' },
    { select: false, docDate: '19/01/2024', docNo: 'QT-005', customerProject: 'Innovate LLC', grandTotal: 7300.20, status: 'Partials' },
    { select: false, docDate: '20/01/2024', docNo: 'QT-006', customerProject: 'Global Corp', grandTotal: 5420.00, status: 'Deposited' },
    { select: false, docDate: '21/01/2024', docNo: 'QT-007', customerProject: 'Another Client', grandTotal: 950.00, status: 'Deleted' },
    { select: false, docDate: '22/01/2024', docNo: 'QT-008', customerProject: 'Project X', grandTotal: 18000.00, status: 'Approved' },
    { select: false, docDate: '23/01/2024', docNo: 'QT-009', customerProject: 'Project Y', grandTotal: 2200.50, status: 'Issued' },
    { select: false, docDate: '24/01/2024', docNo: 'QT-010', customerProject: 'Final Customer', grandTotal: 3450.90, status: 'Awaiting' }
  ];

} 