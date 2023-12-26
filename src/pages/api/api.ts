import axios from 'axios';
import { API_BACKEND_URL, AUTHORIZATION_TYPE, JWT_COOKIE_NAME } from '@/config/ApplicationConfig';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: API_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.headers['Content-Type']= 'application/json';
  const jwt = Cookies.get(JWT_COOKIE_NAME)
  if (jwt) {
    config.headers['Authorization']= AUTHORIZATION_TYPE + " " + jwt;
  }
  return config;
});

export default api;
