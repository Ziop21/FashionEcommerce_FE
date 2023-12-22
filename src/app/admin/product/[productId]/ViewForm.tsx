"use client"
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";

import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";

import { Product } from "@/pages/api/admin/product/Models";
import update from "@/pages/api/admin/product/update";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import TextArea from "@/app/components/inputs/TextArea";
import ImagesContainer from "@/app/components/inputs/ImagesContainer";

interface ViewFormProps {
  foundProduct?: Product;
}

interface FormData {
  id: string,
  name: string,
  slug?: string,
  description: string,
  price: number,
  promotionalPrice?: number,
  isSelling: boolean,
  images: File[],
  isActive: boolean,
  isDeleted: boolean
}

const schema: ZodType<FormData> = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.any().nullable(),
  description: z.string().min(1),
  price: z.number().min(0),
  promotionalPrice: z.any().nullable().refine((val) => typeof val === "number" || val >= 0, {
    message: "promotional price must be a number greater than or equal to 0",
  }),
  isSelling: z.boolean(),
  images: z.array(z.any()).min(1),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
})

const ViewForm = (props: ViewFormProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: null,
        slug: null,
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

  useEffect(() => {
    if (props.foundProduct) {
      setValue('id', props.foundProduct.id)
      setValue('name', props.foundProduct.name)
      setValue('slug', props.foundProduct.slug)
      setValue('description', props.foundProduct.description)
      setValue('price', props.foundProduct.price)
      setValue('promotionalPrice', props.foundProduct.promotionalPrice)
      setValue('isSelling', props.foundProduct.isSelling)
      setValue('images', props.foundProduct.images)
      setValue('isDeleted', props.foundProduct.isDeleted)
      setValue('isActive', props.foundProduct.isActive)
    }
  }, [props.foundProduct]);

  const onEdit: SubmitHandler<FieldValues> = async () => {
    setIsEdit(!isEdit);
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
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
    if (isEdit) {
      try {
        setIsEdit(false);
        toast.loading('Please wait...', {duration: 1000});
        const productData: Product = {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          promotionalPrice: data.promotionalPrice,
          view: data.view,
          isSelling: data.isSelling,
          images: fileNames,
          rating: data.rating,
          isDeleted: data.isDeleted,
          isActive: data.isActive,
        };
        await update(productData.id, productData);
        if (uploadFiles) {
          await Promise.all(uploadFiles.map(async (file) => {
            const imageRef = ref(storage, `images/product/${file.name}`);
            await uploadBytes(imageRef, file);
          }));
        }
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
      <Heading title="Product" />
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
      <Input
        id="slug"
        label="slug"
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
      <Input
        id="price"
        label="price"
        disabled={!isEdit}
        register={register}
        errors={errors}
        required
        type={"number"}
      />
      <Input
        id="promotionalPrice"
        label="promotional price"
        disabled={!isEdit}
        register={register}
        errors={errors}
        required
        type={"number"}
      />
      <CustomCheckBox
        id="isSelling"
        label="is selling"
        disabled={!isEdit}
        register={register}
      />
      <div className="w-full flex">
        <ImagesContainer
          id='images'
          label="images"
          itemLabel="image"
          storagePath="images/product/"
          disabled={!isEdit}
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