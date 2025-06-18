import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-footer-support',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="footer-support">
      <div class="contact-column">
        <h3>Contact Customer Service</h3>
        <p>020268989</p>
        <p>support&#64;flowaccount.com</p>
        <p class="working-hours-title">Working Hours:</p>
        <p>Monday - Friday 08:00 - 22:00</p>
        <p>Saturday - Sunday and Holiday 09:00 - 20:00</p>
      </div>
      <div class="contact-column">
        <h3>Contact Sales</h3>
        <p>To schedule a free demonstration via video call.</p>
        <p>020268991</p>
        <p>demo&#64;flowaccount.com</p>
        <p class="working-hours-title">Working Hours:</p>
        <p>Everyday 09:00 - 18:00</p>
        <a href="#" class="message-link">Leave a Message</a>
      </div>
    </div>
  `,
  styles: [
    `
      .footer-support {
        color: #fff;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        padding-top: 2rem;
        display: flex;
        justify-content: space-between;
        gap: 2rem;
      }
      .contact-column p {
        margin: 0.25rem 0;
        color: rgba(255, 255, 255, 0.8);
      }
      .contact-column h3 {
        font-weight: bold;
        margin-bottom: 1rem;
        color: #fff;
      }
      .working-hours-title {
        font-weight: bold;
        margin-top: 1rem;
        color: #fff !important;
      }
      .message-link {
        display: inline-block;
        margin-top: 1rem;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        text-decoration: none;
      }
    `,
  ],
})
export class SupportComponent {} 