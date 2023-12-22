'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import verifyEmailToken from "@/pages/api/guest/auth/register/verifyEmailToken";
import toast from "react-hot-toast";

const verify = (token: string) => {
    const router = useRouter();
    
    useEffect(() => {
        if (token) {
            const verifyToken = async () => {
                console.log("token");
                console.log(token.searchParams.token);
                const response = await verifyEmailToken(token.searchParams.token);
                if (response) {
                    localStorage.setItem('FE_UserEmail', response)
                    toast.success("Verify successfully...")
                    router.push("/register/infor")
                }
            }
            verifyToken();
        }
    }, [token])
    
    
}
 
export default verify;