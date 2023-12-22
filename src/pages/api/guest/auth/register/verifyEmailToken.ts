import axios from "axios";
import { API_BACKEND_URL } from "@/config/ApplicationConfig";

const API_BASE_URL = API_BACKEND_URL;

const verifyEmailToken =  async (token: string) => {
  try {
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
    });
    const response = await api.post('/api/guest/auth/register/verify?token=' + token);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Can't get data from API");
    throw error;  
  }
};

export default verifyEmailToken;
