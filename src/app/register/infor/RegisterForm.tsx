"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

import Heading from "@/app/components/Heading";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";

import registerAPI from "@/pages/api/guest/auth/register/[...nextauth]";
import { RegisterProps } from "@/pages/api/guest/auth/register/[...nextauth]";
import toast from "react-hot-toast";
import DropdownCheckout from "@/app/components/inputs/DropdownCheckout";

type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string,
    roadAddress: string,
    address: string,
}

const RegisterForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const schema: ZodType<FormData> = z.object({
        email: z.string().email(),
        password: z.string().min(5).max(16),
        confirmPassword: z.string().min(5).max(16),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phone: z.string().length(10),
        roadAddress: z.string().min(1),
        address: z.string().min(1),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match",
        path: ["confirmPassword"]
    })

    const { register, handleSubmit, formState: { errors }, setValue, getValues } =
        useForm<FormData>({
            resolver: zodResolver(schema),
            defaultValues: {
                email: localStorage.getItem('FE_UserEmail') ?? '',
            }
        });

    const onSubmit = async (data: FormData) => {
        // console.log('data', data)
        setIsLoading(true);
        const registerData: RegisterProps = {
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            address: data.address
        };
        const response = await registerAPI(registerData);
        if (response) {
            toast.success("Register successfully......");
            router.push("/login");
            localStorage.removeItem('FE_UserEmail');
        }
    }

    const [code, setCode] = useState({
        city: 0,
        districts: 0,
        ward: 0
    });
    useEffect(() => {
        setValue('address', `${getValues('roadAddress')}, ${ward}, ${district}, ${city}`)
    }, [code])
    const [city, setCity] = useState<string>('');
    const [district, setDistrict] = useState<string>('');
    const [ward, setWard] = useState<string>('');
    const handleCityChange = (selectedKey: number, name: string) => {
        setCode((prevCode) => ({
            ...prevCode,
            city: selectedKey,
        }));
        setCity(name);
    };

    const handleDistrictChange = (selectedKey: number, name: string) => {
        setCode((prevCode) => ({
            ...prevCode,
            districts: selectedKey,
        }));
        setDistrict(name);
    };

    const handleWardChange = (selectedKey: number, name: string) => {
        setCode((prevCode) => ({
            ...prevCode,
            ward: selectedKey,
        }));
        setWard(name);
    };

    return (
        <>
            <Heading title="Register" />
            <Input
                id={"email"}
                label="email"
                register={register}
                disabled={true}
                errors={errors} />
            <Input
                id={"firstName"}
                label="first name"
                register={register}
                errors={errors} />
            <Input
                id={"lastName"}
                label="last name"
                register={register}
                errors={errors} />
            <Input
                id={"phone"}
                label="phone"
                register={register}
                errors={errors} />
            <Input
                id={"roadAddress"}
                label="address"
                register={register}
                errors={errors} />
            <DropdownCheckout placeholder="Province"
                type="province"
                code={code}
                onChange={handleCityChange}
            />
            <DropdownCheckout placeholder="District" type="district" code={code}
                onChange={handleDistrictChange}
            />
            <DropdownCheckout placeholder="Ward" type="ward" code={code}
                onChange={handleWardChange}
            />
            <Input
                id={"password"}
                label="password"
                register={register}
                type="password"
                disabled={isLoading}
                errors={errors} />
            <Input
                id={"confirmPassword"}
                label="confirm password"
                register={register}
                type="password"
                disabled={isLoading}
                errors={errors} />
            <Button label={"Submit"}
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)} /></>
    )
}

export default RegisterForm;