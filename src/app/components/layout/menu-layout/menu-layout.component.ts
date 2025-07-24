import { Component, OnInit, signal, computed, effect, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuService } from '../../../services/menu.service';
import { MainMenuComponent } from '../../navigation/main-menu/main-menu.component';
import { SubMenuComponent } from '../../navigation/sub-menu/sub-menu.component';
import { CourtesyNavComponent } from '../../courtesy-nav/courtesy-nav.component';
import { UtilityNavPopupComponent } from '../../navigation/utility-nav-popup/utility-nav-popup.component';
import { UserProfileTestingComponent } from '../../user-profile-testing/user-profile-testing.component';

@Component({
  selector: 'app-menu-layout',
  standalone: true,
  imports: [
    CommonModule,
    MainMenuComponent,
    SubMenuComponent,
    CourtesyNavComponent,
    UtilityNavPopupComponent,
    UserProfileTestingComponent,
  ],
  template: `
    <div class="menu-layout-root">
      <!-- Main Menu (Always Visible - Now Floating) -->
      <app-main-menu
        [mainMenu]="menuService.mainMenu()"
        [bottomMenu]="menuService.bottomMenu()"
        [selectedMenu]="menuService.selectedMenu()"
        [isCollapsed]="menuService.isMenuCollapsed()"
        [hoveredMenu]="menuService.hoveredMenu()"
        (selectMenu)="handleSelectMenu($event)"
        (mainMenuHover)="handleMainMenuHover($event)"
        (utilityMenuHover)="handleUtilityMenuHover()"
        (mouseenter)="handleMenuAreaEnter()"
        (mouseleave)="handleMenuAreaLeave()"
      />

      <!-- Submenu (Conditional - Now Fixed Positioned) -->
      <div
        *ngIf="shouldShowSubmenu()"
        class="submenu-container transition-all duration-300"
        [class.overlay-mode]="isDashboard() || !hasSubmenuItems()"
        (mouseenter)="handleSubMenuEnter()"
        (mouseleave)="handleSubMenuLeave()"
      >
        <app-sub-menu
          [submenu]="currentSubmenu()"
          [title]="submenuTitle()"
          [isCollapsed]="isSubMenuCollapsed()"
          [isDashboard]="isDashboard()"
          (subMenuClick)="handleSubMenuClick($event)"
          (menuToggle)="handleSubMenuToggle()"
        />
      </div>

      <!-- Main Content Area -->
      <main 
        class="flex-1 h-screen overflow-auto bg-gray-50 p-4"
        (mouseenter)="handleContentAreaEnter()"
      >
        <ng-content></ng-content>
      </main>

      <!-- Courtesy Navigation (Floating Overlay) -->
      <app-courtesy-nav />

      <!-- Utility Navigation -->
      <app-utility-nav-popup [isMenuCollapsed]="menuService.isMenuCollapsed()" />

      <!-- User Profile Testing -->
      <app-user-profile-testing />
    </div>
  `,
  styleUrls: ['./menu-layout.component.scss'],
})
export class MenuLayoutComponent implements OnInit {
  public isSubMenuCollapsed = signal(false);
  private hideTimeoutId: any = null;
  private isMouseOverMenuArea = signal(false);
  private isMouseOverSubMenuArea = signal(false);

  @HostBinding('class.menu-expanded') 
  get isMenuExpanded() {
    return !this.menuService.isMenuCollapsed();
  }

  @HostBinding('style.--main-menu-width')
  get mainMenuWidth() {
    return this.menuService.isMenuCollapsed() ? '60px' : '100px';
  }

  @HostBinding('style.--content-margin-left')
  get contentMarginLeft() {
    const mainMenuWidth = this.menuService.isMenuCollapsed() ? 60 : 100;
    const gap = 16; // 16px gap between main menu and content
    const hasSubmenuItems = this.hasSubmenuItems();
    const submenuWidth = (this.shouldShowSubmenu() && hasSubmenuItems && !this.isDashboard()) ? 230 : 0;
    return `${mainMenuWidth + gap + submenuWidth}px`;
  }

  constructor(public menuService: MenuService, private router: Router) {
    // React to route changes
    effect(() => {
      const isDashboard = this.isDashboard();
      const hasSubmenuItems = this.hasSubmenuItems();
      
      // Always keep main menu expanded on dashboard page
      if (isDashboard) {
        this.menuService.setMenuCollapsed(false);
      } else if (!hasSubmenuItems) {
        // For other pages without submenu items, keep main menu expanded
        this.menuService.setMenuCollapsed(false);
      }

      const currentPath = this.router.url.split('/')[1];
      if (currentPath) {
        const newSelectedMenu = this.menuService.mainMenu().find(
          (item) => item.label.toLowerCase() === currentPath
        );
        if (newSelectedMenu) {
          this.menuService.setSelectedMenu(newSelectedMenu.label);
        }
      } else {
        // Clear selected menu when at dashboard (root path)
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

  hasSubmenuItems = computed(() => {
    const selectedMenu = this.menuService.selectedMenu();
    if (selectedMenu) {
      const submenuItems = this.menuService.getSubmenuForMenu(selectedMenu);
      return submenuItems.length > 0;
    }
    return false;
  });

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
    const selectedMenu = this.menuService.selectedMenu();
    const hasSubmenuItems = this.hasSubmenuItems();
    
    if (isDashboard || !hasSubmenuItems) {
      // On dashboard or pages without submenu items, only show submenu on hover AND if hovered menu has items
      if (hoveredMenu) {
        const submenuItems = this.menuService.getSubmenuForMenu(hoveredMenu);
        return submenuItems.length > 0;
      }
      return false;
    } else {
      // On other pages with submenu items, show if there are submenu items for current or hovered menu
      const menuToCheck = hoveredMenu || selectedMenu;
      if (menuToCheck) {
        const submenuItems = this.menuService.getSubmenuForMenu(menuToCheck);
        return submenuItems.length > 0;
      }
      return false;
    }
  });

  clearHideTimeout() {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }

  startHideSubmenuTimeout(collapseParent = false) {
    this.clearHideTimeout();
    this.hideTimeoutId = setTimeout(() => {
      if (!this.isMouseOverMenuArea() && !this.isMouseOverSubMenuArea()) {
        this.menuService.setHoveredMenu(null);
        if (collapseParent && this.isDashboard()) {
          this.menuService.setMenuCollapsed(true);
        }
      }
    }, 500);
  }

  handleMainMenuHover(label: string | undefined) {
    this.clearHideTimeout();
    if (label) {
      this.menuService.setMenuCollapsed(false);
      this.menuService.setHoveredMenu(label);
    } 
  }

  handleUtilityMenuHover() {
    this.clearHideTimeout();
    this.menuService.setHoveredMenu(null);
    this.menuService.setMenuCollapsed(false);
  }

  handleMenuAreaEnter() {
    this.clearHideTimeout();
    this.isMouseOverMenuArea.set(true);
    this.menuService.setMenuCollapsed(false);
  }

  handleMenuAreaLeave() {
    this.isMouseOverMenuArea.set(false);
    // Only start collapse timeout if not over submenu area
    // if (!this.isMouseOverSubMenuArea()) {
    //   this.startHideSubmenuTimeout(true);
    // }
  }

  handleSubMenuEnter() {
    this.clearHideTimeout();
    this.isMouseOverSubMenuArea.set(true);
    // Keep menu expanded when hovering over submenu
    this.menuService.setMenuCollapsed(false);
  }

  handleSubMenuLeave() {
    this.isMouseOverSubMenuArea.set(false);
    // Only start collapse timeout if not over main menu area
    // if (!this.isMouseOverMenuArea()) {
    //   this.startHideSubmenuTimeout(true);
    // }
  }

  handleContentAreaEnter() {
    // When mouse enters content area, start collapse sequence
    this.clearHideTimeout();
    this.isMouseOverMenuArea.set(false);
    this.isMouseOverSubMenuArea.set(false);
    
    // Don't collapse menu on dashboard page
    if (!this.isDashboard()) {
      // Use a shorter timeout for content area to collapse faster
      setTimeout(() => {
        if (!this.isMouseOverMenuArea() && !this.isMouseOverSubMenuArea()) {
          this.menuService.setMenuCollapsed(true);
        }
      }, 200);
    }
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
