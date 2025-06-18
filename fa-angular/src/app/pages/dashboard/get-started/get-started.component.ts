import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetStartedSurveyComponent } from '../../../components/get-started-survey/get-started-survey.component';

@Component({
  selector: 'app-get-started',
  standalone: true,
  imports: [CommonModule, GetStartedSurveyComponent],
  template: `
    <div class="get-started-container">
      <app-get-started-survey></app-get-started-survey>
    </div>
  `,
  styles: [
    `
      .get-started-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 32px;
      }
    `,
  ],
})
export class GetStartedComponent {} 