import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LearningPanelService } from '../services/learning-panel.service';

@Component({
  selector: 'app-learning-center-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './learning-center-panel.component.html',
  styleUrls: ['./learning-center-panel.component.scss']
})
export class LearningCenterPanelComponent {
  protected learningPanel = inject(LearningPanelService);
  
  constructor() {
    // Component initialized
  }
  
  // View states
  isContentPrimary = false;
  isChatPrimary = false;
  isNavModalOpen = false;
  showSupportDropdown = false;
  
  // In-panel overlays
  showCallSupportOverlay = false;
  showCallbackOverlay = false;
  
  // Context management
  currentPageContext = 'quotations'; // This would come from route
  previousPageContext: string | null = null;
  showBackButton = false;
  
  // View state management
  toggleContentView(): void {
    if (this.isContentPrimary) {
      // Reset to default
      this.isContentPrimary = false;
      this.isChatPrimary = false;
    } else if (this.isChatPrimary) {
      // Switch from chat primary to content primary
      this.isChatPrimary = false;
      this.isContentPrimary = true;
    } else {
      // Expand content
      this.isContentPrimary = true;
      this.isChatPrimary = false;
    }
  }
  
  toggleChatView(): void {
    if (this.isChatPrimary) {
      // Reset to default
      this.isChatPrimary = false;
      this.isContentPrimary = false;
    } else if (this.isContentPrimary) {
      // Switch from content primary to chat primary
      this.isContentPrimary = false;
      this.isChatPrimary = true;
    } else {
      // Expand chat
      this.isChatPrimary = true;
      this.isContentPrimary = false;
    }
  }
  
  // Navigation modal
  openNavModal(): void {
    this.isNavModalOpen = true;
  }
  
  closeNavModal(): void {
    this.isNavModalOpen = false;
  }
  
  selectNavContent(contentType: string): void {
    console.log('Selected content:', contentType);
    
    // Store previous context for back button
    if (contentType !== this.currentPageContext) {
      this.previousPageContext = this.currentPageContext;
      this.showBackButton = true;
    }
    
    // Close modal
    this.closeNavModal();
    
    // TODO: Load content for selected type
  }
  
  backToCurrentPage(): void {
    if (this.previousPageContext) {
      this.previousPageContext = null;
      this.showBackButton = false;
      // TODO: Restore original page content
    }
  }
  
  // Support dropdown
  toggleSupportDropdown(): void {
    this.showSupportDropdown = !this.showSupportDropdown;
  }
  
  selectSupportOption(option: string): void {
    this.showSupportDropdown = false;
    
    switch(option) {
      case 'call':
        this.showCallSupportOverlay = true;
        break;
      case 'chat':
        console.log('Opening chat support...'); // TODO: Integrate with live chat
        break;
      case 'callback':
        this.showCallbackOverlay = true;
        break;
      case 'workshops':
        this.openWorkshopsLink();
        break;
    }
  }
  
  // In-panel overlay controls
  closeCallSupportOverlay(): void {
    this.showCallSupportOverlay = false;
  }
  
  closeCallbackOverlay(): void {
    this.showCallbackOverlay = false;
  }
  
  // Phone number functionality
  phoneNumber = '+66-2-123-4567';
  showCopyMessage = false;
  
  async copyPhoneNumber(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.phoneNumber);
      this.showCopyMessage = true;
      setTimeout(() => {
        this.showCopyMessage = false;
      }, 3000);
    } catch (err) {
      // Fallback for older browsers
      const tempInput = document.createElement('input');
      tempInput.value = this.phoneNumber;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      this.showCopyMessage = true;
      setTimeout(() => {
        this.showCopyMessage = false;
      }, 3000);
    }
  }
  
  private openWorkshopsLink(): void {
    window.open('https://flowaccount.com/seminars', '_blank');
  }
  
  // Chat input
  onChatInputFocus(): void {
    if (!this.isChatPrimary) {
      this.toggleChatView();
    }
  }
  
  // Panel controls
  closePanel(): void {
    this.learningPanel.closePanel();
  }
  
  // Helper getters
  get contentViewClasses(): string {
    return `content-view ${this.isContentPrimary ? 'primary' : ''} ${this.isChatPrimary ? 'collapsed' : ''}`;
  }
  
  get chatViewClasses(): string {
    return `chat-view ${this.isChatPrimary ? 'primary' : ''} ${this.isContentPrimary ? 'collapsed' : ''}`;
  }
  
  get contentHeaderText(): string {
    return this.showBackButton ? 'How to use quotations' : 'How to guides';
  }
  
  get backButtonText(): string {
    return `Back to ${this.previousPageContext || 'quotations'}`;
  }
}