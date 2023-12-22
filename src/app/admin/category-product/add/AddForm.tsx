"use client"

import { useEffect, useState } from "react";
import Heading from "@/app/components/Heading";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import findAllCategory from "@/pages/api/admin/category/findAll";
import findAllProduct from "@/pages/api/admin/product/findAll";
import { CategoryProduct } from "@/pages/api/admin/category-product/Models";
import callApiRoute from "@/pages/api/admin/category-product/add";
import toast from "react-hot-toast";
import DropdownInput from "@/app/components/inputs/DropdownInput";

interface FormData {
  categoryId: string,
  productId: string,
  isActive: boolean,
  isDeleted: boolean
}
const schema: ZodType<FormData> = z.object({
  categoryId: z.string().min(0),
  productId: z.string().min(0),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
});

const AddForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await findAllCategory({pageSize: 50});
        if (categories) {
          setAllCategories(categories.items);
        }
        const products = await findAllProduct({
          sort: 'name_ASC',
          pageSize: 100});
        if (products) {
          setAllProducts(products.items);
        }
      } catch (error) {
        console.error('fetch all category or product failed');
      }
    }
    fetchData();
  }, [])

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        categoryId: '',
        productId: '',
        isDeleted: true,
        isActive: false,
      }
    })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const categoryProductData: CategoryProduct = {
        productId: data.productId,
        categoryId: data.categoryId,
        isDeleted: data.isDeleted,
        isActive: data.isActive,
      };
      await callApiRoute(categoryProductData);
      toast.success('Create category success...')
    } catch (error) {
      console.error("Error when call API", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading title="New Category Product" />
      <hr className="bg-slate-300 w-full h-px" />
      <DropdownInput
        id="categoryId"
        label="category"
        disabled={isLoading}
        register={register}
        errors={errors}
        options={
          allCategories ?
            allCategories.map(cate => ({
              value: cate.id,
              label: cate.name,
            })) : []
        }
        required
      />
      <DropdownInput
        id="productId"
        label="product"
        disabled={isLoading}
        register={register}
        errors={errors}
        options={
          allProducts ?
          allProducts.map(prod => ({
              value: prod.id,
              label: prod.name,
            })) : []
        }
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
        outline={true}
        custom="bg-green-300"
        label={isLoading ? "Loading" : "Add"}
        onClick={handleSubmit(onSubmit)} />
    </>
  );
}

export default AddForm;
