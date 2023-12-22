"use client"
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";

import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";

import { Review, Stock } from "@/pages/api/admin/stock/Models";
import update from "@/pages/api/admin/stock/update";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import TextArea from "@/app/components/inputs/TextArea";
import ImagesContainer from "@/app/components/inputs/ImagesContainer";
import { Product } from "@/pages/api/admin/product/Models";
import { Size } from "@/pages/api/admin/size/Models";
import { Color } from "@/pages/api/admin/color/Models";
import DropdownInput from "@/app/components/inputs/DropdownInput";

interface ViewFormProps {
  foundStock: Stock
  allProducts: Product[],
  allSizes: Size[],
  allColors: Color[],
}

interface FormData {
  id: string;
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
  id: z.string().min(1),
  productId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  quantity: z.number().int().min(0),
  reviews: z.array(reviewSchema).nullable(),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
});

const ViewForm: React.FC<ViewFormProps> = ({
  foundStock,
  allColors,
  allProducts,
  allSizes
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        id: '',
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

  useEffect(() => {
    if (foundStock) {
      setValue('id', foundStock.id)
      setValue('productId', foundStock.productId)
      setValue('sizeId', foundStock.sizeId)
      setValue('colorId', foundStock.colorId)
      setValue('quantity', foundStock.quantity)
      setValue('reviews', foundStock.reviews)
      setValue('isActive', foundStock.isActive)
      setValue('isDeleted', foundStock.isDeleted)
    }
  }, [foundStock]);

  const onEdit: SubmitHandler<FieldValues> = async () => {
    setIsEdit(!isEdit);
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
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

    // console.log('data', data)

    if (isEdit) {
      try {
        setIsEdit(false);
        toast.loading('Please wait...', { duration: 1000 });
        const stockData: Stock = {
          id: data.id,
          productId: data.productId,
          sizeId: data.sizeId,
          colorId: data.colorId,
          quantity: data.quantity,
          reviews: data.reviews,
          isDeleted: data.isDeleted,
          isActive: data.isActive,
        };
        await update(stockData.id, stockData);
        // if (uploadFiles) {
        //   await Promise.all(uploadFiles.map(async (file) => {
        //     const imageRef = ref(storage, `images/stock/${file.name}`);
        //     await uploadBytes(imageRef, file);
        //   }));
        // }
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
      <Heading title="Stock" />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="id"
        label="id"
        disabled={true}
        register={register}
        errors={errors}
        required
      />
      <DropdownInput
        id="productId"
        label="product"
        disabled={!isEdit}
        register={register}
        errors={errors}
        options={
          allProducts ?
            allProducts.map(item => ({
              value: item.id,
              label: item.name,
            })) : []
        }
        preValue={getValues("productId")}
      />
      <DropdownInput
        id="colorId"
        label="color"
        disabled={!isEdit}
        register={register}
        errors={errors}
        options={
          allColors ?
            allColors.map(item => ({
              value: item.id,
              label: item.name,
            })) : []
        }
        preValue={getValues("colorId")}
      />
      <DropdownInput
        id="sizeId"
        label="size"
        disabled={!isEdit}
        register={register}
        errors={errors}
        options={
          allSizes ?
            allSizes.map(item => ({
              value: item.id,
              label: item.name,
            })) : []
        }
        preValue={getValues("sizeId")}
      />
      <Input
        id="quantity"
        label="quantity"
        disabled={!isEdit}
        register={register}
        errors={errors}
        required
        type={"number"}
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