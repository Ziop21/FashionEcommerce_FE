
import axios from 'axios';

import { API_BACKEND_URL } from "@/config/ApplicationConfig";

const API_BASE_URL = API_BACKEND_URL;

const Logout = async () => {
  try {
    // const jwt = localStorage.getItem("jwt");
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': jwt,
      },
      withCredentials: true,
    });
    const response = await api.post('/api/auth/logout');
    return response;
    }
   catch (error) {
    throw error;
  }
};

export default Logout;
