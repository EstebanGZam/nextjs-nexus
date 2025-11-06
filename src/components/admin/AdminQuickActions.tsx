'use client';

import Link from 'next/link';
import Button from '@/src/components/ui/Button';
import { Can } from '@/src/components/auth/Can';

export default function AdminQuickActions() {
  return (
    <Can permission="manage_users">
      <section className="mt-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <header className="mb-4">
            <h2 className="text-lg font-semibold">Administración</h2>
            <p className="text-sm text-gray-600">Accesos rápidos para tareas de administración.</p>
          </header>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin/users">
              <Button>Gestionar usuarios</Button>
            </Link>

            {/* Descomenta si ya tienes las rutas */}
            {/* <Link href="/admin/roles">
              <Button variant="secondary">Roles</Button>
            </Link>

            <Link href="/admin/permissions">
              <Button variant="secondary">Permisos</Button>
            </Link> */}
          </div>
        </div>
      </section>
    </Can>
  );
}
