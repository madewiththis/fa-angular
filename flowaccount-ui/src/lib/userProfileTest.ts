export interface UserProfileTestCriteria {
  userRole:
    | "owner"
    | "staff"
    | "accounting"
    | "firm"
    | "freelance"
    | "accountant"
    | "student"
    | "any";
  package: "free_trial" | "standard" | "pro" | "pro_business" | "any";
  packageStatus: "active" | "expired" | "expiring" | "any";
  paymentFrequency: "monthly" | "annual" | "any";
  paymentMethod: "credit_card" | "bank_transfer" | "qr_code" | "any";
}

const DEFAULT_CRITERIA: UserProfileTestCriteria = {
  userRole: "any",
  package: "any",
  packageStatus: "any",
  paymentFrequency: "any",
  paymentMethod: "any",
};

const COOKIE_NAME = "flowaccount-test-profile";

export function setCookie(
  name: string,
  value: string,
  days: number = 30
): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function saveUserProfileTestCriteria(
  criteria: UserProfileTestCriteria
): void {
  setCookie(COOKIE_NAME, JSON.stringify(criteria));
}

export function getUserProfileTestCriteria(): UserProfileTestCriteria {
  const cookieValue = getCookie(COOKIE_NAME);
  if (cookieValue) {
    try {
      return JSON.parse(cookieValue);
    } catch (error) {
      console.error("Error parsing user profile test criteria:", error);
    }
  }
  return DEFAULT_CRITERIA;
}

export function resetUserProfileTestCriteria(): void {
  saveUserProfileTestCriteria(DEFAULT_CRITERIA);
}

// Helper function to check if testing is enabled
export function isTestingEnabled(): boolean {
  const criteria = getUserProfileTestCriteria();
  return Object.values(criteria).some(
    (value) => value !== "Any" && value !== "any"
  );
}

// Helper functions to get specific criteria
export function getTestUserRole(): string {
  return getUserProfileTestCriteria().userRole;
}

export function getTestPackage(): string {
  return getUserProfileTestCriteria().package;
}

export function getTestPackageStatus(): string {
  return getUserProfileTestCriteria().packageStatus;
}

export function getTestPaymentFrequency(): string {
  return getUserProfileTestCriteria().paymentFrequency;
}

export function getTestPaymentMethod(): string {
  return getUserProfileTestCriteria().paymentMethod;
}
