'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import useRequireAuth from '@/src/hooks/useRequireAuth';
import { useAuth } from '@/src/hooks/useAuth';
import { ROUTES } from '@/src/lib/constants';
import { Can } from '@/src/components/auth/Can';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const { logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Cargando…</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <Button onClick={logout} variant="secondary">
          Cerrar sesión
        </Button>
      </header>

      <section className="space-y-6">
        {/* Seguridad / 2FA */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="max-w-xl">
              <h3 className="text-lg font-medium text-slate-900">Seguridad</h3>
              <p className="mt-1 text-sm text-slate-600">
                Gestiona la autenticación de dos factores para tu cuenta.
              </p>
            </div>
            <Button onClick={() => router.push(ROUTES.SETUP_2FA)} size="sm">
              2FA
            </Button>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-slate-900">Accesos rápidos</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Link href="/events" className="group block">
              <div className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors group-hover:border-indigo-400">
                <span className="text-sm font-medium text-slate-800">Eventos</span>
                <span aria-hidden className="text-slate-400 group-hover:text-indigo-500">
                  →
                </span>
              </div>
            </Link>

            <Link href="/purchases/history" className="group block">
              <div className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors group-hover:border-indigo-400">
                <span className="text-sm font-medium text-slate-800">Mis compras</span>
                <span aria-hidden className="text-slate-400 group-hover:text-indigo-500">
                  →
                </span>
              </div>
            </Link>

            <Link href="/cart" className="group block">
              <div className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors group-hover:border-indigo-400">
                <span className="text-sm font-medium text-slate-800">Carrito</span>
                <span aria-hidden className="text-slate-400 group-hover:text-indigo-500">
                  →
                </span>
              </div>
            </Link>

            {/* Solo admins */}
            <Can permission="manage_users">
              <Link href="/admin/users" className="group block">
                <div className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors group-hover:border-indigo-400">
                  <span className="text-sm font-medium text-slate-800">Usuarios (Admin)</span>
                  <span aria-hidden className="text-slate-400 group-hover:text-indigo-500">
                    →
                  </span>
                </div>
              </Link>
            </Can>
          </div>
        </div>

        {/* Info placeholder */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-700">
            Pantalla protegida. Aquí puedes sumar tarjetas, métricas y más accesos según tu rol.
          </p>
        </div>
      </section>
    </main>
  );
}
