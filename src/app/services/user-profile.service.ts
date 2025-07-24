import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private trialEndDateSubject: BehaviorSubject<Date>;
  public trialEndDate$: Observable<Date>;

  private onboardingCompletedSubject: BehaviorSubject<boolean>;
  public onboardingCompleted$: Observable<boolean>;

  constructor() {
    const initialTrialEndDate = new Date();
    initialTrialEndDate.setDate(initialTrialEndDate.getDate() + 15);
    this.trialEndDateSubject = new BehaviorSubject<Date>(initialTrialEndDate);
    this.trialEndDate$ = this.trialEndDateSubject.asObservable();

    this.onboardingCompletedSubject = new BehaviorSubject<boolean>(false);
    this.onboardingCompleted$ = this.onboardingCompletedSubject.asObservable();
  }

  completeOnboarding() {
    const currentEndDate = this.trialEndDateSubject.getValue();
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + 15);
    this.trialEndDateSubject.next(newEndDate);
    this.onboardingCompletedSubject.next(true);
  }
} 