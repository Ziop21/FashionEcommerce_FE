import axios from "axios";
import { API_BACKEND_URL } from "@/config/ApplicationConfig";

const API_BASE_URL = API_BACKEND_URL;

const sendToken =  async (email: string) => {
  try {
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
    });
    const response = await api.post('/api/guest/auth/forgot-password/send-token/' + email);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Can't get data from API");
    throw error;  
  }
};

export default sendToken;
