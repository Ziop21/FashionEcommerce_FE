'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import verifyEmailToken from "@/pages/api/guest/auth/register/verifyEmailToken";
import toast from "react-hot-toast";

interface VerifyProps {
    searchParams: {
        token: string;
    }
}

const Verify = (token: VerifyProps) => {
    const router = useRouter();

    useEffect(() => {
        if (token) {
            const verifyToken = async () => {
                console.log("token");
                console.log(token.searchParams.token);
                try {
                    const response = await verifyEmailToken(token.searchParams.token);
                    if (response) {
                        localStorage.setItem('FE_UserEmail', response);
                        toast.success("Verify successfully...")
                        router.push("/register/infor")
                    }
                } catch (error) {
                    throw error;
                }
              
            }
            verifyToken();
        }
    }, [token])


}

export default Verify;