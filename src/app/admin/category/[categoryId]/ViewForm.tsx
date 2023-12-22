"use client"
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";

import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";

import { Category } from "@/pages/api/admin/category/Models";
import update from "@/pages/api/admin/category/update";
import { z, ZodType } from "zod";
import CategoriesContainer from "../CategoriesContainer";
import findAll from "@/pages/api/admin/category/findAll";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import ImagesContainer from "@/app/components/inputs/ImagesContainer";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
interface ViewFormProps {
  foundCategory?: Category;
}
interface FormData {
  id: string,
  name: string,
  categoryIds: string[],
  images?: File[],
  isDeleted: boolean,
  isActive: boolean
}

const schema: ZodType<FormData> = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  categoryIds: z.array(z.string().min(1)),
  images: z.array(z.any()),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
});

const ViewForm = (props: ViewFormProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [allCategories, setAllCategories] = useState();

  useEffect(() => {
    const fetchAllCategory = async () => {
      try {
        const response = await findAll({});
        if (response) {
          setAllCategories(response.items);
        }
      } catch (error) {
        console.error('fetch all stocks failed');
      }
    }
    fetchAllCategory();
  }, [])

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
    })

  const { fields: categoryFields, append: categoryAppend, remove: categoryRemove } = useFieldArray({
    control,
    name: 'categoryIds',
  });

  const { fields: imageFields, append: imageAppend, remove: imageRemove } = useFieldArray({
    control,
    name: 'images',
  });

  useEffect(() => {
    if (props.foundCategory) {
      setValue('id', props.foundCategory.id)
      setValue('name', props.foundCategory.name)
      setValue('categoryIds', props.foundCategory.categoryIds)
      setValue('images', props.foundCategory.images)
      setValue('isDeleted', props.foundCategory.isDeleted)
      setValue('isActive', props.foundCategory.isActive)
    }
  }, [props.foundCategory]);

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
        const categoryData: Category = {
          id: data.id,
          name: data.name,
          categoryIds: data.categoryIds,
          images: fileNames,
          isDeleted: data.isDeleted,
          isActive: data.isActive,
        };
        await update(categoryData.id, categoryData);
        if (uploadFiles) {
          await Promise.all(uploadFiles.map(async (file) => {
            const imageRef = ref(storage, `images/category/${file.name}`);
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
      <Heading title="Category" />
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
      <div className="w-full flex">
        <CategoriesContainer
          id='categoryIds'
          label="categories"
          disabled={!isEdit}
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
          storagePath="images/category/"
          itemLabel="image"
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