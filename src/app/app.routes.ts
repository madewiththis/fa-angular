import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { PasswordProtectionComponent } from './components/auth/password-protection/password-protection.component';

export const routes: Routes = [
  {
    path: 'login',
    component: PasswordProtectionComponent,
  },
  {
    path: 'learningcenter/admin',
    loadComponent: () =>
      import('./components/learning-center/admin-ui/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'landing/home',
        loadComponent: () =>
          import('./pages/landing/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'landing/signup',
        loadComponent: () =>
          import('./pages/landing/signup/signup').then((m) => m.Signup),
      },
      { path: '', redirectTo: 'start', pathMatch: 'full' },
      {
        path: 'start',
        loadComponent: () =>
          import('./pages/start/start.component').then(
            (m) => m.StartComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        children: [
          { path: '', redirectTo: 'get-started', pathMatch: 'full' },
          {
            path: 'get-started',
            loadComponent: () =>
              import(
                './pages/dashboard/get-started/get-started.component'
              ).then((m) => m.GetStartedComponent),
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
        loadComponent: () =>
          import('./pages/sell/sell.component').then((m) => m.SellComponent),
      },
      {
        path: 'sell/quotation',
        loadComponent: () =>
          import('./pages/sell/quotation/quotation.component').then(
            (m) => m.QuotationComponent
          ),
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
      {
        path: 'packages',
        loadComponent: () =>
          import('./components/checkout/package-selection/package-selection.component').then(
            (m) => m.PackageSelectionComponent
          ),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./components/checkout/checkout-page/checkout-page.component').then(
            (m) => m.CheckoutPageComponent
          ),
      },
      { path: '**', redirectTo: '/dashboard' },
    ],
  },
];
