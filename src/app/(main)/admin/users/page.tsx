'use client';
import { useAuthStore } from '@/src/stores/useAuthStore';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useRequireRole } from '@/src/hooks/useRequireRole';
import { Can } from '@/src/components/auth/Can';
import Button from '@/src/components/ui/Button';
import Modal from '@/src/components/ui/Modal';
import ConfirmDialog from '@/src/components/ui/ConfirmDialog';
import userService from '@/src/services/userService';
import type { User } from '@/src/lib/types';
import UsersTable from '@/src/components/admin/users/UsersTable';
import UserForm from '@/src/components/admin/users/UserForm';

export default function AdminUsersPage() {
  // 1. Protección de rol
  const { user, permissions, roles } = useAuthStore();
  const { isLoading: authLoading, isAuthorized } = useRequireRole('ADMINISTRATOR');

  // 2. Estados de datos
  const [users, setUsers] = useState<User[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Estados de UI para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 4. Función para cargar usuarios (memoizada para reusar)
  const fetchUsers = useCallback(async () => {
    try {
      setIsDataLoading(true);
      const response = await userService.getUsers({ page: 1, limit: 100 }); // Traemos 100 por ahora
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar usuarios.');
      toast.error('No se pudieron cargar los usuarios');
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // 5. Efecto inicial
  useEffect(() => {
    if (isAuthorized) {
      fetchUsers();
    }
  }, [isAuthorized, fetchUsers]);

  // 6. Handlers para acciones CRUD
  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await userService.deleteUser(selectedUser.id);
      toast.success('Usuario eliminado correctamente');
      fetchUsers(); // Recargar lista
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar usuario');
    } finally {
      setIsDeleteOpen(false);
      setSelectedUser(null);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    toast.success(selectedUser ? 'Usuario actualizado' : 'Usuario creado');
    fetchUsers(); // Recargar lista
  };

  // 7. Renderizado condicional de carga/permisos
  if (authLoading || (isDataLoading && users.length === 0 && !error)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Cargando usuarios...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  // En AdminUsersPage.tsx antes del return final

  console.log('--- DEBUG AUTH ---');
  console.log('Usuario logueado:', user);
  console.log('Roles detectados:', roles);
  console.log('Permisos detectados:', permissions);

  console.log('--- DEBUG DATA USUARIOS ---');
  // Muestra el primer usuario de la lista para ver su estructura real
  if (users.length > 0) {
    console.log('Estructura del primer usuario en la tabla:', users[0]);
    console.log('Roles del primer usuario:', users[0].roles);
  }
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-slate-600">
            Administra las cuentas y roles de los usuarios del sistema.
          </p>
        </div>

        <Can permission="CREATE_USER">
          <Button onClick={handleCreate}>Crear Usuario</Button>
        </Can>
      </div>

      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <UsersTable users={users} onEdit={handleEdit} onDelete={handleDeleteClick} />

      {/* Modal de Crear/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      >
        <UserForm userToEdit={selectedUser} onSuccess={handleFormSuccess} />
      </Modal>

      {/* Diálogo de Confirmación de Eliminación */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUser?.firstName} ${selectedUser?.lastName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
