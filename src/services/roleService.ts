import apiClient from '@/src/lib/apiClient';

export interface Role {
  id: string;
  name: string;
  description?: string;
}

/**
 * Get public roles for registration (no auth required)
 */
async function getPublicRoles(): Promise<Role[]> {
  const response = await apiClient.get<Role[]>('/roles/public');
  return response.data;
}

/**
 * Get roles for admin user creation (auth required)
 */
async function getAdminCreatableRoles(): Promise<Role[]> {
  const response = await apiClient.get<Role[]>('/roles/admin-creatable');
  return response.data;
}

const roleService = {
  getPublicRoles,
  getAdminCreatableRoles,
};

export default roleService;
