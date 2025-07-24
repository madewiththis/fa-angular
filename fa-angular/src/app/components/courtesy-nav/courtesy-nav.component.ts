import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyChooserComponent } from './company-chooser';
import { HelpCentreComponent } from './help-centre';
import { LanguageChooserComponent } from './language-chooser';
import { PopupComponent } from './popup';
import { UserProfileService } from '../../services/user-profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courtesy-nav',
  standalone: true,
  imports: [
    CommonModule,
    CompanyChooserComponent,
    HelpCentreComponent,
    LanguageChooserComponent,
    PopupComponent,
  ],
  template: `
    <div class="courtesy-nav">
      <div class="trial-status" *ngIf="trialEndDate$ | async as trialEndDate">
        <span>Trial ends on: {{ trialEndDate | date : 'mediumDate' }}</span>
        <button class="upgrade-btn" (click)="navigateToPackages()">
          Upgrade
        </button>
      </div>
      <app-company-chooser></app-company-chooser>
      <app-language-chooser></app-language-chooser>
      <app-help-centre></app-help-centre>
      <app-popup></app-popup>
    </div>
  `,
  styles: [
    `
      .courtesy-nav {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .trial-status {
        background-color: #eef2ff;
        color: #4338ca;
        padding: 6px 12px;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .upgrade-btn {
        background-color: #3b82f6;
        color: white;
        border: none;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .upgrade-btn:hover {
        background-color: #2563eb;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourtesyNavComponent implements OnInit {
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);
  trialEndDate$!: Observable<Date>;

  ngOnInit() {
    this.trialEndDate$ = this.userProfileService.trialEndDate$;
  }

  navigateToPackages() {
    this.router.navigate(['/packages']);
  }
}
