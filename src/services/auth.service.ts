import apiClient from '@/lib/axios';
import Cookies from 'js-cookie';

export interface LoginResponse {
  access_token: string;
  spoc_user: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    is_account_owner: boolean;
  };
  b2b_client: {
    id: string;
    company_name: string;
    status: string;
  };
}

export interface RegisterPayload {
  full_name: string;
  phone: string;
  password: string;
  company_name: string;
  company_email: string;
  company_address: string;
  designation: string;
  annual_travel_budget: number;
  company_size: string;
  terms_accepted: boolean;
}

const authService = {
  async login(email: string, password: string, rememberMe = false): Promise<LoginResponse> {
    const { data } = await apiClient.post('/auth/b2b/login', {
      email,
      password,
      remember_me: rememberMe,
    });
    return data.data ?? data;
  },

  async register(payload: RegisterPayload): Promise<{ message: string; client_reference_id: string }> {
    const { data } = await apiClient.post('/b2b/register', payload);
    return data.data ?? data;
  },

  async logout(): Promise<void> {
    try {
      // The backend revokes the token's jti so the old Bearer token cannot be reused.
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Local logout must still complete if the network is unavailable.
      console.error('Server token revocation failed:', error);
    } finally {
      Cookies.remove('token', { path: '/' });
      Cookies.remove('spoc_user', { path: '/' });
      Cookies.remove('b2b_client', { path: '/' });
    }
  },

  getStoredUser() {
    try {
      const raw = Cookies.get('spoc_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getStoredClient() {
    try {
      const raw = Cookies.get('b2b_client');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveSession(data: LoginResponse, rememberMe: boolean) {
    const options = rememberMe ? { expires: 30 } : undefined;
    Cookies.set('token', data.access_token, options);
    Cookies.set('spoc_user', JSON.stringify(data.spoc_user), options);
    Cookies.set('b2b_client', JSON.stringify(data.b2b_client), options);
  },
};

export default authService;
