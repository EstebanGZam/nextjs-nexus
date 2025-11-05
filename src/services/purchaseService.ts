/**
 * Purchase Service
 * Handles all API calls related to purchases
 */

import { get } from '@/src/lib/apiClient';
import type { Purchase } from '@/src/lib/types';

/**
 * Get purchase history for the logged-in user
 * Returns all purchases made by the authenticated user
 */
export async function getUserPurchases(): Promise<Purchase[]> {
  return get<Purchase[]>('/purchases');
}

/**
 * Get a specific purchase by ID
 * Returns detailed purchase information including tickets
 */
export async function getPurchaseById(purchaseId: string): Promise<Purchase> {
  return get<Purchase>(`/purchases/${purchaseId}`);
}
