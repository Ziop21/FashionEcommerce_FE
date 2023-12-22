import refreshToken from "@/server/api/refreshToken";

export const RefreshTokenHandler = async () => {
  try {
    const jwt = await refreshToken();   
    if (jwt) {
      return jwt;
    }
    return undefined;
  } catch (error) {
    throw error;
  }
};
