import { Component } from '@angular/core';
import { TopMenuComponent } from '@components/landing/top-menu/top-menu';
import { HeroComponent } from '@components/landing/hero/hero';
import { FooterComponent } from '@components/landing/footer/footer';
import { PricingTableComponent } from '@components/landing/pricing-table/pricing-table';
import { FeaturesSectionComponent } from '@components/landing/features-section/features-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TopMenuComponent,
    HeroComponent,
    PricingTableComponent,
    FooterComponent,
    FeaturesSectionComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

}
