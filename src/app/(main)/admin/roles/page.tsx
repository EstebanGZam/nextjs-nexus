'use client';

import * as React from 'react';
import { toast } from 'react-hot-toast';

import { useRequireRole } from '@/src/hooks/useRequireRole';
import { useAuthStore } from '@/src/stores/useAuthStore';
import Button from '@/src/components/ui/Button';
import Modal from '@/src/components/ui/Modal';

import roleService from '@/src/services/roleService';
import type { Role } from '@/src/lib/types';

import RolesTable from '@/src/components/admin/roles/RolesTable';
import RoleForm from '@/src/components/admin/roles/RoleForm';

type RolesList = Role[] | { data: Role[] };

function normalizeRoles(resp: RolesList): Role[] {
  return Array.isArray(resp) ? resp : (resp.data ?? []);
}

export default function RolesPage() {
  // Sigue validando rol alto nivel si quieres; no hace daño.
  const { isAuthorized, isLoading: authLoading } = useRequireRole('ADMINISTRATOR');
  const { permissions } = useAuthStore();

  const canManageRoles = React.useMemo(
    () => Array.isArray(permissions) && permissions.includes('MANAGE_ROLES'),
    [permissions]
  );

  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);

  const fetchRoles = React.useCallback(async () => {
    try {
      setLoading(true);
      const resp = await roleService.getRoles({ page: 1, limit: 200 });
      setRoles(normalizeRoles(resp as unknown as RolesList));
      setError(null);
    } catch (e: unknown) {
      // Si el backend grita 403, muestra mensaje claro y no spamees {}
      const msg =
        (e as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'No se pudieron cargar los roles';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // No pegues al backend si no tienes permiso; evita 403 gratis.
    if (isAuthorized && canManageRoles) {
      void fetchRoles();
    } else {
      setLoading(false);
    }
  }, [isAuthorized, canManageRoles, fetchRoles]);

  const handleCreate = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = async (role: Role) => {
    if (role.isGeneric) return;
    try {
      await roleService.deleteRole(role.id);
      toast.success('Rol eliminado');
      void fetchRoles();
    } catch {
      toast.error('No se pudo eliminar el rol');
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    void fetchRoles();
  };

  // Carga inicial
  if (authLoading || (loading && roles.length === 0 && !error && canManageRoles)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Cargando roles...</p>
      </div>
    );
  }

  // Sin permiso específico: pantalla de solo-lectura con bloqueo
  if (!canManageRoles) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Roles</h1>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
          No tienes el permiso <span className="font-mono">MANAGE_ROLES</span>. Pídeselo a alguien
          que sí manda. Mientras tanto, aquí no hay nada que ver.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Roles</h1>
          <p className="mt-1 text-sm text-slate-600">
            Los roles genéricos son de solo lectura. Crea y gestiona roles personalizados.
          </p>
        </div>

        {/* Mostrar crear solo si puedes gestionar roles (o si luego quieres, cámbialo a CREATE_ROLE) */}
        <Button onClick={handleCreate}>Crear rol</Button>
      </div>

      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <RolesTable roles={roles} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? 'Editar rol' : 'Crear rol'}
      >
        <RoleForm roleToEdit={selectedRole} onSuccess={handleFormSuccess} />
      </Modal>
    </div>
  );
}
