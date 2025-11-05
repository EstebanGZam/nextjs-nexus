/**
 * Purchase Store
 * Manages purchase history state using Zustand
 */

import { create } from 'zustand';
import type { Purchase, ApiError } from '@/src/lib/types';
import * as purchaseService from '@/src/services/purchaseService';

// ============================================
// State and Actions Types
// ============================================

interface PurchaseState {
  // List of user's purchases
  purchases: Purchase[];

  // Currently viewed purchase (for detail view)
  currentPurchase: Purchase | null;

  // Loading state
  isLoading: boolean;

  // Error state
  error: string | null;
}

interface PurchaseActions {
  // Fetch all user's purchases
  fetchPurchases: () => Promise<void>;

  // Fetch a specific purchase by ID
  fetchPurchaseById: (purchaseId: string) => Promise<void>;

  // Set current purchase
  setCurrentPurchase: (purchase: Purchase | null) => void;

  // Clear error
  clearError: () => void;

  // Reset store
  reset: () => void;
}

type PurchaseStore = PurchaseState & PurchaseActions;

// ============================================
// Initial State
// ============================================

const initialState: PurchaseState = {
  purchases: [],
  currentPurchase: null,
  isLoading: false,
  error: null,
};

// ============================================
// Create Store
// ============================================

export const usePurchaseStore = create<PurchaseStore>((set) => ({
  ...initialState,

  // Fetch all user's purchases
  fetchPurchases: async () => {
    try {
      set({ isLoading: true, error: null });

      const purchases = await purchaseService.getUserPurchases();

      set({
        purchases,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Error al cargar el historial de compras',
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch a specific purchase by ID
  fetchPurchaseById: async (purchaseId) => {
    try {
      set({ isLoading: true, error: null });

      const purchase = await purchaseService.getPurchaseById(purchaseId);

      set({
        currentPurchase: purchase,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Error al cargar la compra',
        isLoading: false,
      });
      throw error;
    }
  },

  // Set current purchase
  setCurrentPurchase: (purchase) => set({ currentPurchase: purchase }),

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set(initialState),
}));
