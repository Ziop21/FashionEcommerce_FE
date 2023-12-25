"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

import Heading from "@/app/components/Heading";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";

import verifyToken from "@/pages/api/guest/auth/forgotPassword/verifyToken";
import { RegisterProps } from "@/pages/api/guest/auth/register/[...nextauth]";
import toast from "react-hot-toast";
import FormWrap from "@/app/components/FormWrap";
import Container from "@/app/components/Container";

type FormData = {
    email: string | null;
    password: string;
    confirmPassword: string;
}

const Infor = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const schema: ZodType<FormData> = z.object({
        email: z.string().email(),
        password: z.string().min(5).max(16),
        confirmPassword: z.string().min(5).max(16),
    }).refine((data) => data.password === data.confirmPassword, {
        message:"Password do not match",
        path:["confirmPassword"]
    })

    const {register, handleSubmit, formState : {errors}} = 
    useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: typeof window !== 'undefined' ? localStorage.getItem("FE_UserEmail") : '',
        }
    });

    const onSubmit = async (data: FormData) => {
        console.log('data', data);
        console.log('localStorage.getItem(FE_Token)', localStorage.getItem('FE_Token'));
        setIsLoading(true);
        try {
            const registerData: RegisterProps = { 
                email: data.email ?? '', 
                password: data.password, 
                confirmPassword: data.confirmPassword };
            const response = await verifyToken(localStorage.getItem('FE_Token') ?? '', registerData);
            if (response) {
                toast.success("Reset password successfully......");
                router.push("/login");
                localStorage.removeItem('FE_UserEmail');
                localStorage.removeItem('FE_Token');
            }
        } catch (error) {
            toast.error("Reset password failed. Please try again...")
            router.push("/forgot-password");
            localStorage.removeItem('FE_UserEmail');
            localStorage.removeItem('FE_Token');
        }
    }

    return (
        <>
        <Container>
            <FormWrap>
                <Heading title="Reset password" />
                <Input 
                id={"email"} 
                label="email" 
                register={register}
                disabled={true}
                errors = {errors}/>
                <Input 
                id={"password"} 
                label="password" 
                register={register}
                type="password"
                disabled={isLoading}
                errors = {errors}/>
                <Input 
                id={"confirmPassword"} 
                label="confirm password" 
                register={register}
                type="password"
                disabled={isLoading}
                errors = {errors}/>
                <Button label={"Submit"}
                    disabled={isLoading}
                    onClick={handleSubmit(onSubmit)} />
            </FormWrap>
        </Container>
    </>
    );
}
export default Infor;