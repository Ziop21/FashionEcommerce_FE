import refreshToken from "@/server/api/refreshToken";

export const RefreshTokenHandler = async (refreshJWT: string) => {
  try {
    const jwt = await refreshToken(refreshJWT);   
    if (jwt) {
      return jwt;
    }
    return undefined;
  } catch (error) {
    throw error;
  }
};
