import { API_BACKEND_URL } from "@/config/ApplicationConfig";
import { cookies } from "next/headers";

const add = async () => {
  try {
    const response = await fetch(API_BACKEND_URL + "/api/guest/cart ", {
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
    return data.cartToken;
  } catch (error: any) {
    console.error("error", error);
    throw error;
  }
};

export default add; 
