import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for sending Token & handling FormData
apiClient.interceptors.request.use(
  (config) => {
    // Cookie se token nikalte hain
    const token = Cookies.get('token'); 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If request data is FormData, remove Content-Type header so Axios and browser set multipart boundary properly
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for handling Errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const requestUrl = String(error.config?.url || '');
    const isAuthRequest = requestUrl.includes('/auth/b2b/') || requestUrl.includes('/b2b/register');
    const hasSession = Boolean(Cookies.get('token'));

    // A 401 from a protected request means the saved session is no longer valid.
    // Login/OTP 401s are expected validation responses and must stay on the form
    // so the API error can be shown to the user.
    if (error.response?.status === 401 && hasSession && !isAuthRequest) {
      Cookies.remove('token');
      Cookies.remove('spoc_user');
      Cookies.remove('b2b_client');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
