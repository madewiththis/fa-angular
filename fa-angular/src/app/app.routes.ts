import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { PasswordProtectionComponent } from './components/auth/password-protection/password-protection.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: PasswordProtectionComponent,
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'get-started', pathMatch: 'full' },
      {
        path: 'get-started',
        loadComponent: () =>
          import('./pages/dashboard/get-started/get-started.component').then(
            (m) => m.GetStartedComponent
          ),
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/dashboard/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: 'accounts-receivable',
        loadComponent: () =>
          import(
            './pages/dashboard/accounts-receivable/accounts-receivable.component'
          ).then((m) => m.AccountsReceivableComponent),
      },
      {
        path: 'accounts-payable',
        loadComponent: () =>
          import(
            './pages/dashboard/accounts-payable/accounts-payable.component'
          ).then((m) => m.AccountsPayableComponent),
      },
    ],
  },
  {
    path: 'sell',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/sell/sell.component').then((m) => m.SellComponent),
  },
  {
    path: 'sell/quotation',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/sell/quotation/quotation.component').then(
        (m) => m.QuotationComponent
      ),
  },
  {
    path: 'buy',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/buy/buy.component').then((m) => m.BuyComponent),
  },
  {
    path: 'accounting',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/accounting/accounting.component').then(
        (m) => m.AccountingComponent
      ),
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reports/reports.component').then(
        (m) => m.ReportsComponent
      ),
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'contacts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/contacts/contacts.component').then(
        (m) => m.ContactsComponent
      ),
  },
  {
    path: 'expenses',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/expenses/expenses.component').then(
        (m) => m.ExpensesComponent
      ),
  },
  { path: '**', redirectTo: '/dashboard' },
];
