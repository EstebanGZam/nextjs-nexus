/**
 * Venue Store
 */

import { create } from 'zustand';
import type { Venue, CreateVenueDTO, UpdateVenueDTO, ApiError } from '@/src/lib/types';
import venueService from '@/src/services/venueService';

interface VenueState {
  venues: Venue[];
  isLoading: boolean;
  error: string | null;
}

interface VenueActions {
  fetchVenues: () => Promise<void>;
  createVenue: (data: CreateVenueDTO) => Promise<Venue>;
  updateVenue: (id: string, data: UpdateVenueDTO) => Promise<Venue>;
  deleteVenue: (id: string) => Promise<void>;
  clearError: () => void;
}

type VenueStore = VenueState & VenueActions;

export const useVenueStore = create<VenueStore>((set) => ({
  // Initial state
  venues: [],
  isLoading: false,
  error: null,

  // Actions
  fetchVenues: async () => {
    try {
      set({ isLoading: true, error: null });

      const venues = await venueService.getVenues();

      set({
        venues,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Error al cargar recintos',
        isLoading: false,
      });
      throw error;
    }
  },

  createVenue: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const venue = await venueService.createVenue(data);

      set((state) => ({
        venues: [...state.venues, venue],
        isLoading: false,
      }));

      return venue;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Error al crear recinto',
        isLoading: false,
      });
      throw error;
    }
  },

  updateVenue: async (id, data) => {
    try {
      set({ isLoading: true, error: null });

      const venue = await venueService.updateVenue(id, data);

      set((state) => ({
        venues: state.venues.map((v) => (v.id === id ? venue : v)),
        isLoading: false,
      }));

      return venue;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Error al actualizar recinto',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteVenue: async (id) => {
    try {
      set({ isLoading: true, error: null });

      await venueService.deleteVenue(id);

      set((state) => ({
        venues: state.venues.filter((v) => v.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Error al eliminar recinto',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
