"use server"
import { API_BACKEND_URL } from "@/config/ApplicationConfig";
import { cookies } from "next/headers";

const refreshToken = async () => {
  try {
    const response = await fetch(API_BACKEND_URL + "/api/auth/refresh-token", {
      method: "POST", 
      headers: {
        Cookie: cookies().toString(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === 401) {
      return undefined;
    }
    return data.jwtRefresh;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export default refreshToken;
