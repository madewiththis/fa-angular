import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../../models/menu.models';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div 
      class="main-menu-container"
      [class.collapsed]="isCollapsed"
      [class.expanded]="!isCollapsed"
    >
      <!-- Logo section -->
      <div class="logo-section" [class.collapsed]="isCollapsed">
        <div class="logo-wrapper" [class.collapsed]="isCollapsed">
          <a routerLink="/dashboard">
            <img 
              src="assets/fa_logo_dark.png" 
              alt="FlowAccount Logo" 
              class="logo-image"
            />
          </a>
        </div>
      </div>

      <!-- Main menu items -->
      <div class="menu-content">
        <nav class="main-nav">
          <div class="menu-items-container" [class.collapsed]="isCollapsed">
            <button
              *ngFor="let item of mainMenu"
              (click)="onSelectMenu(item.label)"
              (mouseenter)="onMainMenuHover(item.label)"
              (mouseleave)="onMainMenuHover(undefined)"
              [class]="getMenuItemClasses(item.label)"
              class="menu-button"
              [class.collapsed]="isCollapsed"
              [title]="item.label"
            >
              <i
                class="material-icons button-icon"
                [class.collapsed]="isCollapsed"
                >{{ item.icon }}</i
              >
              <span
                class="menu-label"
                [class.collapsed]="isCollapsed"
                [class.expanded]="!isCollapsed"
                >{{ item.label }}</span
              >
            </button>
          </div>
        </nav>
        
        <!-- Spacer to push utility section to bottom -->
        <div class="spacer"></div>
      </div>

      <!-- Utility Menu Section (Bottom) -->
      <div class="utility-section" [class.collapsed]="isCollapsed">
        <div class="utility-items-container" [class.collapsed]="isCollapsed">
          <button
            *ngFor="let item of bottomMenu"
            (click)="onUtilityMenuClick(item.label, $event)"
            (mouseenter)="onUtilityMenuHover()"
            class="menu-button"
            [class.collapsed]="isCollapsed"
            [title]="item.label"
          >
            <i
              class="material-icons button-icon"
              [class.collapsed]="isCollapsed"
              >{{ item.icon }}</i
            >
            <span
              class="menu-label"
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

  constructor(private menuService: MenuService) {}

  onSelectMenu(label: string) {
    this.selectMenu.emit(label);
  }

  onMainMenuHover(label: string | undefined) {
    this.mainMenuHover.emit(label);
  }

  onUtilityMenuHover() {
    this.utilityMenuHover.emit();
  }

  onUtilityMenuClick(label: string, event: MouseEvent) {
    const popupType = label.toLowerCase() as 'profile' | 'settings' | 'apps';
    if (['profile', 'settings', 'apps'].includes(popupType)) {
      this.menuService.toggleUtilityPopup(popupType);
      event.stopPropagation();
    }
  }

  getMenuItemClasses(label: string): string {
    const isSelected = this.selectedMenu === label;
    const isHovered = this.hoveredMenu === label;

    if (isSelected) {
      return 'selected';
    } else if (isHovered) {
      return 'hovered';
    }
    
    return '';
  }
}
