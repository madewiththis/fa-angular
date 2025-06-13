const SESSION_KEY = "flowaccount-auth-session";
const PASSWORD = "liquidflow"; // You can change this password

export function isLocalhost(): boolean {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.startsWith("192.168.") ||
    hostname.endsWith(".local")
  );
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  // Always allow localhost
  if (isLocalhost()) return true;

  // Check session storage for authentication
  const authData = sessionStorage.getItem(SESSION_KEY);
  if (!authData) return false;

  try {
    const { timestamp, authenticated } = JSON.parse(authData);
    const now = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

    // Check if session is still valid
    if (authenticated && now - timestamp < sessionDuration) {
      return true;
    }

    // Session expired, clear it
    sessionStorage.removeItem(SESSION_KEY);
    return false;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return false;
  }
}

export function authenticate(password: string): boolean {
  if (password === PASSWORD) {
    const authData = {
      authenticated: true,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(authData));
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function requiresAuthentication(): boolean {
  if (typeof window === "undefined") return false;
  return !isLocalhost();
}
