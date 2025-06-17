import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { PasswordProtectionComponent } from './components/auth/password-protection/password-protection.component';

export const routes: Routes = [
  {
    path: 'login',
    component: PasswordProtectionComponent,
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'sell',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/sell/sell.component').then((m) => m.SellComponent),
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
