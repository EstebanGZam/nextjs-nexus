jest.mock('../../../src/lib/apiClient');

import { getUserPurchases, getPurchaseById } from '@/src/services/purchaseService';
import * as apiClient from '../../../src/lib/apiClient';

describe('purchaseService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserPurchases', () => {
    it('should fetch user purchases successfully', async () => {
      const mockPurchases = [
        {
          id: '1',
          totalAmount: 100,
          status: 'COMPLETED',
          createdAt: '2024-01-01',
        },
        {
          id: '2',
          totalAmount: 200,
          status: 'COMPLETED',
          createdAt: '2024-01-02',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockPurchases);

      const result = await getUserPurchases();

      expect(apiClient.get).toHaveBeenCalledWith('/purchases');
      expect(result).toEqual(mockPurchases);
    });

    it('should handle errors when fetching user purchases', async () => {
      const error = new Error('Network error');
      (apiClient.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(getUserPurchases()).rejects.toThrow('Network error');
      expect(apiClient.get).toHaveBeenCalledWith('/purchases');
    });
  });

  describe('getPurchaseById', () => {
    it('should fetch purchase by ID successfully', async () => {
      const mockPurchase = {
        id: '123',
        totalAmount: 100,
        status: 'COMPLETED',
        createdAt: '2024-01-01',
        tickets: [],
      };

      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockPurchase);

      const result = await getPurchaseById('123');

      expect(apiClient.get).toHaveBeenCalledWith('/purchases/123');
      expect(result).toEqual(mockPurchase);
    });

    it('should handle errors when fetching purchase by ID', async () => {
      const error = new Error('Purchase not found');
      (apiClient.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(getPurchaseById('invalid-id')).rejects.toThrow('Purchase not found');
      expect(apiClient.get).toHaveBeenCalledWith('/purchases/invalid-id');
    });

    it('should handle different purchase IDs', async () => {
      const ids = ['abc', '123', 'xyz-789'];

      for (const id of ids) {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({ id });
        await getPurchaseById(id);
        expect(apiClient.get).toHaveBeenCalledWith(`/purchases/${id}`);
      }
    });
  });
});
