"use client"

import { useEffect, useState } from "react";
import Heading from "@/app/components/Heading";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import { ZodNaN, ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import addProduct from "@/pages/api/admin/product/add";
import toast from "react-hot-toast";
import Input from "@/app/components/inputs/Input";
import TextArea from "@/app/components/inputs/TextArea";
import ImagesContainer from "@/app/components/inputs/ImagesContainer";
import { v4 } from "uuid";
import { Product } from "@/pages/api/admin/product/Models";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";

interface FormData {
  name: string,
  description: string,
  price: number,
  promotionalPrice?: number,
  isSelling: boolean,
  images: File[],
  isActive: boolean,
  isDeleted: boolean
}
const schema: ZodType<FormData> = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  promotionalPrice: z.any().nullable().refine((val) => typeof val === "number" || val >= 0, {
    message: "promotional price must be a number greater than or equal to 0",
  }),
  isSelling: z.boolean(),
  images: z.array(z.any()).min(1),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
});

const AddForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: null,
        description: null,
        price: null,
        promotionalPrice: null,
        isSelling: false,
        images: null,
        isActive: false,
        isDeleted: true
      }
    })

  const { fields: imageFields, append: imageAppend, remove: imageRemove } = useFieldArray({
    control,
    name: 'images',
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let files: File[] = data.images;
    let fileNames: string[] = [];
    let uploadFiles: File[] = [];
    if (files) {
      fileNames = files.map((file) => {
        let fileName: any = file;
        if (file.name) {
          const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
          const fileExtension = file.name.split('.').pop();
          fileName = `${fileNameWithoutExtension}_${v4().replace(/-/g, '_')}.${fileExtension}`;
          const updatedNameFile: File = new File([file.slice()], fileName, { type: file.type });
          uploadFiles.push(updatedNameFile);
        }
        return fileName;
      })
    }
    try {
      const productData: Product = {
        name: data.name,
        description: data.description,
        price: data.price,
        promotionalPrice: data.promotionalPrice,
        isSelling: data.isSelling,
        images: fileNames,
        view: 0,
        rating: 0,
        isDeleted: data.isDeleted,
        isActive: data.isActive,
      };
      await addProduct(productData);
      if (uploadFiles) {
        await Promise.all(uploadFiles.map(async (file) => {
          const imageRef = ref(storage, `images/product/${file.name}`);
          await uploadBytes(imageRef, file);
        }));
      }
      toast.success('Create product success...')
    } catch (error) {
      toast.error("Error!!!");
      console.error("Error when call API", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading title="New Product" />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="name"
        label="name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type={"text"}
      />
      <TextArea
        id="description"
        label="description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="price"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type={"number"}
      />
      <Input
        id="promotionalPrice"
        label="promotional price"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type={"number"}
      />
      <CustomCheckBox
        id="isSelling"
        label="is selling"
        disabled={isLoading}
        register={register}
      />
      <div className="w-full flex">
        <ImagesContainer
          id='images'
          label="images"
          itemLabel="image"
          storagePath="images/product/"
          disabled={false}
          custom="w-full"
          register={register}
          getValues={getValues}
          setValue={setValue}
          errors={errors}
          fields={imageFields}
          append={imageAppend}
          remove={imageRemove}
        />
      </div>
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
