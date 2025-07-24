import { Component, Output, EventEmitter, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileTestingService } from '../../../services/user-profile-testing.service';

@Component({
  selector: 'app-exit-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exit-survey.component.html',
  styleUrls: ['./exit-survey.component.scss']
})
export class ExitSurveyComponent implements OnInit, OnDestroy {
  @Output() surveyResponse = new EventEmitter<{reasonId: string, reason: string, otherText: string, action: 'confirm' | 'stay'}>();
  @Output() surveyClosed = new EventEmitter<void>();

  private userProfileTesting = inject(UserProfileTestingService);

  isVisible = false;
  selectedReason = '';
  selectedReasonId = '';
  otherReasonText = '';
  hasShownSurvey = false;
  
  surveyReasons = [
    { id: 'COST', text: "It's too expensive for me" },
    { id: 'QUESTIONS', text: "I still have questions" },
    { id: 'APPROVAL', text: "I need to check with someone first" },
    { id: 'MISSING-FEATURE', text: "It's missing a feature I need" },
    { id: 'CHECKOUT-ERROR', text: "Something went wrong in the checkout" },
    { id: 'OTHER', text: "Others" }
  ];

  ngOnInit() {
    // Start exit intent detection after component loads
    this.startExitIntentDetection();
  }

  ngOnDestroy() {
    // Clean up event listeners
    this.stopExitIntentDetection();
  }

  private startExitIntentDetection() {
    // Add event listener for mouse movement to detect exit intent
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  private stopExitIntentDetection() {
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  private handleMouseMove(event: MouseEvent) {
    // Detect if cursor is near the top of the viewport (exit intent)
    if (event.clientY <= 50 && !this.hasShownSurvey && !this.isVisible) {
      this.showSurvey();
    }
  }

  private handleMouseLeave(event: MouseEvent) {
    // Additional exit intent trigger when mouse leaves document
    if (!this.hasShownSurvey && !this.isVisible) {
      this.showSurvey();
    }
  }

  private showSurvey() {
    this.isVisible = true;
    this.hasShownSurvey = true;
    
    // Track analytics event
    this.trackEvent('exit_survey_shown', { 
      trigger: 'exit_intent',
      page: 'checkout'
    });
  }

  onReasonChange(reasonId: string, reasonText: string) {
    this.selectedReasonId = reasonId;
    this.selectedReason = reasonText;
    
    // Clear other reason text if not selecting "OTHER"
    if (reasonId !== 'OTHER') {
      this.otherReasonText = '';
    }
  }

  onOtherReasonChange(event: any) {
    this.otherReasonText = event.target.value;
  }

  isOthersSelected(): boolean {
    return this.selectedReasonId === 'OTHER';
  }

  onConfirm() {
    if (this.selectedReason && (!this.isOthersSelected() || this.otherReasonText.trim())) {
      const reasonData = {
        reasonId: this.selectedReasonId,
        reason: this.selectedReason,
        otherText: this.isOthersSelected() ? this.otherReasonText.trim() : '',
        action: 'confirm' as const
      };
      
      // Store exit reason using unified user profile testing service
      this.userProfileTesting.storeExitSurveyResponse({
        ...reasonData,
        page: 'checkout'
      });
      
      this.surveyResponse.emit(reasonData);
      
      // Track analytics with variable names for user experience tracking
      this.trackEvent('exit_survey_submitted', {
        reason_id: this.selectedReasonId,
        reason_text: this.selectedReason,
        other_reason: this.isOthersSelected() ? this.otherReasonText.trim() : '',
        action: 'confirm'
      });
    }
    
    this.closeSurvey();
  }

  onStayOnPage() {
    const reasonData = {
      reasonId: this.selectedReasonId || '',
      reason: this.selectedReason || '',
      otherText: this.isOthersSelected() ? this.otherReasonText.trim() : '',
      action: 'stay' as const
    };
    
    // Store exit reason using unified user profile testing service (even if they stayed)
    if (this.selectedReasonId) {
      this.userProfileTesting.storeExitSurveyResponse({
        ...reasonData,
        page: 'checkout'
      });
    }
    
    this.surveyResponse.emit(reasonData);
    
    // Track analytics
    this.trackEvent('exit_survey_stay', {
      reason_id: this.selectedReasonId,
      reason_text: this.selectedReason,
      other_reason: this.isOthersSelected() ? this.otherReasonText.trim() : '',
      action: 'stay'
    });
    
    this.closeSurvey();
  }

  private closeSurvey() {
    this.isVisible = false;
    this.surveyClosed.emit();
  }

  private trackEvent(eventName: string, data: any) {
    // Analytics tracking - integrate with your analytics service
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', eventName, data);
    }
    
    // Console log for development
    console.log(`Analytics: ${eventName}`, data);
  }

  // Prevent clicks on backdrop from closing modal (user must make a choice)
  onBackdropClick(event: Event) {
    event.stopPropagation();
  }

  // Method to get stored exit survey data (for testing or analysis)
  getStoredExitSurveyData() {
    return this.userProfileTesting.getExitSurveyData();
  }

  // Method to clear stored exit survey data
  clearStoredExitSurveyData() {
    this.userProfileTesting.clearExitSurveyData();
  }
} 