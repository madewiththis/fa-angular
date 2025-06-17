import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuService } from '../../../services/menu.service';
import { MainMenuComponent } from '../../navigation/main-menu/main-menu.component';
import { SubMenuComponent } from '../../navigation/sub-menu/sub-menu.component';

@Component({
  selector: 'app-menu-layout',
  standalone: true,
  imports: [CommonModule, MainMenuComponent, SubMenuComponent],
  template: `
    <div class="h-screen flex overflow-hidden">
      <!-- Main Menu (Always Visible) -->
      <app-main-menu
        [mainMenu]="menuService.mainMenu"
        [bottomMenu]="menuService.bottomMenu"
        [selectedMenu]="menuService.selectedMenu()"
        [isCollapsed]="menuService.isMenuCollapsed()"
        [hoveredMenu]="menuService.hoveredMenu()"
        (selectMenu)="handleSelectMenu($event)"
        (mainMenuHover)="handleMainMenuHover($event)"
        (utilityMenuHover)="handleUtilityMenuHover()"
        (mouseenter)="handleMenuAreaEnter()"
        (mouseleave)="handleMenuAreaLeave()"
      />

      <!-- Submenu (Conditional) -->
      <div
        *ngIf="shouldShowSubmenu()"
        (mouseenter)="handleSubMenuEnter()"
        class="h-screen transition-all duration-300"
      >
        <app-sub-menu
          [submenu]="currentSubmenu()"
          [title]="submenuTitle()"
          [isCollapsed]="isSubMenuCollapsed() && !menuService.hoveredMenu()"
          [isDashboard]="isDashboard()"
          (subMenuClick)="handleSubMenuClick($event)"
          (toggle)="handleSubMenuToggle()"
        />
      </div>

      <!-- Main Content Area -->
      <main class="flex-1 h-screen overflow-auto bg-gray-50 p-4">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styleUrls: ['./menu-layout.component.scss'],
})
export class MenuLayoutComponent implements OnInit {
  public isSubMenuCollapsed = signal(false);
  private hideTimeoutId: any = null;

  constructor(public menuService: MenuService, private router: Router) {
    // React to route changes
    effect(() => {
      const isDashboard = this.isDashboard();
      if (isDashboard) {
        this.menuService.setMenuCollapsed(false);
      }

      const currentPath = this.router.url.split('/')[1];
      if (currentPath) {
        const newSelectedMenu = this.menuService.mainMenu.find(
          (item) => item.label.toLowerCase() === currentPath
        );
        if (newSelectedMenu) {
          this.menuService.setSelectedMenu(newSelectedMenu.label);
        }
      } else {
        this.menuService.setSelectedMenu('');
      }
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // This will trigger the effect above
      });
  }

  isDashboard = computed(
    () => this.router.url === '/' || this.router.url === '/dashboard'
  );

  currentSubmenu = computed(() => {
    const isDashboard = this.isDashboard();
    const hoveredMenu = this.menuService.hoveredMenu();
    const selectedMenu = this.menuService.selectedMenu();

    if (isDashboard) {
      return hoveredMenu ? this.menuService.getSubmenuForMenu(hoveredMenu) : [];
    } else {
      return hoveredMenu
        ? this.menuService.getSubmenuForMenu(hoveredMenu)
        : this.menuService.getSubmenuForMenu(selectedMenu);
    }
  });

  submenuTitle = computed(() => {
    const isDashboard = this.isDashboard();
    const hoveredMenu = this.menuService.hoveredMenu();
    const selectedMenu = this.menuService.selectedMenu();

    return isDashboard ? hoveredMenu || '' : hoveredMenu || selectedMenu;
  });

  shouldShowSubmenu = computed(() => {
    const isDashboard = this.isDashboard();
    const hoveredMenu = this.menuService.hoveredMenu();

    return isDashboard ? hoveredMenu !== null : true;
  });

  clearHideTimeout() {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }

  startHideSubmenuTimeout(collapseParent = false) {
    this.hideTimeoutId = setTimeout(() => {
      this.menuService.setHoveredMenu(null);
      if (collapseParent && !this.isDashboard()) {
        this.menuService.setMenuCollapsed(true);
      }
    }, 300);
  }

  handleMainMenuHover(label: string | undefined) {
    this.clearHideTimeout();
    if (label) {
      this.menuService.setMenuCollapsed(false);
      this.menuService.setHoveredMenu(label);
    } else {
      this.startHideSubmenuTimeout();
    }
  }

  handleUtilityMenuHover() {
    this.clearHideTimeout();
    this.startHideSubmenuTimeout();
    this.menuService.setMenuCollapsed(false);
  }

  handleMenuAreaLeave() {
    this.startHideSubmenuTimeout(true);
  }

  handleMenuAreaEnter() {
    this.clearHideTimeout();
  }

  handleSubMenuEnter() {
    this.clearHideTimeout();
  }

  handleSelectMenu(menu: string) {
    this.menuService.setSelectedMenu(menu);
  }

  handleSubMenuClick(mainMenuLabel: string) {
    this.router.navigate([`/${mainMenuLabel.toLowerCase()}`]);
  }

  handleSubMenuToggle() {
    this.isSubMenuCollapsed.set(!this.isSubMenuCollapsed());
  }
}
