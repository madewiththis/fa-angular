import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksComponent } from './links/links.component';
import { SupportComponent } from './support/support.component';
import { LocationComponent } from './location/location.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LinksComponent, SupportComponent, LocationComponent],
  template: `
    <footer class="footer-background">
      <div class="footer-content">
        <app-landing-footer-links></app-landing-footer-links>
        <app-landing-footer-support></app-landing-footer-support>
        <app-landing-footer-location class="footer-location"></app-landing-footer-location>
        <div class="footer-copyright">
          <p>Copyright &copy; 2025 FlowAccount Co., Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer-background {
        background-color: rgba(0, 145, 219, 1);
        color: #fff;
        padding: 2rem 0;
      }
      
      .footer-content {
        width: 64rem;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .footer-location {
        align-self: flex-end;
      }

      .footer-copyright {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem 0;
        border: 0px solid #e5e7eb;
        margin-top: 2rem;
        font-size: 0.8rem;
      }

      .awards {
        display: flex;
        gap: 1rem;
      }

      .awards img {
        height: 40px;
      }
    `,
  ],
  host: {
    class: 'landing-content'
  }
})
export class FooterComponent {}
