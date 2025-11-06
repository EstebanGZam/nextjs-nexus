import apiClient from '../lib/apiClient';
import type { Permission, PaginatedResponse, QueryParams, ApiResponse } from '../lib/types';

const API_ENDPOINT = '/permissions';

/**
 * Lista paginada de permisos.
 */
export const getPermissions = async (
  params: QueryParams
): Promise<PaginatedResponse<Permission>> => {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.search) search.set('search', String(params.search));

  const qs = search.toString();
  const url = qs ? `${API_ENDPOINT}?${qs}` : API_ENDPOINT;

  const response = await apiClient.get<PaginatedResponse<Permission>>(url);
  return response.data;
};

/**
 * Obtener un permiso por id (por si luego lo necesitas).
 */
export const getPermissionById = async (id: string): Promise<Permission> => {
  const response = await apiClient.get<ApiResponse<Permission>>(`${API_ENDPOINT}/${id}`);
  return response.data.data;
};

const permissionService = { getPermissions, getPermissionById };
export default permissionService;
