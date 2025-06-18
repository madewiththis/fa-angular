import { Component } from '@angular/core';
import { TopMenuComponent } from '@components/landing/top-menu/top-menu';
import { HeroComponent } from '@components/landing/hero/hero';
import { FooterComponent } from '@components/landing/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopMenuComponent, HeroComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

}
