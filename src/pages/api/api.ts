import axios from 'axios';
import { API_BACKEND_URL } from '@/config/ApplicationConfig';

const api = axios.create({
  baseURL: API_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.headers['Content-Type']= 'application/json';
  return config;
});

export default api;
