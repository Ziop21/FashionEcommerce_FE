'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import verifyEmailToken from "@/pages/api/guest/auth/register/verifyEmailToken";
import toast from "react-hot-toast";

const Verify = (token: any) => {
    const router = useRouter();
    
    useEffect(() => {
        if (token) {
            const verifyToken = async () => {
                console.log("token");
                console.log(token.searchParams.token);
                const response = await verifyEmailToken(token.searchParams.token);
                if (response) {
                    await new Promise<void>(resolve => {
                        localStorage.setItem('FE_UserEmail', response);
                        resolve();
                    });                    
                    toast.success("Verify successfully...")
                    router.push("/register/infor")
                }
            }
            verifyToken();
        }
    }, [token])
    
    
}
 
export default Verify;