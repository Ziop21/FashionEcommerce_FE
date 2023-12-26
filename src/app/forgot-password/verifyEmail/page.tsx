'use client'

import findEmail from "@/pages/api/guest/auth/forgotPassword/findEmail";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Verify = (token: any) => {
    const router = useRouter();
    useEffect(() => {
        const getEmailFromToken = async () => {
            const email = await findEmail(token.searchParams.token);
            if (email) {
                await new Promise<void>(resolve => {
                    localStorage.setItem('FE_UserEmail', email);
                    localStorage.setItem('FE_Token', token.searchParams.token);
                    resolve();
                });
            }
        }
        getEmailFromToken();
        router.push('/forgot-password/infor')
    }, [token])
}

export default Verify;