import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBentoComponent } from './hero-bento/hero-bento.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, HeroBentoComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  host: {
    class: 'landing-content'
  }
})
export class HeroComponent {

}
