import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'sell',
    loadComponent: () =>
      import('./pages/sell/sell.component').then((m) => m.SellComponent),
  },
  {
    path: 'buy',
    loadComponent: () =>
      import('./pages/buy/buy.component').then((m) => m.BuyComponent),
  },
  {
    path: 'accounting',
    loadComponent: () =>
      import('./pages/accounting/accounting.component').then(
        (m) => m.AccountingComponent
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports.component').then(
        (m) => m.ReportsComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'contacts',
    loadComponent: () =>
      import('./pages/contacts/contacts.component').then(
        (m) => m.ContactsComponent
      ),
  },
  {
    path: 'expenses',
    loadComponent: () =>
      import('./pages/expenses/expenses.component').then(
        (m) => m.ExpensesComponent
      ),
  },
  { path: '**', redirectTo: '/dashboard' },
];
