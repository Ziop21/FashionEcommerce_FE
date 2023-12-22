"use client"

import { useEffect, useState } from "react";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CategoriesContainer from "../CategoriesContainer";
import findAll from "@/pages/api/admin/category/findAll";
import ImagesContainer from "@/app/components/inputs/ImagesContainer";
import { Category } from "@/pages/api/admin/category/Models";
import callApiRoute from "@/pages/api/admin/category/add"
import { v4 } from "uuid";
import { StorageReference, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import toast from "react-hot-toast";

interface FormData {
  name: string,
  categoryIds: string[],
  images?: File[],
  isDeleted: boolean,
  isActive: boolean
}
const schema: ZodType<FormData> = z.object({
  name: z.string().min(1),
  categoryIds: z.array(z.string().min(1)),
  images: z.array(z.any()),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
});

const AddForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allCategories, setAllCategories] = useState();

  useEffect(() => {
    const fetchAllStock = async () => {
      try {
        const response = await findAll({});
        if (response) {
          setAllCategories(response.items);
        }
      } catch (error) {
        console.error('fetch all stocks failed');
      }
    }
    fetchAllStock();
  }, [])

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: '',
        categoryIds: [],
        images: [],
        isDeleted: true,
        isActive: false,
      }
    })

  const { fields: categoryFields, append: categoryAppend, remove: categoryRemove } = useFieldArray({
    control,
    name: 'categoryIds',
  });

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
      const categoryData: Category = {
        id: data.id,
        name: data.name,
        images: fileNames,
        categoryIds: data.categoryIds,
        isDeleted: data.isDeleted,
        isActive: data.isActive,
      };
      await callApiRoute(categoryData);
      if (uploadFiles) {
        await Promise.all(uploadFiles.map(async (file) => {
          const imageRef = ref(storage, `images/category/${file.name}`);
          await uploadBytes(imageRef, file);
        }));
      }
      toast.success('Create category success...')
    } catch (error) {
      console.error("Error when call API", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading title="New Category" />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="name"
        label="name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <div className="w-full flex">
        <CategoriesContainer
          id='categoryIds'
          label="categories"
          disabled={false}
          allCategories={allCategories}
          custom="w-full"
          register={register}
          getValues={getValues}
          setValue={setValue}
          errors={errors}
          reset={reset}
          fields={categoryFields}
          append={categoryAppend}
          remove={categoryRemove}
        />
      </div>
      <div className="w-full flex">
        <ImagesContainer
          id='images'
          label="images"
          itemLabel="image"
          storagePath="images/category/"
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
