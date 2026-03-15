import axios from 'axios';

const api = axios.create({
  baseURL: 'http://api', // Note: Make sure the backend port matches (set to 5000 in .env)
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
