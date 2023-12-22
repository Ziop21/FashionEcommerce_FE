import axios from "axios";
import { API_BACKEND_URL } from "@/config/ApplicationConfig";
import { RegisterProps } from "../register/[...nextauth]";

const API_BASE_URL = API_BACKEND_URL;

const verifyToken =  async (token: string, registerData: RegisterProps) => {
  try {
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
    });
    const response = await api.post('/api/guest/auth/forgot-password/verify?token=' + token, {
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
      });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Can't get data from API");
    throw error;  
  }
};

export default verifyToken;
