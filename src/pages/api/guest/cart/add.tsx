import { API_BACKEND_URL } from "@/config/ApplicationConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const add = async (rightResponse: NextResponse) => {
  try {
    const response = await fetch(API_BACKEND_URL + "/api/guest/cart ", {
      method: "POST", 
      headers: {
        Cookie: cookies().toString(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const resp = response.clone();
    rightResponse.cookies.set('response', await resp.text(), {sameSite: 'none', secure: true})
    rightResponse.cookies.set('json', await resp.json(), {sameSite: 'none', secure: true})
    // const data = await response.json();
    
    // if (data.status === 401) {
    //   return undefined;
    // }
    // return data.cartToken;
  } catch (error: any) {
    console.error("error", error);
    throw error;
  }
};

export default add; 
