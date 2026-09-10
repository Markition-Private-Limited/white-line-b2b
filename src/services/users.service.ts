import apiClient from '@/lib/axios';

export interface SpocUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  is_account_owner: boolean;
  last_login?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

const usersService = {
  async list(page = 1): Promise<PaginatedResponse<SpocUser>> {
    const { data } = await apiClient.get('/b2b/users', { params: { page } });
    return data.data ?? data;
  },

  async create(payload: { full_name: string; email: string; password: string; role: string }): Promise<SpocUser> {
    const { data } = await apiClient.post('/b2b/users', {
      full_name: payload.full_name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    });
    return data.data ?? data;
  },

  async toggleStatus(id: string): Promise<SpocUser> {
    const { data } = await apiClient.patch(`/b2b/users/${id}/toggle-status`);
    return data.data ?? data;
  },

  async changePassword(id: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await apiClient.patch(`/b2b/users/${id}/change-password`, { new_password: newPassword });
    return data.data ?? data;
  },

  // fromId = current owner's spoc id (the one giving up ownership)
  // toId   = the spoc user receiving ownership
  async transfer(fromId: string, toId: string): Promise<{ message: string }> {
    const { data } = await apiClient.patch(`/b2b/users/${fromId}/transfer`, { to_user_id: toId });
    return data.data ?? data;
  },
};

export default usersService;
