'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/src/stores/useAuthStore';
import { suggestRoleByRoute, filterGenericRoles } from '@/src/lib/roleUtils';

/**
 * useAutoSwitchRole Hook
 * Automatically switches the active role when user navigates to a route
 * that belongs to a different role
 *
 * Usage: Call this hook in your root layout or a high-level component
 * @example
 * ```tsx
 * export default function RootLayout({ children }) {
 *   useAutoSwitchRole();
 *   return <html><body>{children}</body></html>;
 * }
 * ```
 */
export function useAutoSwitchRole() {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Only run when pathname actually changes
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;

    const state = useAuthStore.getState();
    const { activeRole, roles, switchRole } = state;

    // Filter to only generic roles
    const availableRoles = filterGenericRoles(roles);

    // Skip if no roles available
    if (availableRoles.length === 0) return;

    // Get suggested role for current route
    const suggestedRole = suggestRoleByRoute(pathname, availableRoles);

    // If no specific role needed for this route, don't switch
    if (!suggestedRole) return;

    // If suggested role is different from active role, switch automatically
    if (suggestedRole !== activeRole) {
      console.log(
        `[useAutoSwitchRole] Auto-switching from ${activeRole} to ${suggestedRole} for route ${pathname}`
      );
      switchRole(suggestedRole);
    }
  }, [pathname]);
}

export default useAutoSwitchRole;
