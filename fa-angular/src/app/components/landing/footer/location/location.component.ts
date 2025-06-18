import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-footer-location',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="footer-location">
      <h3>Location</h3>
      <p>FlowAccount Co., Ltd.</p>
      <p>123/456 Some Building, 7th Floor</p>
      <p>Phayathai Rd., Ratchathewi</p>
      <p>Bangkok 10400</p>
    </div>
  `,
  styles: [
    `
      .footer-location {
        color: #fff;
      }
      h3 {
        font-weight: bold;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class LocationComponent {} 