import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from '../popup';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

interface Company {
  name: string;
}

@Component({
  selector: 'app-company-chooser',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    PopupComponent,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDividerModule,
  ],
  template: `
    <button mat-icon-button color="primary" #trigger (click)="togglePopup()" style="border-radius: 50%;">
      <mat-icon>domain</mat-icon>
    </button>
    <app-popup [trigger]="trigger._elementRef" #popup>
      <div class="company-chooser-container">
        <div class="search-wrapper">
          <mat-form-field appearance="outline">
            <mat-label>Search company</mat-label>
            <input matInput [(ngModel)]="searchText" (ngModelChange)="filterCompanies()" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        <mat-list>
          <mat-list-item class="active-company">
            <span>{{ activeCompany.name }}</span>
            <span class="spacer"></span>
            <mat-icon>check</mat-icon>
          </mat-list-item>
        </mat-list>
        <mat-divider></mat-divider>
        <mat-list role="list" class="company-list">
          <mat-list-item
            role="listitem"
            *ngFor="let company of visibleCompanies"
            (click)="selectCompany(company)"
          >
            <span>{{ company.name }}</span>
          </mat-list-item>
        </mat-list>
      </div>
    </app-popup>
  `,
  styles: [
    `
      button[mat-icon-button] {
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        width: 40px;
        height: 40px;
        margin: 0;
      }
      mat-icon {
        font-size: 22px;
        color: #333;
      }
      .company-chooser-container {
        min-width: 300px;
      }
      .search-wrapper {
        padding: 8px 16px;
      }
      .search-wrapper mat-form-field {
        width: 100%;
      }
      :host ::ng-deep .search-wrapper .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
      .active-company {
        font-weight: bold;
      }
      .active-company mat-icon {
        color: #007bff;
      }
      .company-list {
        max-height: 380px; /* approx 10 items */
        overflow-y: auto;
      }
      mat-list-item {
        cursor: pointer;
      }
      mat-list-item:hover {
        background: #f5f5f5;
      }
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class CompanyChooserComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent;
  @ViewChild('trigger', { read: ElementRef }) trigger!: ElementRef<HTMLButtonElement>;

  allCompanies: Company[] = [];
  visibleCompanies: Company[] = [];
  activeCompany: Company = { name: 'FlowAccount' };
  searchText = '';

  ngOnInit() {
    this.allCompanies = [
      { name: 'FlowAccount' },
      { name: 'FlowAccount (Thailand)' },
      ...Array.from({ length: 18 }, (_, i) => ({ name: `Company ${i + 3}` })),
    ];
    this.filterCompanies();
  }

  togglePopup() {
    if (this.popup) {
      this.popup.open();
    }
  }

  filterCompanies() {
    const otherCompanies = this.allCompanies.filter(
      (c) => c.name !== this.activeCompany.name
    );

    if (!this.searchText) {
      this.visibleCompanies = otherCompanies;
      return;
    }

    this.visibleCompanies = otherCompanies.filter((company) =>
      company.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectCompany(company: Company) {
    this.activeCompany = company;
    this.filterCompanies(); // to re-filter list without the new active company
    this.popup.close();
  }
}
