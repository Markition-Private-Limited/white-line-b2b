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
    // Agar API 401 return karti hai, iska matlab token expire ho gaya ya invalid hai
    if (error.response && error.response.status === 401) {
      // Yahan hum user ko logout karwa sakte hain aur login screen pe bhej sakte hain
      Cookies.remove('token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;
