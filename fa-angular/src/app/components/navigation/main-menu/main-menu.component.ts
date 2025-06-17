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
      class="h-full text-white z-50 transition-all duration-300 overflow-hidden bg-primary flex flex-col"
      [class.w-15]="isCollapsed"
      [class.w-25]="!isCollapsed"
    >
      <!-- Logo section -->
      <div
        class="p-3 border-b border-primary-dark flex items-center justify-center transition-all duration-300 flex-shrink-0"
        [class.p-2]="isCollapsed"
      >
        <div
          class="bg-white rounded-full flex items-center justify-center transition-all duration-300"
          [class.w-8]="isCollapsed"
          [class.h-8]="isCollapsed"
          [class.w-10]="!isCollapsed"
          [class.h-10]="!isCollapsed"
        >
          <span
            class="text-primary font-bold transition-all duration-300"
            [class.text-sm]="isCollapsed"
            [class.text-lg]="!isCollapsed"
            >FA</span
          >
        </div>
      </div>

      <!-- Main menu items -->
      <nav class="mt-4 flex-1 overflow-y-auto">
        <div
          class="space-y-2 px-2 transition-all duration-300"
          [class.px-1]="isCollapsed"
        >
          <button
            *ngFor="let item of mainMenu"
            (click)="onSelectMenu(item.label)"
            (mouseenter)="onMainMenuHover(item.label)"
            (mouseleave)="onMainMenuHover(undefined)"
            [class]="getMenuItemClasses(item.label)"
            class="w-full flex flex-col items-center justify-center text-xs font-medium rounded-xl transition-all duration-200 hover:bg-primary-light group"
            [class.px-2]="isCollapsed"
            [class.py-3]="isCollapsed"
            [class.px-3]="!isCollapsed"
            [class.py-4]="!isCollapsed"
            [title]="item.label"
          >
            <i
              class="material-icons transition-all duration-300"
              [class.text-lg]="isCollapsed"
              [class.text-xl]="!isCollapsed"
              [class.mb-0]="isCollapsed"
              [class.mb-2]="!isCollapsed"
              >{{ item.icon }}</i
            >
            <span
              class="text-center leading-tight whitespace-nowrap text-xs menu-label"
              [class.collapsed]="isCollapsed"
              [class.expanded]="!isCollapsed"
              >{{ item.label }}</span
            >
          </button>
        </div>
      </nav>

      <!-- Bottom menu items -->
      <div
        class="border-t border-primary-dark transition-all duration-300 flex-shrink-0"
        [class.p-2]="isCollapsed"
        [class.p-3]="!isCollapsed"
      >
        <div class="space-y-2">
          <button
            *ngFor="let item of bottomMenu"
            (mouseenter)="onUtilityMenuHover()"
            class="w-full flex flex-col items-center justify-center text-xs font-medium text-primary-light rounded-xl hover:bg-primary-light hover:text-white transition-all duration-200"
            [class.px-2]="isCollapsed"
            [class.py-2]="isCollapsed"
            [class.px-3]="!isCollapsed"
            [class.py-3]="!isCollapsed"
            [title]="item.label"
          >
            <i
              class="material-icons transition-all duration-300"
              [class.text-sm]="isCollapsed"
              [class.text-lg]="!isCollapsed"
              [class.mb-0]="isCollapsed"
              [class.mb-1]="!isCollapsed"
              >{{ item.icon }}</i
            >
            <span
              class="text-center leading-tight whitespace-nowrap text-xs menu-label"
              [class.collapsed]="isCollapsed"
              [class.expanded]="!isCollapsed"
              >{{ item.label }}</span
            >
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
      classes += 'bg-primary-light text-white shadow-lg scale-105';
    } else if (isHovered) {
      classes += 'bg-primary-light text-white scale-105';
    } else {
      classes += 'text-primary-light hover:text-white hover:scale-105';
    }

    return classes;
  }
}
