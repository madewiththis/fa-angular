import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-footer-support',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="footer-support">
      <div class="contact-column">
        <h3>Contact Customer Service</h3>
        <a href="tel:020268989" class="contact-item">
          <mat-icon>phone</mat-icon> 02-026-8989
        </a>
        <a href="mailto:support@flowaccount.com" class="contact-item">
          <mat-icon>email</mat-icon> support&#64;flowaccount.com
        </a>
        <div class="working-hours">
          <p class="working-hours-title contact-item">
            <mat-icon>schedule</mat-icon> Working Hours:
          </p>
          <div class="working-hours-details">
            <p>Monday - Friday 08:00 - 22:00</p>
            <p>Saturday - Sunday and Holiday 09:00 - 20:00</p>
          </div>
        </div>
      </div>
      <div class="contact-column">
        <h3>Contact Sales</h3>
        <p>To schedule a free demonstration via video call.</p>
        <a href="tel:020268991" class="contact-item">
          <mat-icon>phone</mat-icon> 02-026-8991
        </a>
        <a href="mailto:demo@flowaccount.com" class="contact-item">
          <mat-icon>email</mat-icon> demo&#64;flowaccount.com
        </a>
        <div class="working-hours">
          <p class="working-hours-title contact-item">
            <mat-icon>schedule</mat-icon> Working Hours:
          </p>
          <div class="working-hours-details">
            <p>Everyday 09:00 - 18:00</p>
          </div>
        </div>
        <a href="#" class="message-link">Leave a Message</a>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        --icon-size: 18px;
        --icon-gap: 0.5rem;
      }
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
        font-size: 0.8rem;
      }
      .contact-column a.contact-item {
        margin: 0.25rem 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.8rem;
        text-decoration: none;
      }
      .contact-column a.contact-item:hover {
        text-decoration: underline;
        font-weight: 600;
      }
      .contact-item {
        display: flex;
        align-items: center;
        gap: var(--icon-gap);
      }
      .contact-item mat-icon {
        font-size: var(--icon-size);
        width: var(--icon-size);
        height: var(--icon-size);
      }
      .contact-column h3 {
        font-weight: bold;
        margin-bottom: 1rem;
        color: #fff;
        font-size: 0.9rem;
      }
      .contact-column .working-hours-title {
        font-weight: bold;
        margin-top: 1rem;
        color: #fff;
      }
      .working-hours-details {
        padding-left: calc(var(--icon-size) + var(--icon-gap));
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