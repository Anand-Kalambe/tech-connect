import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tech-connect-backed.onrender.com/api',
});

api.interceptors.request.use((config) => {
  // Support both old and new key names during migration
  const token = localStorage.getItem('w3b_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('w3b_token');
      localStorage.removeItem('w3b_user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
