import { Injectable, signal } from '@angular/core';
import { CompanySetupData } from '../components/settings/company-setup/company-setup-modal.component';

@Injectable({
  providedIn: 'root'
})
export class CompanySetupService {
  private _companyData = signal<CompanySetupData | null>(null);
  private _isSetupCompleted = signal<boolean>(false);

  // Public readonly signals
  readonly companyData = this._companyData.asReadonly();
  readonly isSetupCompleted = this._isSetupCompleted.asReadonly();

  constructor() {
    // Load saved data from storage on service initialization
    this.loadCompanyData();
    
    // Listen for storage events to detect cookie changes in other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'flowaccount_company_setup') {
        console.log('🔄 Storage event detected - reloading company data');
        this.loadCompanyData();
      }
    });
    
    // Listen for focus events to reload data when user returns to tab
    window.addEventListener('focus', () => {
      console.log('🔄 Window focus detected - checking for cookie changes');
      this.loadCompanyData();
    });
  }

  /**
   * Save company setup data with cookie-based completion tracking
   */
  saveCompanyData(data: CompanySetupData): void {
    this._companyData.set(data);
    this._isSetupCompleted.set(true);
    
    // Persist to localStorage (excluding the file object)
    const dataToSave = {
      ...data,
      logoFile: undefined // Don't serialize the File object
    };
    
    localStorage.setItem('flowaccount_company_setup', JSON.stringify(dataToSave));
    
    // Set completion status in cookie for easy reset
    this.setCookieCompletion(true);
    
    console.log('Company setup data saved:', data);
  }

  /**
   * Load company setup data from localStorage and cookie completion status
   */
  private loadCompanyData(): void {
    try {
      const savedData = localStorage.getItem('flowaccount_company_setup');
      const cookieCompleted = this.getCookieCompletion();
      
      console.log('🔄 Loading company data:', {
        hasLocalStorage: !!savedData,
        cookieCompleted: cookieCompleted
      });
      
      // Only consider setup completed if BOTH data exists AND cookie is true
      if (savedData && cookieCompleted) {
        const companyData = JSON.parse(savedData) as CompanySetupData;
        this._companyData.set(companyData);
        this._isSetupCompleted.set(true);
        console.log('✅ Company setup loaded as completed');
      } else {
        // If cookie is cleared, reset everything regardless of localStorage
        this._companyData.set(null);
        this._isSetupCompleted.set(false);
        if (savedData && !cookieCompleted) {
          console.log('🔄 Setup data exists but cookie cleared - marking as incomplete');
        } else {
          console.log('❌ No valid setup data found - marking as incomplete');
        }
      }
    } catch (error) {
      console.warn('Failed to load company setup data:', error);
      this._companyData.set(null);
      this._isSetupCompleted.set(false);
    }
  }

  /**
   * Force reload of company data (for testing cookie changes)
   */
  reloadCompanyData(): void {
    console.log('🔄 Force reloading company data...');
    this.loadCompanyData();
  }

  /**
   * Clear company setup data (for testing/reset purposes)
   */
  clearCompanyData(): void {
    console.log('🧹 Clearing all company setup data...');
    this._companyData.set(null);
    this._isSetupCompleted.set(false);
    localStorage.removeItem('flowaccount_company_setup');
    this.setCookieCompletion(false);
    console.log('✅ Company setup data cleared completely');
  }

  /**
   * Force reset completion state for demo purposes
   */
  forceResetCompletion(): void {
    console.log('🔄 Force resetting completion state for demo...');
    this.clearCompanyData();
    this.loadCompanyData();
    console.log('✅ Completion state reset. Current state:', {
      isCompleted: this._isSetupCompleted(),
      hasData: !!this._companyData()
    });
  }

  /**
   * Get formatted business type display name
   */
  getBusinessTypeDisplay(type: string): string {
    const typeMap: Record<string, string> = {
      'corporate': 'Corporate',
      'personal': 'Personal/Freelance'
    };
    return typeMap[type] || type;
  }

  /**
   * Get formatted VAT status display name
   */
  getVatStatusDisplay(status: string): string {
    const statusMap: Record<string, string> = {
      'registered': 'VAT Registered',
      'not_registered': 'Not VAT Registered'
    };
    return statusMap[status] || status;
  }

  /**
   * Get formatted sales transaction type display name
   */
  getSalesTransactionTypeDisplay(type: string): string {
    const typeMap: Record<string, string> = {
      'cash': 'Cash Sale',
      'credit': 'Credit Sale',
      'both': 'Cash & Credit Sale'
    };
    return typeMap[type] || type;
  }

  /**
   * Get available document types based on sales transaction type and VAT registration
   */
  getAvailableDocumentTypes(salesType: string, vatRegistered?: string): string[] {
    const data = this._companyData();
    const isVatRegistered = vatRegistered || data?.vatRegistered || 'not_registered';
    
    // VAT Registered document types
    const vatRegisteredTypes: Record<string, string[]> = {
      'cash': [
        'Quotation',
        'Billing Note/Invoice',
        'Tax Invoice/Receipt',
        'Tax Invoice/Receipt (Cash)'
      ],
      'credit': [
        'Quotation',
        'Billing Note/Invoice',
        'Delivery Note/Tax Invoice',
        'Receipt'
      ],
      'both': [
        'Quotation',
        'Billing Note',
        'Delivery Note/Invoice/Tax Invoice',
        'Receipt',
        'Tax Invoice/Receipt (Cash)'
      ]
    };
    
    // No VAT document types
    const noVatTypes: Record<string, string[]> = {
      'cash': [
        'Quotation',
        'Billing Note',
        'Receipt',
        'Receipt (Cash)'
      ],
      'credit': [
        'Quotation',
        'Billing Note',
        'Invoice',
        'Receipt'
      ],
      'both': [
        'Quotation',
        'Billing Note',
        'Invoice',
        'Receipt',
        'Receipt (Cash)'
      ]
    };
    
    const documentTypes = isVatRegistered === 'registered' ? vatRegisteredTypes : noVatTypes;
    return documentTypes[salesType] || [];
  }

  /**
   * Check if the company has specific features available
   */
  hasFeature(feature: string): boolean {
    const data = this._companyData();
    if (!data) return false;

    switch (feature) {
      case 'vat_calculations':
        return data.vatRegistered === 'registered';
      case 'credit_notes':
        return data.salesTransactionType === 'credit' || data.salesTransactionType === 'both';
      case 'cash_receipts':
        return data.salesTransactionType === 'cash' || data.salesTransactionType === 'both';
      case 'company_branding':
        return !!data.logoUrl;
      default:
        return false;
    }
  }

  /**
   * Generate company information summary for display
   */
  getCompanySummary(): string {
    const data = this._companyData();
    if (!data) return 'Company setup not completed';

    const parts = [
      data.businessName,
      this.getBusinessTypeDisplay(data.businessType),
      this.getVatStatusDisplay(data.vatRegistered),
      this.getSalesTransactionTypeDisplay(data.salesTransactionType)
    ];

    return parts.filter(Boolean).join(' • ');
  }

  /**
   * Set completion status in cookie with 30-day expiration
   */
  private setCookieCompletion(completed: boolean): void {
    if (completed) {
      // Set cookie with 30-day expiration
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `flowaccount_setup_completed=true; expires=${expires.toUTCString()}; path=/`;
      console.log('🍪 Cookie set to: true');
    } else {
      // Delete cookie by setting expiration to past date - try multiple methods
      document.cookie = `flowaccount_setup_completed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      document.cookie = `flowaccount_setup_completed=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      // Also try without path
      document.cookie = `flowaccount_setup_completed=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      document.cookie = `flowaccount_setup_completed=false; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      console.log('🍪 Cookie deletion attempted with multiple methods');
    }
  }

  /**
   * Get completion status from cookie with enhanced debugging
   */
  private getCookieCompletion(): boolean {
    const allCookies = document.cookie;
    const cookies = allCookies.split(';');
    const setupCookie = cookies.find(cookie => 
      cookie.trim().startsWith('flowaccount_setup_completed=')
    );
    
    const isCompleted = setupCookie?.trim() === 'flowaccount_setup_completed=true';
    
    console.log('🍪 Cookie check:', {
      allCookies: allCookies,
      setupCookie: setupCookie?.trim() || 'not found',
      isCompleted: isCompleted
    });
    
    return isCompleted;
  }
}