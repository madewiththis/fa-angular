import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyChooserComponent } from './company-chooser/company-chooser.component';
import { LanguageChooserComponent } from './language-chooser/language-chooser.component';
import { HelpCentreComponent } from './help-centre/help-centre.component';

@Component({
  selector: 'app-courtesy-nav',
  standalone: true,
  imports: [
    CommonModule,
    CompanyChooserComponent,
    LanguageChooserComponent,
    HelpCentreComponent
  ],
  template: `
    <nav class="courtesy-nav">
      <div class="courtesy-nav-container">
        <!-- Company Dropdown -->
        <app-company-chooser />
        
        <!-- Language Dropdown -->
        <app-language-chooser />
        
        <!-- Help Centre Button -->
        <app-help-centre />  
      </div>
    </nav>
  `,
  styles: [`
    .courtesy-nav {
      position: fixed;
      top: 0;
      left: 100px; /* Start after the main menu */
      right: 0;
      height: 60px;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20px;
      pointer-events: none; /* Allow clicks to pass through except for nav items */
    }
    
    .courtesy-nav-container {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 100%;
    }
    
    /* Ensure the nav doesn't interfere with pointer events on the main content */
    .courtesy-nav {
      pointer-events: auto;
    }
    
    /* Make sure dropdowns and buttons work properly */
    .courtesy-nav-container > * {
      pointer-events: auto;
    }
  `]
})
export class CourtesyNavComponent {}
