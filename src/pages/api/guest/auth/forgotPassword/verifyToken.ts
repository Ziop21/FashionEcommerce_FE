import axios from "axios";
import { RegisterProps } from "../register/[...nextauth]";
import api from "@/pages/api/api";

const verifyToken =  async (token: string, registerData: RegisterProps) => {
  try {
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
