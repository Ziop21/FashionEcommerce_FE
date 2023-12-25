"use client"

import { useState } from "react";
import {FieldValues ,SubmitHandler, useForm} from "react-hook-form"
import { AiOutlineGoogle } from "react-icons/ai";
import Link from "next/link";
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation";

import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import Button from "../components/Button";

import Login from '@/pages/api/guest/auth/login/[...nextauth]';
import { LoginProps } from "@/pages/api/guest/auth/login/[...nextauth]";

const LoginForm = () => {

    const router = useRouter();

    if (typeof window !== 'undefined') {
  // Perform localStorage action
  const item = localStorage.getItem('key')
}

    const [isLoading, setIsLoading ] = useState(false);
    const {register, handleSubmit, formState : {errors}} = 
    useForm<FieldValues>({
        defaultValues: {
        email: typeof window !== 'undefined' ? localStorage.getItem("FE_UserEmail") : "",
        password: "",
    }
    })

    const onSubmit:SubmitHandler<FieldValues> = async (data) =>  {
        setIsLoading(true);
        const loginProps: LoginProps = {
            email: data.email,
            password: data.password
        };
        try {
            const response = await Login(loginProps)
            if (response) {
                setIsLoading(false);
                toast.success("Login successfully......");
                router.push('/');
            }
        } catch (error) {
            setIsLoading(false);
            toast.error("Email or password doesn't match......");
        }
       
    }

    return ( 
        <>
            <Heading title="Sign in to our shop " />
            <hr className="bg-slate-300 w-full h-px"/>
            {/* <Button
            outline
            label="Continue with Google"    
            icon={AiOutlineGoogle}
            onClick={()=>{}}
            /> */}
            <Input
            id="email"
            label="Email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            />            
            <Input
            id="password"
            label="Password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
            />    
            <Button label = {isLoading? "Loading" : 'Login'}
            onClick={handleSubmit(onSubmit)} />
        <p className="text-sm">
            <Link className="underline" href={'/forgot-password'}>
            Forgot your password
            </Link>
        </p>
        <p className="text-sm">
            Do not have an account ? <Link className="underline" href={'/register'}>
            Sign Up
            </Link>
        </p>
        </>
     );
}
 
export default LoginForm;