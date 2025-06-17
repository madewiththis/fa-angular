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
  activeUtilityPopup = signal<'profile' | 'settings' | 'apps' | null>(null);

  // Menu data with Material Icons
  mainMenu = signal<MenuItem[]>([
    { label: 'Sell', icon: 'attach_money', path: '/sell' },
    { label: 'Buy', icon: 'shopping_cart', path: '/buy' },
    { label: 'Expenses', icon: 'receipt', path: '/expenses' },
    { label: 'Products', icon: 'shelves', path: '/products' },
    { label: 'Contacts', icon: 'recent_actors', path: '/contacts' },
    { label: 'Reports', icon: 'insert_chart', path: '/reports' },
    { label: 'Accounting', icon: 'business_center', path: '/accounting' },
    { label: 'Profile', icon: 'account_circle' },
  ]);

  bottomMenu = signal<MenuItem[]>([
    { label: 'Notifications', icon: 'notifications' },
    { label: 'Apps', icon: 'apps' },
    { label: 'Settings', icon: 'settings' },
    { label: 'Profile', icon: 'account_circle' },
  ]);

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
    Expenses: [
      { label: 'Expense Claims', path: '/expenses/claims' },
      { label: 'Reimbursements', path: '/expenses/reimbursements' },
      { label: 'Expense Categories', path: '/expenses/categories' },
      { label: 'Expense Reports', path: '/expenses/reports' },
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
    Reports: [
      { label: 'Profit & Loss', path: '/reports/profit-loss' },
      { label: 'Balance Sheet', path: '/reports/balance-sheet' },
      { label: 'Cash Flow', path: '/reports/cash-flow' },
      { label: 'Trial Balance', path: '/reports/trial-balance' },
      { label: 'Aged Receivable', path: '/reports/aged-receivable' },
    ],
    Accounting: [
      { label: 'Journal Entry', path: '/accounting/journal' },
      { label: 'Chart of Accounts', path: '/accounting/chart' },
      { label: 'Bank Reconciliation', path: '/accounting/bank' },
      { label: 'Asset Management', path: '/accounting/assets' },
      { label: 'Closing Period', path: '/accounting/closing' },
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

  toggleUtilityPopup(popup: 'profile' | 'settings' | 'apps') {
    if (this.activeUtilityPopup() === popup) {
      this.activeUtilityPopup.set(null); // Close if same icon is clicked
    } else {
      this.activeUtilityPopup.set(popup);
    }
  }

  getSubmenuForMenu(menuLabel: string): SubMenuItem[] {
    return this.submenus[menuLabel] || [];
  }
}
