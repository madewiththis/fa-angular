import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../../models/menu.models';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300"
      [class.w-16]="isCollapsed"
      [class.w-25]="!isCollapsed"
    >
      <!-- Logo section -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-center">
          <span class="text-xl font-bold text-blue-600" *ngIf="!isCollapsed"
            >FA</span
          >
          <span class="text-sm font-bold text-blue-600" *ngIf="isCollapsed"
            >F</span
          >
        </div>
      </div>

      <!-- Main menu items -->
      <nav class="mt-6 flex-1">
        <div class="space-y-1 px-2">
          <button
            *ngFor="let item of mainMenu"
            (click)="onSelectMenu(item.label)"
            (mouseenter)="onMainMenuHover(item.label)"
            (mouseleave)="onMainMenuHover(undefined)"
            [class]="getMenuItemClasses(item.label)"
            class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
          >
            <span class="text-base mr-3" *ngIf="item.icon">{{
              item.icon
            }}</span>
            <span *ngIf="!isCollapsed">{{ item.label }}</span>
          </button>
        </div>
      </nav>

      <!-- Bottom menu items -->
      <div
        class="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200"
      >
        <div class="space-y-1">
          <button
            *ngFor="let item of bottomMenu"
            (mouseenter)="onUtilityMenuHover()"
            class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            <span class="text-base mr-3" *ngIf="item.icon">{{
              item.icon
            }}</span>
            <span *ngIf="!isCollapsed">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
  @Input() mainMenu: MenuItem[] = [];
  @Input() bottomMenu: MenuItem[] = [];
  @Input() selectedMenu = '';
  @Input() isCollapsed = false;
  @Input() hoveredMenu: string | null = null;

  @Output() selectMenu = new EventEmitter<string>();
  @Output() mainMenuHover = new EventEmitter<string | undefined>();
  @Output() utilityMenuHover = new EventEmitter<void>();

  onSelectMenu(label: string) {
    this.selectMenu.emit(label);
  }

  onMainMenuHover(label: string | undefined) {
    this.mainMenuHover.emit(label);
  }

  onUtilityMenuHover() {
    this.utilityMenuHover.emit();
  }

  getMenuItemClasses(label: string): string {
    const isSelected = this.selectedMenu === label;
    const isHovered = this.hoveredMenu === label;

    let classes = '';

    if (isSelected) {
      classes += 'bg-blue-100 text-blue-900 border-blue-300';
    } else if (isHovered) {
      classes += 'bg-gray-100 text-gray-900';
    } else {
      classes += 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
    }

    return classes;
  }
}
