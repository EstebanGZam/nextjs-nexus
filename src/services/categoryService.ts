/**
 * Category Service
 */

import { get, post, patch, del } from '@/src/lib/apiClient';
import type {
  EventCategory,
  CreateEventCategoryDTO,
  UpdateEventCategoryDTO,
} from '@/src/lib/types';

/**
 * Get all event categories
 */
async function getCategories(): Promise<EventCategory[]> {
  return get<EventCategory[]>('/event-categories');
}

/**
 * Get category by ID
 */
async function getCategoryById(id: string): Promise<EventCategory> {
  return get<EventCategory>(`/event-categories/${id}`);
}

/**
 * Create new category
 */
async function createCategory(data: CreateEventCategoryDTO): Promise<EventCategory> {
  return post<EventCategory, CreateEventCategoryDTO>('/event-categories', data);
}

/**
 * Update category
 */
async function updateCategory(id: string, data: UpdateEventCategoryDTO): Promise<EventCategory> {
  return patch<EventCategory, UpdateEventCategoryDTO>(`/event-categories/${id}`, data);
}

/**
 * Delete category
 */
async function deleteCategory(id: string): Promise<void> {
  return del<void>(`/event-categories/${id}`);
}

const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
