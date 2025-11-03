/**
 * Venue Service
 */

import { get, post, patch, del } from '@/src/lib/apiClient';
import type { Venue, CreateVenueDTO, UpdateVenueDTO } from '@/src/lib/types';

/**
 * Get all venues
 */
async function getVenues(): Promise<Venue[]> {
  return get<Venue[]>('/venues');
}

/**
 * Get venue by ID
 */
async function getVenueById(id: string): Promise<Venue> {
  return get<Venue>(`/venues/${id}`);
}

/**
 * Create new venue
 */
async function createVenue(data: CreateVenueDTO): Promise<Venue> {
  return post<Venue, CreateVenueDTO>('/venues', data);
}

/**
 * Update venue
 */
async function updateVenue(id: string, data: UpdateVenueDTO): Promise<Venue> {
  return patch<Venue, UpdateVenueDTO>(`/venues/${id}`, data);
}

/**
 * Delete venue
 */
async function deleteVenue(id: string): Promise<void> {
  return del<void>(`/venues/${id}`);
}

const venueService = {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
};

export default venueService;
