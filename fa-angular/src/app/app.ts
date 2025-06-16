import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuLayoutComponent } from './components/layout/menu-layout/menu-layout.component';
import { CourtesyNavComponent } from './components/courtesy-nav/courtesy-nav.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { FreeTrialBannerComponent } from './components/notices/free-trial-banner/free-trial-banner.component';
import { PasswordProtectionComponent } from './components/auth/password-protection/password-protection.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuLayoutComponent,
    CourtesyNavComponent,
    UserProfileComponent,
    FreeTrialBannerComponent,
    PasswordProtectionComponent,
  ],
  template: `
    <app-password-protection>
      <app-free-trial-banner />
      <app-menu-layout>
        <router-outlet />
      </app-menu-layout>
      <app-courtesy-nav />
      <app-user-profile />
    </app-password-protection>
  `,
  styleUrls: ['./app.scss'],
})
export class AppComponent {
  title = 'FlowAccount X';
}
