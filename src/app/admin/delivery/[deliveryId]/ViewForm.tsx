"use client"
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import TextArea from "@/app/components/inputs/TextArea";

import { Delivery } from "@/pages/api/admin/delivery/Models";
import update from "@/pages/api/admin/delivery/update";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface ViewFormProps {
  foundDelivery?: Delivery;
}

interface FormData {
  id: string,
  name: string,
  description: string,
  isDeleted: boolean,
  isActive: boolean,
}

const schema: ZodType<FormData> = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
})


const ViewForm = (props: ViewFormProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<FieldValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (props.foundDelivery) {
      reset({
        id: props.foundDelivery.id,
        name: props.foundDelivery.name,
        description: props.foundDelivery.description,
        isDeleted: props.foundDelivery.isDeleted,
        isActive: props.foundDelivery.isActive,
      });
    }
  }, [props.foundDelivery]);

  const onEdit: SubmitHandler<FieldValues> = async () => {
    if (isEdit) {
      setIsEdit(false);
    }
    else {
      setIsEdit(true);
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (isEdit) {
      try {
        setIsEdit(false);
        toast.loading('Please wait...', { duration: 1000 });
        const deliveryData: Delivery = {
          id: data.id,
          name: data.name,
          description: data.description,
          isDeleted: data.isDeleted,
          isActive: data.isActive,
        };
        const response = await update(data.id, deliveryData);
        toast.success('Update successfully')
      } catch (error) {
        toast.error("Error!!!");
        console.log("Error when update: ", error);
        setIsEdit(true);
      }
    }
  };

  return (
    <>
      <Heading title="Delivery" />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="id"
        label="id"
        disabled={true}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="name"
        disabled={!isEdit}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="description"
        disabled={!isEdit}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckBox
        id="isActive"
        label="is active"
        disabled={!isEdit}
        register={register}
      />
      <CustomCheckBox
        id="isDeleted"
        label="is deleted"
        disabled={!isEdit}
        register={register}
      />
      <div className="flex gap-4">
        <Button
          outline={true}
          label={isEdit ? "Cancel" : "Edit"}
          custom={isEdit ? "bg-red-300" : "bg-yellow-300"}
          onClick={onEdit}
        />

        <Button
          label="Save"
          outline={true}
          disabled={!isEdit}
          custom="bg-green-300"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </>
  );
};

export default ViewForm; 