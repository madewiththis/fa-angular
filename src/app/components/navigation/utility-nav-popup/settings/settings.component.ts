import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

interface SettingMenuItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
  external?: boolean;
  separator?: boolean;
}

@Component({
  selector: 'app-settings-content',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule],
  styleUrls: ['./settings.component.scss'],
  template: `
    <div class="settings-container">
      <ul class="settings-menu">
        <ng-container *ngFor="let item of settings">
          <li>
            <button
              matRipple
              class="menu-item"
            >
              <mat-icon>{{
                item.icon
              }}</mat-icon>
              <div class="flex-grow">
                <div class="font-bold">
                  <span>{{ item.title }}</span>
                  <mat-icon *ngIf="item.external">open_in_new</mat-icon
                  >
                </div>
                <div class="description">
                  {{ item.description }}
                </div>
              </div>
            </button>
          </li>
          <hr *ngIf="item.separator" class="separator" />
        </ng-container>
      </ul>
    </div>
  `,
})
export class SettingsContentComponent {
  settings: SettingMenuItem[] = [
    {
      icon: 'apps',
      title: 'My Platform',
      description: 'Manage Integrations',
      external: true,
    },
    {
      icon: 'business',
      title: 'My Company',
      description: 'Billing, Plan, Users, Banking',
      external: true,
      separator: true,
    },
    {
      icon: 'description',
      title: 'Document',
      description: 'Templates, Numbering, Customization',
    },
    {
      icon: 'assessment',
      title: 'Accounting',
      description: 'Methods, Periods, Opening Balance',
    },
    {
      icon: 'person',
      title: 'User Settings',
      description: 'Profile, Preferences, Manage Users',
      external: true,
    },
    {
      icon: 'inventory_2',
      title: 'Products Setting',
      description: 'Warehouses, Categories, Units',
    },
  ];
} 