import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroImageComponent } from './hero-image/hero-image.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, HeroImageComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  host: {
    class: 'landing-content'
  }
})
export class HeroComponent {

}
