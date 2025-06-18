import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourtesyNavComponent implements OnInit {
  private userProfileService = inject(UserProfileService);
  trialEndDate$!: Observable<Date>;

  ngOnInit() {
    this.trialEndDate$ = this.userProfileService.trialEndDate$;
  }
}
