import apiClient from '../lib/apiClient';
import {
  User,
  PaginatedResponse,
  QueryParams,
  CreateUserDto,
  UpdateUserDto,
  ApiResponse,
} from '../lib/types';
import { buildQueryString } from '../lib/utils';

const API_ENDPOINT = '/users';

export const getUsers = async (params: QueryParams): Promise<PaginatedResponse<User>> => {
  const queryString = buildQueryString(params);
  const response = await apiClient.get<PaginatedResponse<User>>(`${API_ENDPOINT}?${queryString}`);
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(`${API_ENDPOINT}/${id}`);
  return response.data.data;
};

export const createUser = async (data: CreateUserDto): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>(API_ENDPOINT, data);
  return response.data.data;
};

export const updateUser = async (id: string, data: UpdateUserDto): Promise<User> => {
  const response = await apiClient.patch<ApiResponse<User>>(`${API_ENDPOINT}/${id}`, data);
  return response.data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINT}/${id}`);
};

/** Nuevo: bloquear / desbloquear usuario.
 *  Enviamos ambos nombres de propiedad para tolerar la decisión final del backend.
 */
export const toggleBlockUser = async (id: string, isBlocked: boolean): Promise<User> => {
  const payload = { isBlocked, isBloqued: isBlocked };
  const response = await apiClient.patch<ApiResponse<User>>(`${API_ENDPOINT}/${id}`, payload);
  return response.data.data;
};

const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser, // lo dejo por compatibilidad, aunque ya no lo uses
  toggleBlockUser, // nuevo
};

export default userService;
