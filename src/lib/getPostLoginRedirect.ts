// src/lib/getPostLoginRedirect.ts
import type { User, Role } from '@/src/lib/types';

function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false;

  // 1) roles como objetos
  if (Array.isArray(user.roles)) {
    const hit = (user.roles as Role[]).some(
      (r) => (r?.name ?? '').toUpperCase() === 'ADMINISTRATOR'
    );
    if (hit) return true;
  }

  // 2) roles como strings (por si acaso)
  const asStrings = (user as unknown as { roles?: string[] })?.roles;
  if (Array.isArray(asStrings)) {
    if (asStrings.some((r) => (r ?? '').toUpperCase() === 'ADMINISTRATOR')) return true;
  }

  // 3) permisos (cuando el backend no manda roles legibles)
  const perms = (user as unknown as { permissions?: string[] })?.permissions ?? [];
  if (Array.isArray(perms) && perms.some((p) => p.toUpperCase().includes('MANAGE_ROLES'))) {
    return true;
  }

  return false;
}

export function getPostLoginRedirect(user: User | null | undefined): string {
  return isAdmin(user) ? '/admin' : '/dashboard';
}
