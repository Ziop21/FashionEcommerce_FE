"use client"
import { FC, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";

import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";

import { UserResponse, UserRequest } from "@/pages/api/customer/user/Models";
import update from "@/pages/api/customer/user/update";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import ImageInput from "@/app/components/inputs/ImageInput";
import PhonesContainer from "./PhonesContainer";
import AddressesContainer from "@/app/customer/profile/AddresssContainer";

interface ViewFormProps {
  foundUser?: UserResponse;
}

interface FormData {
  confirmPassword: string,
  firstName: string,
  lastName: string,
  idCard: string | null,
  phones: string[],
  addresses: string[],
  avatar?: any | null,
  eWallet: string | null,
  email: string,
  point: number,
}

const schema: ZodType<FormData> = z.object({
  confirmPassword: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  idCard: z.string().nullable(),
  phones: z.array(z.string().length(10)).min(1),
  addresses: z.array(z.string().min(1)).min(1),
  avatar: z.any().nullable(),
  eWallet: z.string().nullable(),
  email: z.string().min(1),
  point: z.number(),
})

const ViewForm: FC<ViewFormProps> = ({
  foundUser
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        confirmPassword: null,
        firstName: null,
        lastName: null,
        idCard: null,
        phones: null,
        addresses: null,
        avatar: null,
        eWallet: null,
        email: null,
        point: null,
      }
    })

  const { fields: addressFields, append: addressAppend, remove: addressRemove } = useFieldArray({
    control,
    name: 'addresses',
  });

  const { fields: phoneFields, append: phoneAppend, remove: phoneRemove } = useFieldArray({
    control,
    name: 'phones',
  });

  useEffect(() => {
    if (foundUser) {
      setValue('confirmPassword', foundUser.confirmPassword)
      setValue('firstName', foundUser.firstName)
      setValue('lastName', foundUser.lastName)
      setValue('idCard', foundUser.idCard)
      setValue('phones', foundUser.phones)
      setValue('addresses', foundUser.addresses)
      setValue('avatar', foundUser.avatar)
      setValue('eWallet', foundUser.eWallet)
      setValue('email', foundUser.email)
      setValue('point', foundUser.point)
    }
  }, [foundUser]);

  const onEdit: SubmitHandler<FieldValues> = async () => {
    setIsEdit(!isEdit);
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log('data', data)
    let fileName: string = data.avatar;
    let uploadFile: any;
    if (data.avatar) {
      if (data.avatar.name) {
        const fileNameWithoutExtension = data.avatar.name.split('.').slice(0, -1).join('.');
        const fileExtension = data.avatar.name.split('.').pop();
        fileName = `${fileNameWithoutExtension}_${v4().replace(/-/g, '_')}.${fileExtension}`;
        const updatedNameFile: File = new File([data.avatar.slice()], fileName, { type: data.avatar.type });
        uploadFile = updatedNameFile;
      }
    }
    if (isEdit) {
      try {
        setIsEdit(false);
        toast.loading('Please wait...', { duration: 1000 });
        const userData: UserRequest = {
          confirmPassword: data.confirmPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          idCard: data.idCard,
          phones: data.phones,
          addresses: data.addresses,
          avatar: fileName,
          eWallet: data.eWallet,
        };
        await update(userData);
        if (uploadFile) {
          const imageRef = ref(storage, `images/user/${uploadFile.name}`);
          await uploadBytes(imageRef, uploadFile);
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
    <div className="mt-6">
      <div className="flex pt-2 px-24">
        <div className="w-2/5 h-32 mr-8">
          <ImageInput
            id={'avatar'}
            label={'avatar'}
            storagePath={'images/user/'}
            disabled={!isEdit}
            getValues={getValues}
            setValue={setValue}
            errors={errors}
            imageWidth={300}
            imageHeigth={100}
          />
        </div>
        <div className="w-3/5">
          <Input
            id="email"
            label="email"
            disabled={true}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="firstName"
            label="first name"
            disabled={!isEdit}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="lastName"
            label="last name"
            disabled={!isEdit}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="idCard"
            label="id card"
            disabled={!isEdit}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="point"
            label="point"
            disabled={true}
            register={register}
            errors={errors}
            required
          />
          <div className="w-full flex">
            <PhonesContainer
              id='phones'
              label="phones"
              itemLabel="phone"
              disabled={!isEdit}
              custom="w-full"
              register={register}
              errors={errors}
              fields={phoneFields}
              append={phoneAppend}
              remove={phoneRemove}
            />
          </div>
          <div className="w-full flex">
            <AddressesContainer
              id='addresses'
              label="addresses"
              disabled={!isEdit}
              custom="w-full"
              register={register}
              errors={errors}
              fields={addressFields}
              getValues={getValues}
              setValue={setValue}
              append={addressAppend}
              remove={addressRemove}
            />
          </div>
          <Input
            id="confirmPassword"
            label="enter your password to update"
            disabled={!isEdit}
            register={register}
            errors={errors}
            type="password"
            required
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
        </div>
      </div>
    </div>
  );
};

export default ViewForm; 