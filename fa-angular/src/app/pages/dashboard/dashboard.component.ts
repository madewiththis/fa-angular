import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  submenu: string[];
}

interface BottomMenuItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-layout">
      <!-- Main Menu - Always Visible -->
      <nav class="main-menu">
        <div class="menu-header">
          <div class="logo">FA</div>
        </div>

        <div class="menu-items">
          <button
            *ngFor="let item of mainMenuItems"
            class="menu-item"
            [class.active]="item.id === 'sell'"
            (mouseenter)="onMainMenuHover(item.id)"
            (mouseleave)="onMainMenuLeave()"
          >
            <i class="material-icons">{{ item.icon }}</i>
            <span class="menu-text">{{ item.label }}</span>
          </button>
        </div>

        <div class="menu-footer">
          <button
            *ngFor="let item of bottomMenuItems"
            class="menu-item"
            (mouseenter)="onBottomMenuHover()"
          >
            <i class="material-icons">{{ item.icon }}</i>
            <span class="menu-text">{{ item.label }}</span>
          </button>
        </div>
      </nav>

      <!-- Submenu - Dynamic -->
      <aside
        class="submenu"
        (mouseenter)="onSubmenuEnter()"
        (mouseleave)="onSubmenuLeave()"
      >
        <div class="submenu-header">
          <h3>{{ currentSubmenuTitle }}</h3>
        </div>
        <div class="submenu-items">
          <button *ngFor="let item of currentSubmenuItems" class="submenu-item">
            {{ item }}
          </button>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="content-area">
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
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard-layout {
        display: flex;
        height: 100vh;
        background: #f9fafb;
      }

      /* Main Menu Styles */
      .main-menu {
        width: 100px;
        background: #138dce;
        color: white;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
      }

      .menu-header {
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        text-align: center;
      }

      .logo {
        width: 40px;
        height: 40px;
        background: white;
        color: #138dce;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin: 0 auto;
      }

      .menu-items {
        flex: 1;
        padding: 16px 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .menu-footer {
        padding: 16px 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 8px;
        border: none;
        background: none;
        color: rgba(255, 255, 255, 0.8);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        gap: 4px;
      }

      .menu-item:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        transform: scale(1.05);
      }

      .menu-item.active {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        transform: scale(1.05);
      }

      .menu-item .material-icons {
        font-size: 20px;
      }

      .menu-text {
        font-size: 10px;
        text-align: center;
        line-height: 1.2;
      }

      /* Submenu Styles */
      .submenu {
        width: 240px;
        background: white;
        border-right: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        transition: all 0.3s ease;
      }

      .submenu-header {
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
      }

      .submenu-header h3 {
        margin: 0;
        font-size: 18px;
        color: #1f2937;
        transition: all 0.3s ease;
      }

      .submenu-items {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .submenu-item {
        padding: 8px 12px;
        border: none;
        background: none;
        text-align: left;
        border-radius: 6px;
        cursor: pointer;
        color: #6b7280;
        transition: all 0.2s;
      }

      .submenu-item:hover {
        background: #f3f4f6;
        color: #1f2937;
      }

      /* Content Area Styles */
      .content-area {
        flex: 1;
        overflow: auto;
        padding: 24px;
      }

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
export class DashboardComponent {
  hoveredMenuItem: string | null = null;
  private hideSubmenuTimeout: any = null;

  mainMenuItems: MenuItem[] = [
    {
      id: 'sell',
      label: 'Sell',
      icon: 'attach_money',
      submenu: [
        'Invoice',
        'Receipt',
        'Delivery Order',
        'Credit Note',
        'Sales Report',
      ],
    },
    {
      id: 'buy',
      label: 'Buy',
      icon: 'shopping_cart',
      submenu: [
        'Purchase Order',
        'Goods Receipt',
        'Purchase Invoice',
        'Debit Note',
        'Purchase Report',
      ],
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: 'receipt',
      submenu: [
        'Expense Claims',
        'Reimbursements',
        'Expense Categories',
        'Expense Reports',
      ],
    },
    {
      id: 'products',
      label: 'Products',
      icon: 'shelves',
      submenu: [
        'Product List',
        'Categories',
        'Inventory',
        'Stock Movement',
        'Price List',
      ],
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: 'recent_actors',
      submenu: ['Customers', 'Suppliers', 'Employees', 'Contact Groups'],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'insert_chart',
      submenu: [
        'Profit & Loss',
        'Balance Sheet',
        'Cash Flow',
        'Trial Balance',
        'Aged Receivable',
      ],
    },
    {
      id: 'accounting',
      label: 'Accounting',
      icon: 'build',
      submenu: [
        'Chart of Accounts',
        'Journal Entries',
        'Bank Reconciliation',
        'Tax Settings',
      ],
    },
  ];

  bottomMenuItems: BottomMenuItem[] = [
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'apps', label: 'Apps', icon: 'apps' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'profile', label: 'Profile', icon: 'account_circle' },
  ];

  get currentSubmenuTitle(): string {
    if (this.hoveredMenuItem) {
      const menuItem = this.mainMenuItems.find(
        (item) => item.id === this.hoveredMenuItem
      );
      return menuItem ? menuItem.label : 'Dashboard';
    }
    return 'Dashboard';
  }

  get currentSubmenuItems(): string[] {
    if (this.hoveredMenuItem) {
      const menuItem = this.mainMenuItems.find(
        (item) => item.id === this.hoveredMenuItem
      );
      return menuItem ? menuItem.submenu : ['Overview', 'Analytics', 'Reports'];
    }
    return ['Overview', 'Analytics', 'Reports'];
  }

  onMainMenuHover(menuId: string) {
    this.clearHideTimeout();
    this.hoveredMenuItem = menuId;
  }

  onMainMenuLeave() {
    this.startHideTimeout();
  }

  onBottomMenuHover() {
    this.clearHideTimeout();
    this.hoveredMenuItem = null;
  }

  onSubmenuEnter() {
    this.clearHideTimeout();
  }

  onSubmenuLeave() {
    this.startHideTimeout();
  }

  private clearHideTimeout() {
    if (this.hideSubmenuTimeout) {
      clearTimeout(this.hideSubmenuTimeout);
      this.hideSubmenuTimeout = null;
    }
  }

  private startHideTimeout() {
    this.hideSubmenuTimeout = setTimeout(() => {
      this.hoveredMenuItem = null;
    }, 300);
  }
}
