"use client"

import { useState } from "react";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import {FieldValues ,SubmitHandler, useForm} from "react-hook-form"
import Button from "@/app/components/Button";
import callApiRoute from "@/pages/api/admin/delivery/add";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import { Delivery } from "@/pages/api/admin/delivery/Models";
import TextArea from "@/app/components/inputs/TextArea";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface FormData {
  name: string,
  description: string,
  isDeleted: boolean,
  isActive: boolean,
}

const schema: ZodType<FormData> = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
})

const AddForm = () => {
    const [isLoading, setIsLoading ] = useState(false);

    const {register, handleSubmit, formState : {errors}} = 
    useForm<FieldValues>({
        resolver: zodResolver(schema),
        defaultValues: {
          name: "",
          description: "",
          isDeleted: true,
          isActive: false,
    }
    })

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
      setIsLoading(true);
      try {
        const deliveryData: Delivery = {
          name: data.name,
          description: data.description,
          isDeleted: data.isDeleted,
          isActive: data.isActive,
        };
        
        const response = await callApiRoute(deliveryData);
        toast.success("Create delivery successfull")
      } catch (error) {
        toast.error("Error...");
        console.error("Error when call API", error);
      } finally {
        setIsLoading(false);
      }
    };


    return (
        <>
          <Heading title="New Delivery" />
          <hr className="bg-slate-300 w-full h-px" />
          <Input
            id="name"
            label="name"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <TextArea
            id="description"
            label="description"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
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
          outline = {true}
          custom="bg-green-300" 
          label={isLoading ? "Loading" : "Add"} 
          onClick={handleSubmit(onSubmit)} />
        </>
    );
}
 
export default AddForm;