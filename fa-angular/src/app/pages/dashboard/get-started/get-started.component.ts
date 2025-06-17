import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-get-started',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="get-started-container">
      <div class="updates-section">
        <h2>Recent Updates</h2>
        <ul>
          <li><strong>New Dashboard:</strong> We've launched a brand new dashboard to provide you with a better overview of your business.</li>
          <li><strong>Sales Visualisation:</strong> You can now visualise your sales data by customer, product, or salesperson.</li>
          <li><strong>Accounts Receivable:</strong> Easily track the money coming into your business.</li>
          <li><strong>Accounts Payable:</strong> Keep an eye on the bills you need to pay.</li>
        </ul>
      </div>
      <div class="learning-section">
        <h2>Learn How to Use the App</h2>
        <p>Placeholder for learning resources, tutorials, and guides.</p>
        <button>Explore Learning Center</button>
      </div>
    </div>
  `,
  styles: [
    `
      .get-started-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 32px;
      }

      @media (min-width: 768px) {
        .get-started-container {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .updates-section, .learning-section {
        background: #fff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      h2 {
        margin: 0 0 16px;
        color: #1f2937;
      }

      ul {
        padding-left: 20px;
        margin: 0;
        color: #374151;
      }

      li {
        margin-bottom: 12px;
      }

      p {
        color: #374151;
      }

      button {
        background-color: #3b82f6;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      button:hover {
        background-color: #2563eb;
      }
    `,
  ],
})
export class GetStartedComponent {} 