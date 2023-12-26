"use client"
import { useEffect, useState } from "react";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast";

import Heading from "../components/Heading";
import Button from "../components/Button";
import Input from "../components/inputs/Input";

import sendToken from "@/pages/api/guest/auth/register/sendToken";
import { JWT_EMAIL_EXPIRATION } from "@/config/ApplicationConfig";

type FormData = {
    email: string;
}

const EmailInputForm = () => {
    const [isLoading, setIsLoading ] = useState(false);
    const [canReSend, setCanReSend ] = useState(false);
    const [timer, setTimer ] = useState<number>();

    const schema: ZodType<FormData> = z.object({
        email: z.string().email(),
    })

    useEffect(() => {
        if (timer === 0){
            setCanReSend(true);
            setIsLoading(false);
        }
    }, [timer])

    const {register, handleSubmit, formState : {errors}} = 
    useForm<FormData>({resolver: zodResolver(schema)});

    const onSubmit = async (data: FormData) => {
        try {
            // localStorage.setItem('FE_UserEmail', data.email)
            setIsLoading(true);
            const response = await sendToken(data.email);
            toast.success("Send token successfully......");
            console.log(response);
            let seconds: number = JWT_EMAIL_EXPIRATION;
            const makeIteration = (): void => {
                if (seconds > 0) {
                    setTimeout(makeIteration, 1000);
                }
                setTimer(seconds);
                seconds -= 1;
            };
            setTimeout(makeIteration, 1000);
        } catch (error) {
            toast.error("Email existed......");
            setIsLoading(false);
        }
        
    }

    return (
        <>
        <>
            <Heading title="Type your email" />
            <Input 
            id={"email"} 
            label="email" 
            disabled = {isLoading}
            register={register}
            errors = {errors}/>
            {!canReSend && 
            <>
            <Button label={isLoading ? "Loading" : "Submit"}
            disabled = {isLoading}
            custom={isLoading ? "bg-red-700" : ""}
            onClick={handleSubmit(onSubmit)} />
            </>
            }
           
        </>
        {timer && 
        <>
            <Heading title="Verify your email" />
            <div className="items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-pink-500 border-solid rounded-full animate-spin"></div>
            </div>
            
            <div>{timer}</div>
        </>
        }
        {canReSend && 
        <>
        <Button label="Resend email"
            disabled = {isLoading}
            custom={isLoading ? "bg-red-700" : ""}
            onClick={handleSubmit(onSubmit)} />
        </>
        }
        </>
    )
}
 
export default EmailInputForm;