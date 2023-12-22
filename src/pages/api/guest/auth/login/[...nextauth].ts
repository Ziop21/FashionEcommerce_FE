import Cookies from 'js-cookie';

import api from "@/pages/api/api";
import { JWT_REFRESH_COOKIE_NAME, JWT_COOKIE_NAME, COOKIE_EXPIRED_DAY } from "@/config/ApplicationConfig";

export interface LoginProps {
  email: string;
  password: string;
}

const Login = async (loginProps: LoginProps) => {
  try {
    const response = await api.post('/api/guest/auth/login', {
      email: loginProps.email,
      password: loginProps.password,
    });
    const jwt = response.data.jwt;
    const refreshJwt = response.data.refreshJwt;
    Cookies.set(JWT_COOKIE_NAME, jwt, { expires: COOKIE_EXPIRED_DAY, path: '/' });
    Cookies.set(JWT_REFRESH_COOKIE_NAME, refreshJwt, { expires: COOKIE_EXPIRED_DAY, path: '/' });
    return response;
  } catch (error) {
    throw error;
  }
};

export default Login;