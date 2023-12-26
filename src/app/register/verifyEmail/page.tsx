'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSearchParams } from 'next/navigation'

import verifyEmailToken from "@/pages/api/guest/auth/register/verifyEmailToken";
import toast from "react-hot-toast";

// interface VerifyProps {
//     searchParams: {
//         token: string;
//     }
// }

const Verify = () => {
    const router = useRouter();
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams) {
            const token = searchParams.get('token')
            if (token){
                const verifyToken = async () => {
                    console.log("token");
                    console.log(token);
                    try {
                        const response = await verifyEmailToken(token);
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
        }
    }, [searchParams])


}

export default Verify;