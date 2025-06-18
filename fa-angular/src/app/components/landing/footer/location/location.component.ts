import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-footer-location',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="footer-location">
      <p>FlowAccount Co., Ltd.</p>
      <p>141/12 11th fl. Unit 12B Skulthai Surawong Tower Surawong Rd.</p>
      <p>Suriyawong, Bangrak, Bangkok, Thailand 10500</p>
      <p>Company Tax ID: 0105558096348</p>
      <p>
        <a href="https://goo.gl/maps/FHh3jQTjovv">
          <mat-icon>map</mat-icon>
          <span>View Map</span>
        </a>
      </p>
    </div>
  `,
  styles: [
    `
      .footer-location p {
        margin: 0.25rem 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.8rem;
      }

      .footer-location a {
        color: #fff;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .footer-location a:hover {
        text-decoration: underline;
      }

      h3 {
        font-weight: bold;
        margin-bottom: 1rem;
        color: #fff;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class LocationComponent {} 