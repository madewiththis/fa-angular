import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-footer-links',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="footer-links">
      <div class="link-column">
        <h3>Products</h3>
        <ul>
          <li><a href="#">FlowAccount</a></li>
          <li><a href="#">MobilePOS</a></li>
          <li><a href="#">Payroll</a></li>
          <li><a href="#">AutoKey</a></li>
        </ul>
        <h3>VAT and WHT Calculation</h3>
        <ul>
          <li><a href="#">VAT and WHT Calculation</a></li>
        </ul>
      </div>
      <div class="link-column">
        <h3>FlowAccount</h3>
        <ul>
          <li><a href="#">Features for Business Owners</a></li>
          <li><a href="#">Features for Accountants</a></li>
          <li><a href="#">Quotation</a></li>
          <li><a href="#">Receipt</a></li>
          <li><a href="#">FlowAccount Open API</a></li>
        </ul>
        <h3>Payroll</h3>
        <ul>
          <li><a href="#">Features for Business Owners</a></li>
        </ul>
        <h3>AutoKey</h3>
        <ul>
          <li><a href="#">Features for Business Owners</a></li>
          <li><a href="#">Features for Accountants</a></li>
        </ul>
      </div>
      <div class="link-column">
        <h3>Academy</h3>
        <ul>
          <li><a href="#">Seminars</a></li>
          <li><a href="#">Accounting Knowledge</a></li>
          <li><a href="#">Tutorials</a></li>
          <li><a href="#">FlowAccount Manual Guide</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
        <h3>About Us</h3>
        <ul>
          <li><a href="#">Become Our Partner</a></li>
          <li><a href="#">About FlowAccount</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">We're hiring!</a></li>
          <li><a href="#">Terms of use</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
        <h3>Find an Accountant</h3>
        <ul>
            <li><a href="#">Find an Accountant</a></li>
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      .footer-links {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
      }
      .link-column {
        display: flex;
        flex-direction: column;
      }
      h3 {
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: #fff;
        font-size: 0.9rem;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      li {
        margin-bottom: 0.2rem;
      }
      a {
        text-decoration: none;
        color: #fff;
        font-size: 0.8rem;
      }
      a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class LinksComponent {} 