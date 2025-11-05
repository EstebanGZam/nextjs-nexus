'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCartStore } from '@/src/stores/useCartStore';
import { useAuthStore } from '@/src/stores/useAuthStore';
import { Can } from '@/src/components/auth/Can';

function isActivePath(current: string | null, target: string): boolean {
  if (!current) return false;
  // Activo si coincide exacto o si es prefijo (para subrutas)
  return current === target || current.startsWith(`${target}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const totalItems = useCartStore((s) => s.totalItems);
  const fetchCarts = useCartStore((s) => s.fetchCarts);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Cargar carrito cuando hay usuario
  useEffect(() => {
    if (user) {
      fetchCarts().catch(() => {
        /* badge = 0 si falla */
      });
    }
  }, [user, fetchCarts]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <Link
          href="/events"
          className="text-lg font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          TicketHub
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/events"
            className={`text-sm transition-colors ${
              isActivePath(pathname, '/events')
                ? 'font-semibold text-blue-600'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Eventos
          </Link>

          {user && (
            <>
              <Link
                href="/purchases/history"
                className={`text-sm transition-colors ${
                  isActivePath(pathname, '/purchases/history')
                    ? 'font-semibold text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Mis Compras
              </Link>

              <Link
                href="/dashboard"
                className={`text-sm transition-colors ${
                  isActivePath(pathname, '/dashboard')
                    ? 'font-semibold text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Dashboard
              </Link>

              {/* Admin solo con permiso */}
              <Can permission="manage_users">
                <Link
                  href="/admin/users"
                  className={`text-sm transition-colors ${
                    isActivePath(pathname, '/admin')
                      ? 'font-semibold text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Admin
                </Link>
              </Can>

              {/* Carrito con badge */}
              <Link href="/cart" className="relative" aria-label="Carrito">
                <svg
                  className={`h-6 w-6 ${
                    isActivePath(pathname, '/cart') ? 'text-blue-600' : 'text-gray-700'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Perfil / Salir */}
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="text-sm text-gray-700 transition-colors hover:text-blue-600"
                >
                  {user.firstName || user.email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Salir
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
