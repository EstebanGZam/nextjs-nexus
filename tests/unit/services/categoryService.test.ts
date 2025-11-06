jest.mock('../../../src/lib/apiClient');

import categoryService from '@/src/services/categoryService';
import * as apiClient from '../../../src/lib/apiClient';

const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } =
  categoryService;

describe('categoryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should fetch all categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Music' },
        { id: '2', name: 'Sports' },
      ];
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockCategories);

      const result = await getCategories();

      expect(apiClient.get).toHaveBeenCalledWith('/event-categories');
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getCategoryById', () => {
    it('should fetch category by ID', async () => {
      const mockCategory = { id: '123', name: 'Music' };
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockCategory);

      const result = await getCategoryById('123');

      expect(apiClient.get).toHaveBeenCalledWith('/event-categories/123');
      expect(result).toEqual(mockCategory);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const newCategory = { name: 'New Category', description: 'Desc' };
      const mockCreated = { id: '999', ...newCategory };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockCreated);

      const result = await createCategory(newCategory);

      expect(apiClient.post).toHaveBeenCalledWith('/event-categories', newCategory);
      expect(result).toEqual(mockCreated);
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const updates = { name: 'Updated Name' };
      const mockUpdated = { id: '123', ...updates };
      (apiClient.patch as jest.Mock).mockResolvedValueOnce(mockUpdated);

      const result = await updateCategory('123', updates);

      expect(apiClient.patch).toHaveBeenCalledWith('/event-categories/123', updates);
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      (apiClient.del as jest.Mock).mockResolvedValueOnce(undefined);

      await deleteCategory('123');

      expect(apiClient.del).toHaveBeenCalledWith('/event-categories/123');
    });
  });
});
