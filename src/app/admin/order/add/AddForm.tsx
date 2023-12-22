"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { useState, useEffect } from "react";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import callApiRoute from "@/pages/api/admin/order/add";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import DropdownInput from "@/app/components/inputs/DropdownInput";
import ListObjectContainer from "@/app/admin/order/OrderItemsContainer";

import { Order, EOrderStatus, OrderItem } from "@/pages/api/admin/order/Models";
import { User } from "@/pages/api/admin/user/Models";
import { Delivery } from "@/pages/api/admin/delivery/Models";
import findAll from "@/pages/api/admin/stock/findAll";

interface AddFormProps {
  allUsers?: User[],
  allDeliveries?: Delivery[]
}

interface FormData {
  id: string,
  userId?: string | null,
  username: string,
  address: string,
  phone: string,
  deliveryId: string,
  shippingFee: number,
  status: EOrderStatus,
  orderItems: OrderItem[],
  isPaidBefore: boolean,
  isDeleted: boolean,
  isActive: boolean
}

const orderItemChema: ZodType<OrderItem> = z.object({
  quantity: z.number().int().min(1),
  stockId: z.string(),
});

const schema: ZodType<FormData> = z.object({
  id: z.string().min(1),
  userId: z.string().nullable(),
  username: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().length(10).refine((value) => /^\d+$/.test(value), {
    message: "Phone must contain only digits (0-9).",
  }),
  deliveryId: z.string().min(1),
  shippingFee: z.number().min(0),
  status: z.nativeEnum(EOrderStatus),
  orderItems: z.array(orderItemChema),
  isPaidBefore: z.boolean(),
  isDeleted: z.boolean(),
  isActive: z.boolean()
});

const AddForm = (addFormProps: AddFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allStocks, setAllStocks] = useState();

  useEffect(() => {
    const fetchAllStock = async () => {
      try {
        const response = await findAll({});
        if (response) {
          setAllStocks(response.items);
        }
      } catch (error) {
        console.error('fetch all stocks failed');
      }
    }
    fetchAllStock();
  }, [])

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        id: "",
        userId: "",
        username: "",
        address: "",
        phone: "",
        deliveryId: "",
        shippingFee: 0,
        status: EOrderStatus.WAITING,
        orderItems: [],
        isPaidBefore: false,
        isDeleted: true,
        isActive: false
      }
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'orderItems',
  });

  const onSaveBtnClick = async (data: FormData) => {
    setIsLoading(true);
    try {
      const orderData: Order = {
        id: data.id,
        userId: data.userId,
        username: data.username,
        address: data.address,
        phone: data.phone,
        deliveryId: data.deliveryId,
        shippingFee: data.shippingFee,
        status: data.status,
        orderItems: data.orderItems,
        isPaidBefore: data.isPaidBefore,
        isDeleted: data.isDeleted,
        isActive: data.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const response = await callApiRoute(orderData);
      toast.success("Create order successfull")
    } catch (error) {
      console.error("Error when call API", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Heading title="New Order" />
      <hr className="bg-slate-300 w-full h-px" />
      <DropdownInput
        id="userId"
        label="user"
        disabled={isLoading}
        register={register}
        errors={errors}
        options={
          addFormProps.allUsers ?
            addFormProps.allUsers.map(user => ({
              value: user.id,
              label: user.firstName + " " + user.lastName,
            })) : []
        }
      />
      <Input
        id="username"
        label="username"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="address"
        label="address"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="phone"
        label="phone"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <DropdownInput
        id="deliveryId"
        label="delivery"
        disabled={isLoading}
        register={register}
        errors={errors}
        options={
          addFormProps.allDeliveries ?
            addFormProps.allDeliveries.map(delivery => ({
              value: delivery.id,
              label: delivery.name,
            })) : []
        }
      />
      <Input
        id="shippingFee"
        label="shipping fee"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="number"
      />
      <DropdownInput
        id="status"
        label="status"
        disabled={isLoading}
        register={register}
        errors={errors}
        options={Object.values(EOrderStatus).map(status => ({
          value: status,
          label: status.toString(),
        }))}
      />
      <div className="w-full flex">
        <ListObjectContainer
          id='orderItems'
          label="order items"
          disabled={false}
          allStocks={allStocks}
          custom="w-full"
          register={register}
          getValues={getValues}
          setValue={setValue}
          errors={errors}
          reset={reset}
          fields={fields}
          append={append} 
          remove={remove}
        />
      </div>
      <CustomCheckBox
        id="isPaidBefore"
        label="is paid before"
        disabled={isLoading}
        register={register}
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
        onClick={handleSubmit(onSaveBtnClick)} />
    </>
  );
}

export default AddForm;