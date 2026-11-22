import axios from 'axios';

const getBaseUrl = () => {
  const configuredUrl = process.env.REACT_APP_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, '');
  }
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  
  return '';
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Request interceptor to automatically add auth token
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL?.trim()) {
      return Promise.reject(new Error('The production API URL is not configured. Set REACT_APP_API_URL in the frontend Render service and redeploy.'));
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
