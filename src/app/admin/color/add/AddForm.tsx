"use client"

import { useState } from "react";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Button from "@/app/components/Button";
import callApiRoute from "@/pages/api/admin/color/add";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";

import { Color } from "@/pages/api/admin/color/Models";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface FormData {
  name: string,
  code: string,
  isDeleted: boolean,
  isActive: boolean,
}

const schema: ZodType<FormData> = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
})

const AddForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: "",
        code: "",
        isDeleted: true,
        isActive: false
      }
    })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const colorData: Color = {
        name: data.name,
        code: data.code,
        isDeleted: data.isDeleted,
        isActive: data.isActive,
      };

      const response = await callApiRoute(colorData);
      toast.success("Create color successfull")
    } catch (error) {
      toast.error("Error...");
      console.error("Error when call API", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading title="New Color" />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="name"
        label="name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="code"
        label="code"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type={"color"}
      />
      <CustomCheckBox
        id="isActive"
        label="is active"
        disabled={isLoading}
        register={register}
      />
      <CustomCheckBox
        id="isDeleted"
        label="is deleted"
        disabled={isLoading}
        register={register}
      />
      <Button
        outline={true}
        custom="bg-green-300"
        label={isLoading ? "Loading" : "Add"}
        onClick={handleSubmit(onSubmit)} />
    </>
  );
}

export default AddForm;