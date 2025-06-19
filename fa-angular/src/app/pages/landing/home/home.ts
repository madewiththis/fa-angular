import { Component } from '@angular/core';
import { TopMenuComponent } from '@components/landing/top-menu/top-menu';
import { HeroComponent } from '@components/landing/hero/hero';
import { FooterComponent } from '@components/landing/footer/footer';
import { PricingTableComponent } from '@components/landing/pricing-table/pricing-table';
import { FeaturesSectionComponent } from '@components/landing/features-section/features-section.component';
import { SupportLearningComponent } from '@components/landing/support-learning/support-learning.component';
import { IntegrationsComponent } from '@components/landing/integrations/integrations.component';
import { SocialProofComponent } from '@components/landing/social-proof/social-proof.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TopMenuComponent,
    HeroComponent,
    FeaturesSectionComponent,
    SupportLearningComponent,
    IntegrationsComponent,
    SocialProofComponent,
    PricingTableComponent,
    FooterComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

}
