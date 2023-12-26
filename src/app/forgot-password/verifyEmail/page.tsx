'use client'

import findEmail from "@/pages/api/guest/auth/forgotPassword/findEmail";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSearchParams } from 'next/navigation'

const Verify = () => {
    const router = useRouter();
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams) {
            const token = searchParams.get('token')
            if (token) {
                const getEmailFromToken = async () => {
                    try {
                        const email = await findEmail(token);
                        if (email) {
                            localStorage.setItem('FE_UserEmail', email);
                            localStorage.setItem('FE_Token', token);
                        }
                    } catch (error) {
                        throw error;
                    }
                }
                getEmailFromToken()
                router.push('/forgot-password/infor')
            }
        }
    }, [searchParams])
}

export default Verify;