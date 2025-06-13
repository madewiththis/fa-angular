export { default as PasswordProtection } from "./PasswordProtection";

// Re-export auth utilities for convenience
export {
  isLocalhost,
  isAuthenticated,
  authenticate,
  logout,
  requiresAuthentication,
} from "../../lib/auth";
