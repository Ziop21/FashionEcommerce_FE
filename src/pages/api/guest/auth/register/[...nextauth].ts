
import axios from 'axios';
import { API_BACKEND_URL } from '@/config/ApplicationConfig';

export interface RegisterProps {
  email: string;
  password: string;      
  confirmPassword: string;
  firstName: string,
  lastName: string,
  phone: string,
  address: string,
}

const API_BASE_URL = API_BACKEND_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


const Register = async (registerData: RegisterProps) => {
  try {
    const response = await api.post('/api/guest/auth/register', {
      email: registerData.email,
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      phone: registerData.phone,
      address: registerData.address,
    });

    return response.data;
    
    }
   catch (error) {
    throw error;
  }
};

export default Register;
