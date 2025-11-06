// src/lib/getPostLoginRedirect.ts

/**
 * Gets the redirect URL after successful login
 * Uses the active role to determine where to redirect
 * @param activeRole - The user's active role
 * @returns Redirect URL
 */
export function getPostLoginRedirect(activeRole: string | null): string {
  // Map roles to their default dashboard
  switch (activeRole?.toUpperCase()) {
    case 'ADMINISTRATOR':
      return '/admin';
    case 'ORGANIZER':
      return '/events'; // Temporary until organizer routes are ready
    case 'BUYER':
      return '/dashboard';
    case 'STAFF':
      return '/tickets/validate';
    default:
      return '/dashboard'; // Fallback
  }
}
