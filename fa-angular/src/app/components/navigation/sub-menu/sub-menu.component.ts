import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubMenuItem } from '../../../models/menu.models';

@Component({
  selector: 'app-sub-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="submenu-wrapper"
      [class.visible]="submenu.length > 0"
    >
      <div
        class="submenu-header"
        *ngIf="title && !isCollapsed"
      >
        <h2 class="submenu-title">
          {{ title }}
        </h2>
        <button
          (click)="onToggle()"
          class="toggle-button"
          *ngIf="!isDashboard"
        >
          <span class="toggle-icon">
            {{ isCollapsed ? '→' : '←' }}
          </span>
        </button>
      </div>

      <nav
        class="submenu-nav"
        *ngIf="submenu.length > 0 && !isCollapsed"
      >
        <div class="submenu-items">
          <button
            *ngFor="let item of submenu"
            (click)="onSubMenuClick(item.path)"
            class="submenu-item"
          >
            <span class="submenu-item-icon" *ngIf="item.icon">{{ item.icon }}</span>
            <span class="submenu-item-label">{{ item.label }}</span>
          </button>
        </div>
      </nav>

      <!-- Collapsed state indicators -->
      <div class="submenu-collapsed-indicators" *ngIf="isCollapsed && submenu.length > 0">
        <div class="collapsed-indicator" *ngFor="let item of submenu.slice(0, 6)"></div>
      </div>
    </div>
  `,
  styleUrls: ['./sub-menu.component.scss'],
})
export class SubMenuComponent {
  @Input() submenu: SubMenuItem[] = [];
  @Input() title = '';
  @Input() isCollapsed = false;
  @Input() isDashboard = false;

  @Output() subMenuClick = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<void>();

  onSubMenuClick(path: string) {
    this.subMenuClick.emit(path);
  }

  onToggle() {
    this.toggle.emit();
  }
}
