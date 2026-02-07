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
 * Extracts the actual error message from IC agent error wrappers.
 * Handles multiple wrapper patterns including ic0.trap, explicit traps, and reject messages.
 */
function extractErrorMessage(error: unknown): string {
  if (!error) return '';
  
  // Try to get the raw message string
  let errorMessage = '';
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'object' && error !== null) {
    // Check for nested message fields
    const errorObj = error as any;
    if (errorObj.message) {
      errorMessage = String(errorObj.message);
    } else if (errorObj.error_message) {
      errorMessage = String(errorObj.error_message);
    } else if (errorObj.reject_message) {
      errorMessage = String(errorObj.reject_message);
    } else {
      errorMessage = String(error);
    }
  } else {
    errorMessage = String(error);
  }
  
  // Pattern 1: IC agent trap wrapper - "Canister called `ic0.trap` with message: <actual message>"
  const trapMatch = errorMessage.match(/ic0\.trap.*?(?:with\s+)?message:\s*(.+?)(?:\n|$|\.(?:\s|$))/i);
  if (trapMatch && trapMatch[1]) {
    return trapMatch[1].trim();
  }
  
  // Pattern 2: Explicit trap wrapper - "Canister trapped explicitly: <message>"
  const explicitTrapMatch = errorMessage.match(/trapped\s+explicitly:\s*(.+?)(?:\n|$|\.(?:\s|$))/i);
  if (explicitTrapMatch && explicitTrapMatch[1]) {
    return explicitTrapMatch[1].trim();
  }
  
  // Pattern 3: Reject message wrapper - "Reject message: <message>" or similar
  const rejectMatch = errorMessage.match(/reject\s+(?:text|message|code):\s*(.+?)(?:\n|$|\.(?:\s|$))/i);
  if (rejectMatch && rejectMatch[1]) {
    return rejectMatch[1].trim();
  }
  
  // Pattern 4: Call was rejected wrapper - "Call was rejected: <message>"
  const rejectedMatch = errorMessage.match(/(?:call\s+)?was\s+rejected:\s*(.+?)(?:\n|$|\.(?:\s|$))/i);
  if (rejectedMatch && rejectedMatch[1]) {
    return rejectedMatch[1].trim();
  }
  
  // Pattern 5: Error in canister wrapper - "Error in canister <id>: <message>"
  const canisterErrorMatch = errorMessage.match(/error\s+in\s+canister[^:]*:\s*(.+?)(?:\n|$|\.(?:\s|$))/i);
  if (canisterErrorMatch && canisterErrorMatch[1]) {
    return canisterErrorMatch[1].trim();
  }
  
  return errorMessage;
}

/**
 * Analyzes an error from the admin login flow and returns a normalized error object.
 */
export function normalizeAdminAuthError(error: unknown): AdminAuthError {
  if (!error) {
    return {
      type: AdminAuthErrorType.SYSTEM_ERROR,
      message: 'A system error occurred. Please try again later.',
    };
  }

  const rawMessage = error instanceof Error ? error.message : String(error);
  const extractedMessage = extractErrorMessage(error);
  const lowerMessage = extractedMessage.toLowerCase();
  const lowerRaw = rawMessage.toLowerCase();

  // Check for explicit credential rejection from backend
  // Check both extracted message (unwrapped) and raw message
  // This catches "Invalid credentials" from backend Runtime.trap
  if (
    lowerMessage.includes('invalid credentials') ||
    lowerMessage.includes('invalid username') ||
    lowerMessage.includes('invalid password') ||
    lowerRaw.includes('invalid credentials') ||
    lowerRaw.includes('invalid username') ||
    lowerRaw.includes('invalid password')
  ) {
    return {
      type: AdminAuthErrorType.INVALID_CREDENTIALS,
      message: 'Invalid username or password',
    };
  }

  // Check for actor/connectivity issues
  // These patterns indicate the backend is unreachable or having network issues
  if (
    lowerRaw.includes('actor not available') ||
    lowerRaw.includes('actor not initialized') ||
    lowerRaw.includes('network error') ||
    lowerRaw.includes('connection failed') ||
    lowerRaw.includes('fetch failed') ||
    lowerRaw.includes('timeout') ||
    lowerRaw.includes('timed out') ||
    lowerRaw.includes('canister not found') ||
    lowerRaw.includes('could not reach') ||
    lowerRaw.includes('unable to connect') ||
    lowerRaw.includes('no route to host') ||
    lowerMessage.includes('network error') ||
    lowerMessage.includes('connection failed') ||
    lowerMessage.includes('canister not found')
  ) {
    return {
      type: AdminAuthErrorType.CONNECTIVITY_ISSUE,
      message: 'Unable to connect to the system. Please check your connection and try again.',
    };
  }

  // If we got here and the extracted message contains "Invalid credentials",
  // it means the backend trap was caught but not matched above - treat as credential error
  if (extractedMessage && extractedMessage.toLowerCase().includes('invalid')) {
    return {
      type: AdminAuthErrorType.INVALID_CREDENTIALS,
      message: 'Invalid username or password',
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
