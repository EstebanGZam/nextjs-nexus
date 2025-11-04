/**
 * Category Store
 */

import { create } from 'zustand';
import type {
  EventCategory,
  CreateEventCategoryDTO,
  UpdateEventCategoryDTO,
  ApiError,
} from '@/src/lib/types';
import categoryService from '@/src/services/categoryService';

interface CategoryState {
  categories: EventCategory[];
  isLoading: boolean;
  error: string | null;
}

interface CategoryActions {
  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateEventCategoryDTO) => Promise<EventCategory>;
  updateCategory: (id: string, data: UpdateEventCategoryDTO) => Promise<EventCategory>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

type CategoryStore = CategoryState & CategoryActions;

export const useCategoryStore = create<CategoryStore>((set) => ({
  // Initial state
  categories: [],
  isLoading: false,
  error: null,

  // Actions
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });

      const categories = await categoryService.getCategories();

      set({
        categories,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Error al cargar categorías',
        isLoading: false,
      });
      throw error;
    }
  },

  createCategory: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const category = await categoryService.createCategory(data);

      set((state) => ({
        categories: [...state.categories, category],
        isLoading: false,
      }));

      return category;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Error al crear categoría',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    try {
      set({ isLoading: true, error: null });

      const category = await categoryService.updateCategory(id, data);

      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? category : c)),
        isLoading: false,
      }));

      return category;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Error al actualizar categoría',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ isLoading: true, error: null });

      await categoryService.deleteCategory(id);

      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Error al eliminar categoría',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
