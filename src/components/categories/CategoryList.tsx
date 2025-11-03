'use client';

import * as React from 'react';
import { toast } from 'react-hot-toast';
import { useCategoryStore } from '@/src/stores/useCategoryStore';
import type { EventCategory } from '@/src/lib/types';
import Table, { createActionsColumn, type Column } from '@/src/components/ui/Table';
import Button from '@/src/components/ui/Button';
import ConfirmDialog from '@/src/components/ui/ConfirmDialog';
import CategoryModal from './CategoryModal';

export default function CategoryList() {
  // Store state and actions
  const {
    categories,
    isLoading,
    error: storeError,
    fetchCategories,
    deleteCategory,
  } = useCategoryStore();

  // Local UI state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<EventCategory | null>(null);

  // Fetch categories on component mount
  React.useEffect(() => {
    fetchCategories().catch(console.error);
  }, [fetchCategories]);

  // Show toast on store error
  React.useEffect(() => {
    if (storeError) {
      toast.error(storeError);
    }
  }, [storeError]);

  // Handlers
  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: EventCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category: EventCategory) => {
    setSelectedCategory(category);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCategory) {
      try {
        await deleteCategory(selectedCategory.id);
        toast.success('Categoría eliminada con éxito');
        setIsConfirmOpen(false);
        setSelectedCategory(null);
      } catch {
        setIsConfirmOpen(false);
      }
    }
  };

  // Define table columns
  const columns: Column<EventCategory>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (category) => <span className="font-medium">{category.name}</span>,
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (category) => <p className="text-sm text-slate-600">{category.description || '-'}</p>,
    },
    createActionsColumn<EventCategory>((category) => (
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(category)}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          Eliminar
        </Button>
      </div>
    )),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Categorías</h1>
        <Button variant="primary" onClick={handleCreate}>
          Crear Categoría
        </Button>
      </div>

      <Table
        columns={columns}
        data={categories}
        isLoading={isLoading}
        emptyMessage="No se encontraron categorías. Comienza creando una nueva."
      />

      {/* Modal for Create/Edit */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={selectedCategory}
      />

      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la categoría "${selectedCategory?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
}
