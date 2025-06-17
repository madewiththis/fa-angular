import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from '../popup';

@Component({
  selector: 'app-language-chooser',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, PopupComponent],
  template: `
    <button mat-icon-button color="primary" #trigger (click)="togglePopup()" style="border-radius: 50%;">
      <mat-icon>translate</mat-icon>
    </button>
    <app-popup [trigger]="trigger._elementRef" #popup>
      <div class="language-buttons">
        <button class="lang-btn active">English</button>
        <button class="lang-btn">ไทย</button>
      </div>
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
    .language-buttons {
      display: flex;
      justify-content: center;
      gap: 12px;
      //margin-bottom: 12px;
    }
    .lang-btn {
      border: none;
      border-radius: 999px;
      padding: 8px 20px;
      background: transparent;
      color: #222;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .lang-btn.active {
      background: #222;
      color: #fff;
    }
    .lang-btn:not(.active):hover {
      background: #eee;
    }
  `]
})
export class LanguageChooserComponent {
  @ViewChild('popup') popup!: PopupComponent;
  @ViewChild('trigger', { read: ElementRef }) trigger!: ElementRef<HTMLButtonElement>;

  togglePopup() {
    if (this.popup) {
      this.popup.open();
    }
  }
}
