import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/*
 * FLOWACCOUNT DOCUMENT TYPES MAPPING
 * 
 * Sales transaction document types vary based on VAT registration status:
 * 
 * VAT REGISTERED:
 * ===============
 * Cash Sale:
 *   • Quotation
 *   • Billing Note/Invoice
 *   • Tax Invoice/Receipt
 *   • Tax Invoice/Receipt (Cash)
 * 
 * Credit Sale:
 *   • Quotation
 *   • Billing Note/Invoice
 *   • Delivery Note/Tax Invoice
 *   • Receipt
 * 
 * Cash & Credit Sale:
 *   • Quotation
 *   • Billing Note
 *   • Delivery Note/Invoice/Tax Invoice
 *   • Receipt
 *   • Tax Invoice/Receipt (Cash)
 * 
 * NO VAT:
 * =======
 * Cash Sale:
 *   • Quotation
 *   • Billing Note
 *   • Receipt
 *   • Receipt (Cash)
 * 
 * Credit Sale:
 *   • Quotation
 *   • Billing Note
 *   • Invoice
 *   • Receipt
 * 
 * Cash & Credit Sale:
 *   • Quotation
 *   • Billing Note
 *   • Invoice
 *   • Receipt
 *   • Receipt (Cash)
 */

export interface CompanySetupData {
  // Business Information
  businessName: string;
  address: string;
  taxId: string;
  businessContactNo: string;
  
  // Business Type Selection
  businessType: 'corporate' | 'personal';
  
  // VAT Registration
  vatRegistered: 'registered' | 'not_registered';
  
  // Sales Transaction Type
  salesTransactionType: 'cash' | 'credit' | 'both';
  
  // Company Logo
  logoFile?: File;
  logoUrl?: string;
}

@Component({
  selector: 'app-company-setup-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="company-setup-modal">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2 mat-dialog-title>Let's make your documents look professional</h2>
        <button mat-icon-button mat-dialog-close class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Modal Content - Two Column Layout -->
      <mat-dialog-content class="modal-content">
        <div class="two-column-layout">
          <!-- Left Column - Form -->
          <div class="form-column">
            <!-- Upload Company Logo Section -->
            <div class="section logo-section">
              <div class="logo-row">
                <div class="logo-label">
                  <span class="section-title">Company Logo</span>
                  <span class="logo-optional">(optional)</span>
                </div>
                
                <div class="compact-logo-upload" 
                     (click)="addDemoLogo()"
                     (mouseenter)="setHoveredSection('logo')"
                     (mouseleave)="setHoveredSection(null)">
                  <div class="logo-upload-compact" *ngIf="!logoUrl">
                    <mat-icon class="upload-icon-small">add</mat-icon>
                    <span class="upload-text-small">Add Logo</span>
                  </div>
                  <div class="logo-preview-compact" *ngIf="logoUrl">
                    <span class="logo-emoji" *ngIf="isEmojiLogo">{{ logoUrl }}</span>
                    <img *ngIf="!isEmojiLogo" [src]="logoUrl" alt="Company Logo" class="logo-image-compact">
                  </div>
                </div>
              </div>
            </div>

            <!-- Business Type Section -->
            <div class="section">
              <div class="form-row">
                <div class="field-label">
                  Business Type <span class="info-icon" title="Business Type">ⓘ</span>
                </div>
                
                <div class="business-type-options">
                  <div class="business-type-card" 
                       [class.selected]="businessType === 'corporate'"
                       (click)="businessType = 'corporate'"
                       (mouseenter)="setHoveredSection('businessInfo')"
                       (mouseleave)="setHoveredSection(null)">
                    <input 
                      type="radio" 
                      name="businessType" 
                      value="corporate"
                      [(ngModel)]="businessType"
                      style="display: none;"
                    >
                    <div class="card-icon">
                      <mat-icon>business</mat-icon>
                    </div>
                    <div class="card-label">Corporate</div>
                    <!-- Description: One or more than one person setting their business up as organization and legally present as business entity such as corporation or registered partnership. -->
                  </div>

                  <div class="business-type-card" 
                       [class.selected]="businessType === 'personal'"
                       (click)="businessType = 'personal'"
                       (mouseenter)="setHoveredSection('businessInfo')"
                       (mouseleave)="setHoveredSection(null)">
                    <input 
                      type="radio" 
                      name="businessType" 
                      value="personal"
                      [(ngModel)]="businessType"
                      style="display: none;"
                    >
                    <div class="card-icon">
                      <mat-icon>person</mat-icon>
                    </div>
                    <div class="card-label">Personal/Freelance</div>
                    <!-- Description: One or more than one person setting their business up as self-employed as well as ordinary partnership but not legally presented as juristic person or company. -->
                  </div>
                </div>
              </div>
            </div>

            <!-- Business Information Section -->
            <div class="section">
              <h3 class="section-title">Business Information</h3>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width"
                               (mouseenter)="setHoveredSection('businessName')"
                               (mouseleave)="setHoveredSection(null)">
                  <!-- Business Name Info: For Company Limited: FlowAccount Co., Ltd. For Partnership Limited: FlowAccount Ltd. -->
                  <mat-label>{{ getBusinessNameLabel() }} <span class="info-icon" title="{{ getBusinessNameLabel() }}">ⓘ</span></mat-label>
                  <input 
                    matInput 
                    [(ngModel)]="businessName"
                    [placeholder]="getBusinessNameLabel()"
                  >
                </mat-form-field>
              </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width"
                           (mouseenter)="setHoveredSection('address')"
                           (mouseleave)="setHoveredSection(null)">
              <mat-label>Address:</mat-label>
              <textarea 
                matInput 
                [(ngModel)]="address"
                placeholder="Address"
                rows="3"
              ></textarea>
            </mat-form-field>
          </div>

          <div class="form-row tax-id-row">
            <mat-form-field appearance="outline" class="tax-id-field"
                           (mouseenter)="setHoveredSection('taxId')"
                           (mouseleave)="setHoveredSection(null)">
              <mat-label>{{ getTaxIdLabel() }}:</mat-label>
              <input 
                matInput 
                [(ngModel)]="taxId"
                [placeholder]="getTaxIdPlaceholder()"
              >
            </mat-form-field>
            <div class="vat-toggle-container"
                 (mouseenter)="setHoveredSection('vat')"
                 (mouseleave)="setHoveredSection(null)">
              <mat-slide-toggle 
                [(ngModel)]="vatToggle"
                color="primary"
                class="vat-toggle">
                VAT
              </mat-slide-toggle>
            </div>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width"
                           (mouseenter)="setHoveredSection('contact')"
                           (mouseleave)="setHoveredSection(null)">
              <mat-label>Business Contact No.:</mat-label>
              <input 
                matInput 
                [(ngModel)]="businessContactNo"
                placeholder="Business Contact Number"
              >
            </mat-form-field>
          </div>
            </div>

        <!-- Sales Transaction Type Section -->
        <div class="section">
          <h3 class="section-title">How do you get paid by your customers? <span class="info-icon" title="Choose how your customers typically pay you. We'll set up the right documents for your business.">ⓘ</span></h3>
          
          <div class="payment-method-layout">
            <!-- Left Column - Options -->
            <div class="payment-options-column">
              <button class="payment-option-btn" 
                      [class.selected]="salesTransactionType === 'cash'"
                      (click)="salesTransactionType = 'cash'"
                      (mouseenter)="setHoveredSection('transaction'); hoveredPaymentMethod.set('cash')"
                      (mouseleave)="setHoveredSection(null); hoveredPaymentMethod.set(null)">
                <mat-icon>payments</mat-icon>
                <span>Get paid immediately</span>
              </button>
              
              <button class="payment-option-btn" 
                      [class.selected]="salesTransactionType === 'credit'"
                      (click)="salesTransactionType = 'credit'"
                      (mouseenter)="setHoveredSection('transaction'); hoveredPaymentMethod.set('credit')"
                      (mouseleave)="setHoveredSection(null); hoveredPaymentMethod.set(null)">
                <mat-icon>description</mat-icon>
                <span>Send invoices</span>
              </button>
              
              <button class="payment-option-btn" 
                      [class.selected]="salesTransactionType === 'both'"
                      (click)="salesTransactionType = 'both'"
                      (mouseenter)="setHoveredSection('transaction'); hoveredPaymentMethod.set('both')"
                      (mouseleave)="setHoveredSection(null); hoveredPaymentMethod.set(null)">
                <mat-icon>sync</mat-icon>
                <span>Both ways</span>
              </button>
            </div>
            
            <!-- Right Column - Details -->
            <div class="payment-details-column">
              <div class="payment-details" *ngIf="getActivePaymentMethod() === 'cash'">
                <div class="detail-subtitle">(Cash sale only)</div>
                <div class="detail-description">You receive payment when you deliver your service or product</div>
                <div class="detail-examples"><strong>Examples:</strong> Restaurants, retail stores, freelancers</div>
              </div>
              
              <div class="payment-details" *ngIf="getActivePaymentMethod() === 'credit'">
                <div class="detail-subtitle">(Credit sale)</div>
                <div class="detail-description">You send bills to customers and they pay you later</div>
                <div class="detail-examples"><strong>Examples:</strong> Consultants, contractors, B2B services</div>
              </div>
              
              <div class="payment-details" *ngIf="getActivePaymentMethod() === 'both'">
                <div class="detail-subtitle">(Cash and credit sale)</div>
                <div class="detail-description">Some customers pay immediately, others pay later</div>
                <div class="detail-examples"><strong>Examples:</strong> Mixed business models, different customer types</div>
              </div>
              
              <div class="payment-details placeholder" *ngIf="!getActivePaymentMethod()">
                <div class="detail-description">Choose a payment method to see details</div>
              </div>
            </div>
          </div>
        </div>

          </div>

          <!-- Right Column - Document Preview -->
          <div class="preview-column">
            <div class="document-preview">
              <h3 class="preview-title">Your {{ getDocumentTypeTitle() }} Preview</h3>
              <div class="invoice-container" [class.has-hover]="hoveredSection() !== null">
                <!-- FlowAccount Header -->
                <div class="invoice-header">
                  <div class="company-logo-area" [class.glow-section]="isHovered('logo')">
                    <div *ngIf="!logoUrl" class="logo-placeholder">Your Logo</div>
                    <span *ngIf="logoUrl && isEmojiLogo" class="company-logo-emoji">{{ logoUrl }}</span>
                    <img *ngIf="logoUrl && !isEmojiLogo" [src]="logoUrl" alt="Company Logo" class="company-logo">
                  </div>
                  <div class="flowaccount-branding" [class.glow-section]="isHovered('transaction')">
                    <div class="fa-logo">FLOWACCOUNT.COM</div>
                    <div class="invoice-title" [innerHTML]="getDocumentHeaderText()"></div>
                  </div>
                </div>

                <!-- Company Information -->
                <div class="company-info-section">
                  <div class="company-details">
                    <div class="company-name" [class.glow-section]="isHovered('businessName') || isHovered('businessInfo')">{{ businessName || 'Your Business Name' }}</div>
                    <div class="company-address" [class.glow-section]="isHovered('address')">{{ address || 'Your Business Address' }}</div>
                    <div class="company-contact" [class.glow-section]="isHovered('taxId')">เลขที่ผู้เสียภาษี: {{ taxId || 'Tax ID Number' }}</div>
                    <div class="company-phone" [class.glow-section]="isHovered('contact')">โทรศัพท์: {{ businessContactNo || 'Phone Number' }}</div>
                  </div>
                  <div class="invoice-details">
                    <div>เลขที่: INV2024-001</div>
                    <div>วันที่: {{ getCurrentDate() }}</div>
                    <div>ครบกำหนด: {{ getDueDate() }}</div>
                  </div>
                </div>

                <!-- Sample Line Items -->
                <div class="line-items">
                  <table class="items-table">
                    <thead>
                      <tr>
                        <th>รายการ</th>
                        <th>จำนวน</th>
                        <th>ราคาต่อหน่วย</th>
                        <th>จำนวนเงิน</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Web Design Services</td>
                        <td>1</td>
                        <td>50,000.00</td>
                        <td>50,000.00</td>
                      </tr>
                      <tr>
                        <td>Consulting Services</td>
                        <td>10</td>
                        <td>2,500.00</td>
                        <td>25,000.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Totals -->
                <div class="totals-section">
                  <div class="totals">
                    <div class="total-line">
                      <span>รวมเงิน:</span>
                      <span>75,000.00 บาท</span>
                    </div>
                    <div class="total-line" *ngIf="vatToggle" [class.glow-section]="isHovered('vat')">
                      <span>ภาษีมูลค่าเพิ่ม 7%:</span>
                      <span>5,250.00 บาท</span>
                    </div>
                    <div class="total-line grand-total">
                      <span>รวมทั้งสิ้น:</span>
                      <span>{{ vatToggle ? '80,250.00' : '75,000.00' }} บาท</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Available Documents -->
            <div class="available-documents">
              <h4 class="docs-list-title">Available documents for your business setup:</h4>
              <div class="mini-documents">
                <div 
                  *ngFor="let docType of getAvailableDocumentNames()" 
                  class="mini-doc"
                  [title]="docType"
                >
                  <div class="mini-doc-page">
                    <div class="mini-doc-lines">
                      <div class="line"></div>
                      <div class="line"></div>
                      <div class="line short"></div>
                    </div>
                  </div>
                  <div class="mini-doc-label">{{ getShortDocName(docType) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <!-- Modal Actions -->
      <mat-dialog-actions class="modal-actions">
        <button mat-raised-button color="primary" class="get-started-btn" (click)="onGetStarted()">
          Get Started
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .company-setup-modal {
      width: 80vw;
      height: 80vh;
      max-width: none;
      max-height: none;
      display: flex;
      flex-direction: column;
    }

    /* Modal Header */
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 400;
      color: #52b6ea;
    }

    .close-btn {
      color: #9ca3af;
      width: 24px;
      height: 24px;
    }

    .close-btn:hover {
      color: #6b7280;
    }

    /* Modal Content */
    .modal-content {
      flex: 1;
      overflow: hidden;
      padding: 0;
    }

    /* Two Column Layout */
    .two-column-layout {
      display: flex;
      height: 100%;
      gap: 0;
    }

    .form-column {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background: #fafafa;
      border-right: 1px solid #e5e7eb;
    }

    .preview-column {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background: white;
      display: flex;
      flex-direction: column;
    }

    /* Sections */
    .section {
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 0.9rem;
      font-weight: 400;
      color: #52b6ea;
      margin: 0 0 8px;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 400;
      color: #374151;
      margin-bottom: 6px;
    }

    .info-icon {
      color: #52b6ea;
      font-size: 0.75rem;
      margin-left: 2px;
    }

    /* Compact Logo Upload Section */
    .logo-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .logo-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-optional {
      font-size: 0.75rem;
      color: #9ca3af;
      font-weight: 400;
    }

    .compact-logo-upload {
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .compact-logo-upload:hover {
      transform: scale(1.05);
    }

    .logo-upload-compact {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: 1px dashed #d1d5db;
      border-radius: 6px;
      background: #fafafa;
      transition: border-color 0.2s ease;
    }

    .logo-upload-compact:hover {
      border-color: #52b6ea;
    }

    .upload-icon-small {
      font-size: 16px;
      color: #52b6ea;
    }

    .upload-text-small {
      font-size: 0.75rem;
      color: #52b6ea;
      font-weight: 500;
    }

    .logo-preview-compact {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: white;
      min-width: 80px;
      min-height: 32px;
    }

    .logo-emoji {
      font-size: 18px;
    }

    .logo-image-compact {
      max-width: 60px;
      max-height: 24px;
      object-fit: contain;
    }

    /* Form Fields */
    .form-row {
      margin-bottom: 8px;
    }

    .full-width {
      width: 100%;
    }

    .full-width ::ng-deep .mat-mdc-form-field-wrapper {
      padding-bottom: 0;
      font-size: 0.85rem;
    }

    .full-width ::ng-deep .mat-mdc-form-field-underline {
      bottom: 0;
    }

    .full-width ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .full-width ::ng-deep .mat-mdc-text-field-wrapper {
      min-height: 42px;
    }

    .full-width ::ng-deep .mat-mdc-form-field-infix {
      min-height: 32px;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    /* Tax ID Row with VAT Toggle */
    .tax-id-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .tax-id-field {
      flex: 1;
    }

    .vat-toggle-container {
      display: flex;
      align-items: center;
      min-width: 100px;
    }

    .vat-toggle {
      transform: scale(0.85);
    }

    .vat-toggle ::ng-deep .mat-slide-toggle-label {
      font-size: 0.8rem;
      color: #374151;
    }

    /* Business Type Cards */
    .business-type-options {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .business-type-card {
      flex: 1;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .business-type-card:hover {
      border-color: #52b6ea;
    }

    .business-type-card.selected {
      border-color: #52b6ea;
      background-color: #eff6ff;
    }

    .business-type-card .card-icon {
      margin-bottom: 2px;
    }

    .business-type-card .card-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #52b6ea;
    }

    .business-type-card .card-label {
      font-weight: 400;
      font-size: 0.75rem;
      color: #374151;
    }

    /* Payment Method Layout */
    .payment-method-layout {
      display: flex;
      gap: 12px;
      min-height: 120px;
    }

    .payment-options-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .payment-details-column {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      min-height: 108px;
    }

    .payment-option-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.8rem;
      color: #374151;
      text-align: left;
    }

    .payment-option-btn:hover {
      border-color: #52b6ea;
      background: #f0f9ff;
    }

    .payment-option-btn.selected {
      border-color: #52b6ea;
      background: #eff6ff;
      color: #1e40af;
    }

    .payment-option-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #52b6ea;
    }

    .payment-details {
      opacity: 1;
      transition: opacity 0.2s ease;
    }

    .payment-details.placeholder {
      opacity: 0.6;
      font-style: italic;
    }

    .detail-subtitle {
      font-size: 0.7rem;
      color: #9ca3af;
      font-weight: 500;
      margin-bottom: 6px;
    }

    .detail-description {
      font-size: 0.8rem;
      color: #4b5563;
      font-weight: 500;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .detail-examples {
      font-size: 0.7rem;
      color: #6b7280;
      line-height: 1.4;
    }

    .detail-examples strong {
      font-weight: 600;
      color: #374151;
    }

    /* Settings Notice */
    .settings-notice {
      display: flex;
      align-items: center;
      background: #eff6ff;
      border: 1px solid #52b6ea;
      border-radius: 4px;
      padding: 8px 12px;
      margin-bottom: 16px;
    }

    .notice-icon {
      color: #52b6ea;
      margin-right: 6px;
      font-size: 16px;
    }

    .settings-notice span {
      font-size: 0.75rem;
      color: #1e40af;
    }


    /* Modal Actions */
    .modal-actions {
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
      justify-content: flex-end;
    }

    .get-started-btn {
      background: #52b6ea;
      color: white;
      padding: 8px 16px;
      font-weight: 400;
      font-size: 0.875rem;
      border-radius: 4px;
    }

    .get-started-btn:hover {
      background: #3b9bd9;
    }

    /* Document Preview Styles */
    .document-preview {
      flex: 0 0 auto;
    }

    .preview-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px;
      text-align: center;
    }

    .invoice-container {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      font-size: 0.875rem;
      max-width: 100%;
    }

    /* Invoice Header */
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .company-logo-area {
      width: 80px;
      height: 60px;
    }

    .logo-placeholder {
      width: 80px;
      height: 60px;
      border: 2px dashed #d1d5db;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: #9ca3af;
      border-radius: 4px;
    }

    .company-logo {
      max-width: 80px;
      max-height: 60px;
      object-fit: contain;
    }

    .company-logo-emoji {
      font-size: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 60px;
    }

    .flowaccount-branding {
      text-align: right;
    }

    .fa-logo {
      color: #52b6ea;
      font-weight: bold;
      font-size: 0.875rem;
      margin-bottom: 4px;
    }

    .invoice-title {
      font-size: 0.8rem;
      color: #374151;
      line-height: 1.2;
    }

    /* Company Information */
    .company-info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 0.8rem;
    }

    .company-details {
      flex: 1;
    }

    .company-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .company-address,
    .company-contact,
    .company-phone {
      color: #6b7280;
      margin-bottom: 2px;
    }

    .invoice-details {
      text-align: right;
      color: #374151;
    }

    .invoice-details div {
      margin-bottom: 2px;
    }

    /* Line Items Table */
    .line-items {
      margin-bottom: 20px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.75rem;
    }

    .items-table th {
      background: #f8fafc;
      padding: 8px;
      text-align: left;
      border: 1px solid #e5e7eb;
      font-weight: 600;
      color: #374151;
    }

    .items-table td {
      padding: 8px;
      border: 1px solid #e5e7eb;
      color: #6b7280;
    }

    .items-table td:nth-child(2),
    .items-table td:nth-child(3),
    .items-table td:nth-child(4) {
      text-align: right;
    }

    /* Totals Section */
    .totals-section {
      display: flex;
      justify-content: flex-end;
    }

    .totals {
      min-width: 200px;
    }

    .total-line {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 0.8rem;
      color: #374151;
    }

    .grand-total {
      border-top: 1px solid #e5e7eb;
      padding-top: 8px;
      margin-top: 4px;
      font-weight: 600;
      color: #1f2937;
    }

    /* Interactive Glow Effects */
    
    /* Dimming effect for non-highlighted content */
    .invoice-container.has-hover > *:not(.glow-section) {
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }

    .invoice-container.has-hover .invoice-header > *:not(.glow-section),
    .invoice-container.has-hover .company-info-section > div > *:not(.glow-section),
    .invoice-container.has-hover .line-items,
    .invoice-container.has-hover .totals-section .total-line:not(.glow-section) {
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }

    /* Keep glowing sections fully visible */
    .invoice-container.has-hover .glow-section {
      opacity: 1 !important;
    }

    .glow-section {
      position: relative;
      transition: all 0.3s ease;
      z-index: 1;
    }

    .glow-section::before {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(16, 185, 129, 0.4));
      border-radius: 8px;
      z-index: -1;
      opacity: 1;
      filter: blur(8px);
      animation: glowPulse 2s ease-in-out infinite;
    }

    .glow-section::after {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 6px;
      z-index: -1;
      box-shadow: 
        0 0 20px rgba(59, 130, 246, 0.6),
        0 0 40px rgba(59, 130, 246, 0.4),
        inset 0 0 10px rgba(255, 255, 255, 0.8);
    }

    @keyframes glowPulse {
      0%, 100% {
        transform: scale(1);
        filter: blur(8px);
      }
      50% {
        transform: scale(1.05);
        filter: blur(10px);
      }
    }

    /* Enhanced glow for specific sections */
    .company-logo-area.glow-section::before {
      background: linear-gradient(45deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.4));
      filter: blur(12px);
    }

    .company-logo-area.glow-section::after {
      box-shadow: 
        0 0 25px rgba(59, 130, 246, 0.7),
        0 0 45px rgba(147, 51, 234, 0.4),
        inset 0 0 15px rgba(255, 255, 255, 0.9);
    }

    .flowaccount-branding.glow-section::before {
      background: linear-gradient(45deg, rgba(16, 185, 129, 0.5), rgba(59, 130, 246, 0.4));
      filter: blur(12px);
    }

    .flowaccount-branding.glow-section::after {
      box-shadow: 
        0 0 25px rgba(16, 185, 129, 0.7),
        0 0 45px rgba(59, 130, 246, 0.4),
        inset 0 0 15px rgba(255, 255, 255, 0.9);
    }

    .company-name.glow-section {
      font-weight: 700;
      color: #1e40af !important;
      transform: scale(1.02);
    }

    .company-address.glow-section,
    .company-contact.glow-section,
    .company-phone.glow-section {
      color: #059669 !important;
      font-weight: 600;
      transform: scale(1.01);
    }

    .total-line.glow-section {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.1));
      padding: 8px 12px;
      border-radius: 6px;
      font-weight: 700;
      color: #059669 !important;
      box-shadow: 
        0 0 15px rgba(16, 185, 129, 0.3),
        inset 0 0 10px rgba(255, 255, 255, 0.5);
    }

    /* Available Documents */
    .available-documents {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }

    .docs-list-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 10px;
    }

    .mini-documents {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .mini-doc {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
    }

    .mini-doc-page {
      width: 70px;
      height: 90px;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .mini-doc-page::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 15px;
      height: 15px;
      background: linear-gradient(-45deg, transparent 50%, #f3f4f6 50%);
      border-left: 1px solid #d1d5db;
      border-bottom: 1px solid #d1d5db;
    }

    .mini-doc-lines {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-top: 8px;
    }

    .line {
      height: 2px;
      background: #d1d5db;
      border-radius: 1px;
    }

    .line:nth-child(1) {
      width: 100%;
    }

    .line:nth-child(2) {
      width: 85%;
    }

    .line.short {
      width: 60%;
    }

    .mini-doc-label {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
      text-align: center;
      max-width: 80px;
      line-height: 1.2;
      word-wrap: break-word;
      hyphens: auto;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .company-setup-modal {
        width: 95vw;
        height: 95vh;
      }

      .two-column-layout {
        flex-direction: column;
      }

      .form-column,
      .preview-column {
        flex: none;
      }

      .form-column {
        border-right: none;
        border-bottom: 1px solid #e5e7eb;
        max-height: 50vh;
      }

      .preview-column {
        max-height: 45vh;
      }

      .business-type-options {
        flex-direction: column;
      }

      .payment-method-layout {
        flex-direction: column;
        min-height: auto;
      }

      .payment-options-column {
        flex-direction: row;
      }

      .payment-option-btn {
        flex: 1;
        font-size: 0.7rem;
        padding: 8px;
      }

      .section {
        margin-bottom: 20px;
      }

      .invoice-container {
        padding: 12px;
        font-size: 0.75rem;
      }

      .items-table {
        font-size: 0.7rem;
      }
    }
  `]
})
export class CompanySetupModalComponent {
  private dialogRef = inject(MatDialogRef<CompanySetupModalComponent>);

  // Form data
  private _companyData = signal<CompanySetupData>({
    businessName: "Kim's Candy",
    address: '',
    taxId: '',
    businessContactNo: '0923622276',
    businessType: 'personal',
    vatRegistered: 'registered',
    salesTransactionType: 'both'
  });

  // Interactive hover state tracking
  protected hoveredSection = signal<string | null>(null);
  
  // Document preview state
  protected selectedDocumentType = signal<string>('tax-invoice');
  
  // Payment method hover state
  protected hoveredPaymentMethod = signal<string | null>(null);
  
  // Getter methods for template access
  get companyData() { return this._companyData(); }
  
  // Individual property getters and setters for two-way binding
  get businessName() { return this._companyData().businessName; }
  set businessName(value: string) { 
    this._companyData.update(data => ({ ...data, businessName: value })); 
  }
  
  get address() { return this._companyData().address; }
  set address(value: string) { 
    this._companyData.update(data => ({ ...data, address: value })); 
  }
  
  get taxId() { return this._companyData().taxId; }
  set taxId(value: string) { 
    this._companyData.update(data => ({ ...data, taxId: value })); 
  }
  
  get businessContactNo() { return this._companyData().businessContactNo; }
  set businessContactNo(value: string) { 
    this._companyData.update(data => ({ ...data, businessContactNo: value })); 
  }
  
  get businessType() { return this._companyData().businessType; }
  set businessType(value: 'corporate' | 'personal') { 
    this._companyData.update(data => ({ ...data, businessType: value })); 
  }
  
  get vatRegistered() { return this._companyData().vatRegistered; }
  set vatRegistered(value: 'registered' | 'not_registered') { 
    this._companyData.update(data => ({ ...data, vatRegistered: value })); 
  }
  
  get salesTransactionType() { return this._companyData().salesTransactionType; }
  set salesTransactionType(value: 'cash' | 'credit' | 'both') { 
    this._companyData.update(data => ({ ...data, salesTransactionType: value })); 
  }
  
  get logoUrl() { return this._companyData().logoUrl; }
  get isEmojiLogo() { return typeof this.logoUrl === 'string' && this.logoUrl.length <= 4 && !this.logoUrl.startsWith('data:'); }
  
  get vatToggle() { return this._companyData().vatRegistered === 'registered'; }
  set vatToggle(value: boolean) { 
    this._companyData.update(data => ({ 
      ...data, 
      vatRegistered: value ? 'registered' : 'not_registered' 
    })); 
  }

  getBusinessNameLabel(): string {
    return this.businessType === 'corporate' ? 'Business Name' : 'Your Name';
  }

  getTaxIdLabel(): string {
    return this.businessType === 'corporate' ? 'Tax ID' : 'Personal ID';
  }

  getTaxIdPlaceholder(): string {
    return this.businessType === 'corporate' ? 'Tax ID Number' : 'Personal ID Number';
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  addDemoLogo(): void {
    // Cycle through some fun business emoji logos for demo
    const emojiLogos = ['🏢', '💼', '🚀', '⭐', '🎯', '💡', '🔥', '⚡'];
    const currentIndex = this.logoUrl ? emojiLogos.indexOf(this.logoUrl) : -1;
    const nextIndex = (currentIndex + 1) % emojiLogos.length;
    
    this._companyData.update(data => ({
      ...data,
      logoUrl: emojiLogos[nextIndex]
    }));
  }

  onLogoUpload(_event: Event): void {
    // Keep this for future real logo upload functionality
    const fakeLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMzNCMkY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD4KPHN2Zz4=';
    
    this._companyData.update(data => ({
      ...data,
      logoUrl: fakeLogo
    }));
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('th-TH');
  }

  getDueDate(): string {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    return dueDate.toLocaleDateString('th-TH');
  }

  onGetStarted(): void {
    // Validate required fields
    const data = this._companyData();
    if (!data.businessName.trim()) {
      alert('Please enter a business name');
      return;
    }

    // Return the data and close modal
    this.dialogRef.close(data);
  }

  // Interactive hover methods for glow effects
  setHoveredSection(section: string | null): void {
    this.hoveredSection.set(section);
  }

  isHovered(section: string): boolean {
    return this.hoveredSection() === section;
  }

  // Get available document types based on current settings
  getAvailableDocumentTypes(): { id: string; name: string }[] {
    const salesType = this.salesTransactionType;
    const isVatRegistered = this.vatToggle;
    
    // Define document types with IDs for tab switching
    const documentTypes: Record<string, { id: string; name: string }[]> = {
      cash: isVatRegistered ? [
        { id: 'quotation', name: 'Quotation' },
        { id: 'tax-invoice', name: 'Tax Invoice/Receipt' },
        { id: 'tax-invoice-cash', name: 'Tax Invoice/Receipt (Cash)' }
      ] : [
        { id: 'quotation', name: 'Quotation' },
        { id: 'receipt', name: 'Receipt' },
        { id: 'receipt-cash', name: 'Receipt (Cash)' }
      ],
      credit: isVatRegistered ? [
        { id: 'quotation', name: 'Quotation' },
        { id: 'tax-invoice', name: 'Delivery Note/Tax Invoice' },
        { id: 'receipt', name: 'Receipt' }
      ] : [
        { id: 'quotation', name: 'Quotation' },
        { id: 'invoice', name: 'Invoice' },
        { id: 'receipt', name: 'Receipt' }
      ],
      both: isVatRegistered ? [
        { id: 'quotation', name: 'Quotation' },
        { id: 'tax-invoice', name: 'Tax Invoice' },
        { id: 'receipt', name: 'Receipt' },
        { id: 'tax-invoice-cash', name: 'Tax Invoice/Receipt (Cash)' }
      ] : [
        { id: 'quotation', name: 'Quotation' },
        { id: 'invoice', name: 'Invoice' },
        { id: 'receipt', name: 'Receipt' },
        { id: 'receipt-cash', name: 'Receipt (Cash)' }
      ]
    };
    
    return documentTypes[salesType] || [];
  }

  // Get document type title for preview
  getDocumentTypeTitle(): string {
    const docType = this.selectedDocumentType();
    const titles: Record<string, string> = {
      'quotation': 'Quotation',
      'tax-invoice': 'Tax Invoice',
      'tax-invoice-cash': 'Tax Invoice/Receipt',
      'invoice': 'Invoice',
      'receipt': 'Receipt',
      'receipt-cash': 'Receipt'
    };
    return titles[docType] || 'Document';
  }

  // Get document header text in Thai/English
  getDocumentHeaderText(): string {
    const docType = this.selectedDocumentType();
    const headers: Record<string, string> = {
      'quotation': 'ใบเสนอราคา<br>(Quotation)',
      'tax-invoice': 'ใบส่งสินค้า/ใบกำกับภาษี<br>(Invoice/Tax Invoice)',
      'tax-invoice-cash': 'ใบกำกับภาษี/ใบเสร็จรับเงิน<br>(Tax Invoice/Receipt)',
      'invoice': 'ใบส่งสินค้า<br>(Invoice)',
      'receipt': 'ใบเสร็จรับเงิน<br>(Receipt)',
      'receipt-cash': 'ใบเสร็จรับเงิน (เงินสด)<br>(Receipt - Cash)'
    };
    return headers[docType] || 'ใบส่งสินค้า/ใบกำกับภาษี<br>(Invoice/Tax Invoice)';
  }

  // Get active payment method - prioritize hover over selection
  getActivePaymentMethod(): string | null {
    return this.hoveredPaymentMethod() || this.salesTransactionType || null;
  }

  // Get available document names as simple string array
  getAvailableDocumentNames(): string[] {
    const salesType = this.salesTransactionType;
    const isVatRegistered = this.vatToggle;
    
    // Define document names based on sales type and VAT status
    const documentNames: Record<string, string[]> = {
      cash: isVatRegistered ? [
        'Quotation',
        'Billing Note/Invoice', 
        'Tax Invoice/Receipt',
        'Tax Invoice/Receipt (Cash)'
      ] : [
        'Quotation',
        'Billing Note',
        'Receipt',
        'Receipt (Cash)'
      ],
      credit: isVatRegistered ? [
        'Quotation',
        'Billing Note/Invoice',
        'Delivery Note/Tax Invoice', 
        'Receipt'
      ] : [
        'Quotation',
        'Billing Note',
        'Invoice',
        'Receipt'
      ],
      both: isVatRegistered ? [
        'Quotation',
        'Billing Note',
        'Delivery Note/Invoice/Tax Invoice',
        'Receipt',
        'Tax Invoice/Receipt (Cash)'
      ] : [
        'Quotation',
        'Billing Note', 
        'Invoice',
        'Receipt',
        'Receipt (Cash)'
      ]
    };
    
    return documentNames[salesType] || [];
  }

  // Get shortened document names for mini document labels
  getShortDocName(docName: string): string {
    const shortNames: Record<string, string> = {
      'Quotation': 'Quote',
      'Billing Note': 'Bill',
      'Billing Note/Invoice': 'Bill',
      'Tax Invoice/Receipt': 'Tax Inv',
      'Tax Invoice/Receipt (Cash)': 'Tax Cash',
      'Delivery Note/Tax Invoice': 'Delivery',
      'Delivery Note/Invoice/Tax Invoice': 'Multi',
      'Invoice': 'Invoice',
      'Receipt': 'Receipt',
      'Receipt (Cash)': 'Cash Rec'
    };
    return shortNames[docName] || docName.substring(0, 8);
  }
}