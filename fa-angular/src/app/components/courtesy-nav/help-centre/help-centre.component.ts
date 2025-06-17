import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from '../popup';

@Component({
  selector: 'app-help-centre',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, PopupComponent],
  template: `
    <button mat-icon-button color="primary" #trigger (click)="togglePopup()" style="border-radius: 50%;">
      <mat-icon>question_mark</mat-icon>
    </button>
    <app-popup [trigger]="trigger._elementRef" #popup>
      <div style="padding: 16px; min-width: 180px;">Help Centre menu placeholder</div>
    </app-popup>
  `,
  styles: [`
    button[mat-icon-button] {
      background: #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      width: 40px;
      height: 40px;
      margin: 0;
    }
    mat-icon {
      font-size: 22px;
      color: #333;
    }
  `]
})
export class HelpCentreComponent {
  @ViewChild('popup') popup!: PopupComponent;
  @ViewChild('trigger', { read: ElementRef }) trigger!: ElementRef<HTMLButtonElement>;

  togglePopup() {
    if (this.popup) {
      this.popup.open();
    }
  }
}
