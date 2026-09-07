import apiClient from '@/lib/axios';

export interface Profile {
  spoc: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    is_account_owner: boolean;
    last_login?: string;
  };
  client: {
    id: string;
    company_name: string;
    company_email: string;
    company_phone?: string;
    company_address: string;
    status: string;
  };
}

const profileService = {
  async get(): Promise<Profile> {
    const { data } = await apiClient.get('/b2b/profile');
    return data.data ?? data;
  },

  async update(payload: Partial<{ company_name: string; company_phone: string; company_address: string }>): Promise<Profile> {
    const { data } = await apiClient.patch('/b2b/profile', payload);
    return data.data ?? data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await apiClient.patch('/b2b/profile/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return data.data ?? data;
  },
};

export default profileService;
