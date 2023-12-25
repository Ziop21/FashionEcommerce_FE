
import api from '@/pages/api/api';

export interface RegisterProps {
  email: string;
  password: string;      
  confirmPassword: string;
  firstName?: string,
  lastName?: string,
  phone?: string,
  address?: string,
}

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
