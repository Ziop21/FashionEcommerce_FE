import { JOSE_AUDIENCE, JOSE_ISSUER, JWT_SECRET_KEY } from "@/config/ApplicationConfig";
import * as jose from 'jose';

const AuthenJwtDecoder = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(
      JWT_SECRET_KEY,
    )
    
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: JOSE_ISSUER,
      audience: JOSE_AUDIENCE,
    })
    return payload;
  } catch (error) {
    throw error
  }
};

export default AuthenJwtDecoder;
