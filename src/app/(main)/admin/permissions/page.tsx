'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRequireRole } from '@/src/hooks/useRequireRole';
import permissionService from '@/src/services/permissionService';
import type { Permission } from '@/src/lib/types';
import PermissionsTable from '@/src/components/admin/permissions/PermissionsTable';

function normalizePermissions(resp: unknown): Permission[] {
  if (Array.isArray(resp)) return resp as Permission[];
  if (resp && typeof resp === 'object' && Array.isArray((resp as { data?: unknown }).data)) {
    return (resp as { data: Permission[] }).data;
  }
  return [];
}

export default function AdminPermissionsPage() {
  const { isLoading: authLoading, isAuthorized } = useRequireRole('ADMINISTRATOR');

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await permissionService.getPermissions({ page: 1, limit: 500 });
      setPermissions(normalizePermissions(resp as unknown));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar permisos.');
      toast.error('No se pudieron cargar los permisos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) fetchPermissions();
  }, [isAuthorized, fetchPermissions]);

  if (authLoading || (loading && permissions.length === 0 && !error)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Cargando permisos...</p>
      </div>
    );
  }
  if (!isAuthorized) return null;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Lista de Permisos</h1>
        <p className="mt-1 text-sm text-slate-600">
          Los permisos son definidos por el sistema. Aquí solo puedes consultarlos.
        </p>
      </div>

      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <PermissionsTable permissions={permissions} />
    </div>
  );
}
