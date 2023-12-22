"use client"
import { useEffect, useState } from "react";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import DropdownInput from "@/app/components/inputs/DropdownInput";

import update from "@/pages/api/admin/order/update";
import { User } from "@/pages/api/admin/user/Models";
import { Delivery } from "@/pages/api/admin/delivery/Models";
import { Order, EOrderStatus, OrderItem } from "@/pages/api/admin/order/Models";
import ListObjectContainer from "../OrderItemsContainer";
import findAll from "@/pages/api/admin/stock/findAll";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import findById from "@/pages/api/admin/stock/findById";

interface ViewFormProps {
  foundOrder?: Order,
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
}

const ViewForm = (viewFormProps: ViewFormProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [allStocks, setAllStocks] = useState();
  const orderItemChema: ZodType<OrderItem> = z.object({
    quantity: z.number().int().min(1),
    stockId: z.string(),
  });

  const schema: ZodType<FormData> = z.object({
    id: z.string().min(1),
    userId: z.string().nullable(),
    username: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
    deliveryId: z.string().min(1),
    shippingFee: z.number().min(0),
    status: z.nativeEnum(EOrderStatus),
    orderItems: z.array(orderItemChema),
    isPaidBefore: z.boolean(),
  });

  const { register, handleSubmit, formState: { errors }, control, setValue, getValues, reset } =
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
      }
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'orderItems',
  });

  useEffect(() => {
    const fetchAllStock = async () => {
      try {
        const response = await findAll({pageSize: 500});
        if (response) {
          setAllStocks(response.items);
        }
      } catch (error) {
        console.error('fetch all stocks failed');
      }
    }
    fetchAllStock();
  }, [])

  useEffect(() => {
    const init =async () => {
      if (viewFormProps.foundOrder) {
        if (viewFormProps.foundOrder && viewFormProps.foundOrder.id !== undefined) {
          setValue('id', viewFormProps.foundOrder.id);
        }
        setValue('userId', viewFormProps.foundOrder.userId);        
        setValue('username', viewFormProps.foundOrder.username);
        setValue('address', viewFormProps.foundOrder.address);
        setValue('phone', viewFormProps.foundOrder.phone);
        setValue('orderItems', viewFormProps.foundOrder.orderItems);
        setValue('deliveryId', viewFormProps.foundOrder.deliveryId);
        setValue('shippingFee', viewFormProps.foundOrder.shippingFee);
        setValue('status', viewFormProps.foundOrder.status);
        setValue('isPaidBefore', viewFormProps.foundOrder.isPaidBefore);
      }
    }
    init();
  }, [viewFormProps.foundOrder, setValue]);


  const onEdit: SubmitHandler<FieldValues> = async () => {
    if (isEdit) {
      setIsEdit(false);
    }
    else {
      setIsEdit(true);
    }
  }

  return (
    <>
      <Heading title="Order" />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="id"
        label="id"
        disabled={true}
        register={register}
        errors={errors}
      />
      <DropdownInput
        id="userId"
        label="user"
        disabled={!isEdit}
        register={register}
        errors={errors}
        options={
          viewFormProps.allUsers ?
            viewFormProps.allUsers.map(user => ({
              value: user.id,
              label: user.firstName + " " + user.lastName,
            })) : []}
        preValue={getValues("userId")}
      />
      <Input
        id="username"
        label="username"
        disabled={!isEdit}
        register={register}
        errors={errors}
      />
      <Input
        id="address"
        label="address"
        disabled={!isEdit}
        register={register}
        errors={errors}
      />
      <Input
        id="phone"
        label="phone"
        disabled={!isEdit}
        register={register}
        errors={errors}
      />
      <DropdownInput
        id="deliveryId"
        label="delivery"
        disabled={!isEdit}
        register={register}
        errors={errors}
        options={
          viewFormProps.allDeliveries != undefined ?
            viewFormProps.allDeliveries.map(delivery => ({
              value: delivery.id,
              label: delivery.name,
            })) : []}
        preValue={getValues("deliveryId")}
      />
      <Input
        id="shippingFee"
        label="shipping fee"
        disabled={!isEdit}
        register={register}
        errors={errors}
        type="number"
      />
      <DropdownInput
        id="status"
        label="status"
        disabled={!isEdit}
        register={register}
        errors={errors}
        options={Object.values(EOrderStatus).map(status => ({
          value: status,
          label: status.toString(),
        }))}
        preValue={getValues("status")}
      />
      <div className="w-full flex">
        <ListObjectContainer
          id='orderItems'
          label="order items"
          disabled={!isEdit}
          // data={orderItems}
          allStocks={allStocks}
          custom="w-full"
          register={register}
          getValues={getValues}
          // setValue={setValue}
          errors={errors}
          // reset={reset}
          fields={fields}
          append={append}
          remove={remove}
        />
      </div>
      <CustomCheckBox
        id="isPaidBefore"
        label="is paid before"
        disabled={!isEdit}
        register={register}
      />
    </>
  );
};

export default ViewForm; 