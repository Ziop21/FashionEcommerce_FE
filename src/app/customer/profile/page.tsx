"use client"

import { useEffect, useState } from "react";
import Container from "@/app/components/Container";
import ViewForm from "./ViewForm";
import { ChangePasswordRequest, UserResponse } from "@/pages/api/customer/user/Models";
import findById from "@/pages/api/customer/user/findById";
import Heading from "@/app/components/Heading";
import FormWrap from "@/app/components/FormWrap";
import { ZodType, z } from "zod";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import updatePassword from "@/pages/api/customer/user/updatePassword";

interface FormData {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
}

const schema: ZodType<FormData> = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
  confirmPassword: z.string().min(1),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Confirm password do not match",
  path: ["confirmPassword"]
})

const View = () => {
  const [foundUser, setFoundUser] = useState<UserResponse>();
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await findById();
        if (response) {
          setFoundUser(response);
        } else {
          console.error("Error: Data not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
      }
    })
  const onSubmit = async (data: FormData) => {
    // console.log('data', data)
    try {
      setIsLoading(true);
      toast.loading('Please wait...', { duration: 1000 });
      const changePasswordRequest: ChangePasswordRequest = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      await updatePassword(changePasswordRequest);
      toast.success('Change password successfully')
      setIsLoading(false);
      setChangePassword(false);
      reset();
    } catch (error) {
      toast.error("Error!!!");
      console.log("Error when update: ", error);
      setIsLoading(false);
    }
  }
  return (
    <div>
      <Container>
        <div className="mt-4">
          <Heading center title="PROFILE" />
          <hr className="mt-4 bg-slate-300 w-full h-px" />
        </div>
        <div className="mt-10 px-24 w-full">
          <Button
            label={'Change password'}
            // disabled={}
            onClick={() => { setChangePassword(!changePassword) }}
          />
        </div>
        {changePassword &&
          <div className="w-2/3 mx-auto">
            <Input
              id="oldPassword"
              label="old password"
              disabled={isLoading}
              register={register}
              errors={errors}
              type="password"
              required
            />
            <Input
              id="newPassword"
              label="new password"
              disabled={isLoading}
              register={register}
              errors={errors}
              type="password"
              required
            />
            <Input
              id="confirmPassword"
              label="confirm new password"
              disabled={isLoading}
              register={register}
              errors={errors}
              type="password"
              required
            />
            <Button
              label={'Confirm'}
              // disabled={}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        }
        <ViewForm foundUser={foundUser} />
      </Container>
    </div>
  );
}

export default View;