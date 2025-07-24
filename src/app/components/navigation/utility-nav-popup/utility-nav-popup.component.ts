import { Component, Input, HostBinding, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/menu.service';
import { AppsContentComponent } from './apps/apps.component';
import { SettingsContentComponent } from './settings/settings.component';
import { ProfileContentComponent } from './profile/profile.component';

@Component({
  selector: 'app-utility-nav-popup',
  standalone: true,
  imports: [
    CommonModule,
    AppsContentComponent,
    SettingsContentComponent,
    ProfileContentComponent,
  ],
  templateUrl: './utility-nav-popup.component.html',
  styleUrls: ['./utility-nav-popup.component.scss'],
})
export class UtilityNavPopupComponent {
  @Input() isMenuCollapsed = false;

  @HostBinding('class.expanded-menu')
  get isMenuExpanded(): boolean {
    return !this.isMenuCollapsed;
  }

  @HostBinding('class.visible')
  get isVisible(): boolean {
    return this.menuService.activeUtilityPopup() !== null;
  }

  constructor(
    public menuService: MenuService,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isVisible) {
      return;
    }
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closePopup();
    }
  }

  closePopup() {
    this.menuService.activeUtilityPopup.set(null);
  }
} 