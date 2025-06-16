import { Injectable, signal } from '@angular/core';
import { MenuItem, SubMenuItem, MenuData } from '../models/menu.models';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  // Menu state signals
  isMenuCollapsed = signal(false);
  selectedMenu = signal('');
  hoveredMenu = signal<string | null>(null);

  // Menu data
  mainMenu: MenuItem[] = [
    { label: 'Sell', icon: '📊', path: '/sell' },
    { label: 'Buy', icon: '🛒', path: '/buy' },
    { label: 'Accounting', icon: '📋', path: '/accounting' },
    { label: 'Reports', icon: '📈', path: '/reports' },
    { label: 'Products', icon: '📦', path: '/products' },
    { label: 'Contacts', icon: '👥', path: '/contacts' },
    { label: 'Expenses', icon: '💰', path: '/expenses' },
  ];

  bottomMenu: MenuItem[] = [
    { label: 'Help', icon: '❓', path: '/help' },
    { label: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  submenus: MenuData = {
    Sell: [
      { label: 'Invoice', path: '/sell/invoice' },
      { label: 'Receipt', path: '/sell/receipt' },
      { label: 'Delivery Order', path: '/sell/delivery' },
      { label: 'Credit Note', path: '/sell/credit-note' },
      { label: 'Sales Report', path: '/sell/report' },
    ],
    Buy: [
      { label: 'Purchase Order', path: '/buy/purchase-order' },
      { label: 'Goods Receipt', path: '/buy/goods-receipt' },
      { label: 'Purchase Invoice', path: '/buy/invoice' },
      { label: 'Debit Note', path: '/buy/debit-note' },
      { label: 'Purchase Report', path: '/buy/report' },
    ],
    Accounting: [
      { label: 'Journal Entry', path: '/accounting/journal' },
      { label: 'Chart of Accounts', path: '/accounting/chart' },
      { label: 'Bank Reconciliation', path: '/accounting/bank' },
      { label: 'Asset Management', path: '/accounting/assets' },
      { label: 'Closing Period', path: '/accounting/closing' },
    ],
    Reports: [
      { label: 'Profit & Loss', path: '/reports/profit-loss' },
      { label: 'Balance Sheet', path: '/reports/balance-sheet' },
      { label: 'Cash Flow', path: '/reports/cash-flow' },
      { label: 'Trial Balance', path: '/reports/trial-balance' },
      { label: 'Aged Receivable', path: '/reports/aged-receivable' },
    ],
    Products: [
      { label: 'Product List', path: '/products/list' },
      { label: 'Categories', path: '/products/categories' },
      { label: 'Inventory', path: '/products/inventory' },
      { label: 'Stock Movement', path: '/products/stock-movement' },
      { label: 'Price List', path: '/products/price-list' },
    ],
    Contacts: [
      { label: 'Customers', path: '/contacts/customers' },
      { label: 'Suppliers', path: '/contacts/suppliers' },
      { label: 'Employees', path: '/contacts/employees' },
      { label: 'Contact Groups', path: '/contacts/groups' },
    ],
    Expenses: [
      { label: 'Expense Claims', path: '/expenses/claims' },
      { label: 'Reimbursements', path: '/expenses/reimbursements' },
      { label: 'Expense Categories', path: '/expenses/categories' },
      { label: 'Expense Reports', path: '/expenses/reports' },
    ],
  };

  // Methods
  setMenuCollapsed(collapsed: boolean) {
    this.isMenuCollapsed.set(collapsed);
  }

  setSelectedMenu(menu: string) {
    this.selectedMenu.set(menu);
  }

  setHoveredMenu(menu: string | null) {
    this.hoveredMenu.set(menu);
  }

  getSubmenuForMenu(menuLabel: string): SubMenuItem[] {
    return this.submenus[menuLabel] || [];
  }
}
