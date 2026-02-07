/**
 * Utility to normalize admin authentication errors into user-facing English messages.
 * Distinguishes between invalid credentials and connectivity/system issues.
 */

export enum AdminAuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  CONNECTIVITY_ISSUE = 'CONNECTIVITY_ISSUE',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
}

export interface AdminAuthError {
  type: AdminAuthErrorType;
  message: string;
}

/**
 * Analyzes an error from the admin login flow and returns a normalized error object.
 */
export function normalizeAdminAuthError(error: unknown): AdminAuthError {
  if (!error) {
    return {
      type: AdminAuthErrorType.SYSTEM_ERROR,
      message: 'An unexpected error occurred. Please try again.',
    };
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Check for explicit credential rejection from backend
  if (
    lowerMessage.includes('invalid credentials') ||
    lowerMessage.includes('invalid username') ||
    lowerMessage.includes('invalid password')
  ) {
    return {
      type: AdminAuthErrorType.INVALID_CREDENTIALS,
      message: 'Invalid username or password',
    };
  }

  // Check for actor/connectivity issues
  if (
    lowerMessage.includes('actor not available') ||
    lowerMessage.includes('actor not initialized') ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('timeout')
  ) {
    return {
      type: AdminAuthErrorType.CONNECTIVITY_ISSUE,
      message: 'Unable to connect to the system. Please check your connection and try again.',
    };
  }

  // Default to system error for unknown issues
  return {
    type: AdminAuthErrorType.SYSTEM_ERROR,
    message: 'A system error occurred. Please try again later.',
  };
}

/**
 * Checks if an error is a transient connectivity issue (should not clear stored session).
 */
export function isTransientError(error: unknown): boolean {
  const normalized = normalizeAdminAuthError(error);
  return normalized.type === AdminAuthErrorType.CONNECTIVITY_ISSUE;
}
