"use client"

import { useEffect, useState } from "react";
import Heading from "@/app/components/Heading";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import { ZodNaN, ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import addStock from "@/pages/api/admin/stock/add";
import toast from "react-hot-toast";
import Input from "@/app/components/inputs/Input";
import TextArea from "@/app/components/inputs/TextArea";
import ImagesContainer from "@/app/components/inputs/ImagesContainer";
import { v4 } from "uuid";
import { Review, Stock } from "@/pages/api/admin/stock/Models";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import DropdownInput from "@/app/components/inputs/DropdownInput";
import { Product } from "@/pages/api/admin/product/Models";
import { Size } from "@/pages/api/admin/size/Models";
import { Color } from "@/pages/api/admin/color/Models";

interface AddFormProps {
  allProducts?: Product[],
  allSizes?: Size[], 
  allColors?: Color[], 
}

interface FormData {
  productId: string,
  sizeId: string,
  colorId: string,
  quantity: number,
  reviews: Review[] | null,
  isActive: boolean,
  isDeleted: boolean
}

const reviewSchema = z.object({
  userId: z.string().min(1),
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  images: z.array(z.string().min(1)),
  isActive: z.boolean(),
  isDeleted: z.boolean()
});

const schema: ZodType<FormData> = z.object({
  productId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  quantity: z.number().int().min(0),
  reviews: z.array(reviewSchema).nullable(),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
});

const AddForm: React.FC<AddFormProps> = ({
  allProducts,
  allColors,
  allSizes,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        productId: '',
        sizeId: '',
        colorId: '',
        quantity: 0,
        reviews: null,
        isDeleted: true,
        isActive: false,
      }
    })

  const { fields: reviewFields, append: reviewAppend, remove: reviewRemove } = useFieldArray({
    control,
    name: 'reviews',
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log('data', data)
    setIsLoading(true);
    // let files: File[] = data.images;
    // let fileNames: string[] = [];
    // let uploadFiles: File[] = [];
    // if (files) {
    //   fileNames = files.map((file) => {
    //     let fileName: any = file;
    //     if (file.name) {
    //       const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
    //       const fileExtension = file.name.split('.').pop();
    //       fileName = `${fileNameWithoutExtension}_${v4().replace(/-/g, '_')}.${fileExtension}`;
    //       const updatedNameFile: File = new File([file.slice()], fileName, { type: file.type });
    //       uploadFiles.push(updatedNameFile);
    //     }
    //     return fileName;
    //   })
    // }
    try {
      const stockData: Stock = {
        productId: data.productId,
        sizeId: data.sizeId,
        colorId: data.colorId,
        quantity: data.quantity,
        reviews: data.reviews,
        isDeleted: data.isDeleted,
        isActive: data.isActive,
      };
      await addStock(stockData);
      // if (uploadFiles) {
      //   await Promise.all(uploadFiles.map(async (file) => {
      //     const imageRef = ref(storage, `images/stock/${file.name}`);
      //     await uploadBytes(imageRef, file);
      //   }));
      // }
      toast.success('Create stock success...')
    } catch (error) {
      toast.error("Error!!!");
      console.error("Error when call API", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading title="New Stock" />
      <hr className="bg-slate-300 w-full h-px" />
      <DropdownInput
        id="productId"
        label="product"
        disabled={isLoading}
        register={register}
        errors={errors}
        options={
          allProducts ?
            allProducts.map(item => ({
              value: item.id,
              label: item.name,
            })) : []
        }
      />
      <DropdownInput
        id="colorId"
        label="color"
        disabled={isLoading}
        register={register}
        errors={errors}
        options={
          allColors ?
            allColors.map(item => ({
              value: item.id,
              label: item.name,
            })) : []
        }
      />
      <DropdownInput
        id="sizeId"
        label="size"
        disabled={isLoading}
        register={register}
        errors={errors}
        options={
          allSizes ?
          allSizes.map(item => ({
              value: item.id,
              label: item.name,
            })) : []
        }
      />
      <Input
        id="quantity"
        label="quantity"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type={"number"}
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
