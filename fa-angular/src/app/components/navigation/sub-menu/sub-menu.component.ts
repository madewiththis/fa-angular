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
      class="bg-white border-r border-gray-200 h-full transition-all duration-300"
      [class.w-60]="!isCollapsed"
      [class.w-16]="isCollapsed"
    >
      <div
        class="p-4 border-b border-gray-200 flex items-center justify-between"
      >
        <h2
          class="text-lg font-semibold text-gray-900 truncate"
          [class.hidden]="isCollapsed"
        >
          {{ title }}
        </h2>
        <button
          (click)="onToggle()"
          class="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
          *ngIf="!isDashboard"
        >
          <span class="text-gray-500">
            {{ isCollapsed ? '→' : '←' }}
          </span>
        </button>
      </div>

      <nav class="mt-2" *ngIf="submenu.length > 0">
        <div class="space-y-1 px-2">
          <button
            *ngFor="let item of submenu"
            (click)="onSubMenuClick(item.path)"
            class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            [class.hidden]="isCollapsed"
          >
            <span class="text-sm mr-2" *ngIf="item.icon">{{ item.icon }}</span>
            <span class="truncate">{{ item.label }}</span>
          </button>
        </div>
      </nav>

      <div class="mt-2 px-2" *ngIf="isCollapsed && submenu.length > 0">
        <div class="space-y-1">
          <div
            *ngFor="let item of submenu.slice(0, 5)"
            class="w-full h-2 bg-gray-200 rounded"
          ></div>
        </div>
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
