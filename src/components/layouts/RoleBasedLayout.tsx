'use client';

import * as React from 'react';
import { useAuthStore } from '@/src/stores/useAuthStore';
import AdminLayout from '@/src/app/(main)/admin/layout';
import Navbar from '@/src/components/layout/Navbar';

/**
 * RoleBasedLayout
 * Renders the appropriate layout based on the user's active role
 */

interface Props {
  children: React.ReactNode;
}

export function RoleBasedLayout({ children }: Props) {
  const activeRole = useAuthStore((s) => s.activeRole);

  // Admin gets special sidebar layout
  if (activeRole === 'ADMINISTRATOR') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // All other roles get standard Navbar layout
  // (ORGANIZER, BUYER, STAFF, or no role)
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default RoleBasedLayout;
