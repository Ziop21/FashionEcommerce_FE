"use client"

import { useEffect, useState } from "react";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import findAll from "@/pages/api/admin/user/level/findAll";
import { ERole, Role, User } from "@/pages/api/admin/user/Models";
import callApiRoute from "@/pages/api/admin/user/add"
import { v4 } from "uuid";
import { StorageReference, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import toast from "react-hot-toast";
import RolesContainer from "../RolesContainer";
import PhonesContainer from "../PhonesContainer";
import AddressesContainer from "../AddressesContainer";
import ImageInput from "@/app/components/inputs/ImageInput";
import DropdownInput from "@/app/components/inputs/DropdownInput";

interface FormData {
  roles: Role[],
  firstName: string,
  lastName: string,
  idCard?: string | null,
  email: string,
  phones?: string[] | null,
  password: string,
  isEmailActive: boolean,
  isPhoneActive: boolean,
  addresses?: string[] | null,
  avatar?: File | null,
  point: number,
  eWallet?: string | null,
  userLevelId: string | null,
  isDeleted: boolean,
  isActive: boolean
}

const roleSchema: ZodType<Role> = z.object({
  name: z.nativeEnum(ERole)
});

const schema: ZodType<FormData> = z.object({
  roles: z.array(roleSchema).min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  idCard: z.string().nullable(),
  // idCard: z.any().nullable().refine((val) => typeof val === "string" || val.length >= 0, {
  //   message: "idCard length must greater than or equal to 0",
  // }),
  email: z.string().email(),
  phones: z.array(z.string().length(10)).nullable(),
  password: z.string().min(5),
  isEmailActive: z.boolean(),
  isPhoneActive: z.boolean(),
  addresses: z.array(z.string().min(1)).nullable(),
  avatar: z.any().nullable(),
  point: z.number().min(0),
  eWallet: z.string().min(0).nullable(),
  userLevelId: z.string().min(1).nullable(),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
});

const AddForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allUserLevels, setAllUserLevels] = useState();

  useEffect(() => {
    const fetchAllUserLevels = async () => {
      try {
        const response = await findAll({});
        // console.log(response)
        if (response) {
          setAllUserLevels(response.items);
        }
      } catch (error) {
        console.error('fetch all user level failed');
      }
    }
    fetchAllUserLevels();
  }, [])

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        roles: [],
        firstName: '',
        lastName: '',
        idCard: null,
        email: '',
        phones: null,
        password: '',
        isEmailActive: false,
        isPhoneActive: false,
        addresses: null,
        avatar: null,
        point: null,
        eWallet: null,
        userLevelId: null,
        isDeleted: true,
        isActive: false,
      }
    })

  const { fields: roleFields, append: roleAppend, remove: roleRemove } = useFieldArray({
    control,
    name: 'roles',
  });

  const { fields: phoneFields, append: phoneAppend, remove: phoneRemove } = useFieldArray({
    control,
    name: 'phones',
  });

  const { fields: addressFields, append: addressAppend, remove: addressRemove } = useFieldArray({
    control,
    name: 'addresses',
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log('datata: ', data)
    setIsLoading(true);
    let updatedNameFile: File | null = null;
    if (data.avatar) {
      const fileNameWithoutExtension = data.avatar.name.split('.').slice(0, -1).join('.');
      const fileExtension = data.avatar.name.split('.').pop();
      const fileName = `${fileNameWithoutExtension}_${v4().replace(/-/g, '_')}.${fileExtension}`;
      updatedNameFile = new File([data.avatar.slice()], fileName, { type: data.avatar.type });
    }
    try {
      const userData: User = {
        roles: data.roles,
        firstName: data.firstName,
        lastName: data.lastName,
        idCard: data.idCard,
        email: data.email,
        phones: data.phones,
        password: data.password,
        isEmailActive: data.isEmailActive,
        isPhoneActive: data.isPhoneActive,
        addresses: data.addresses,
        avatar: updatedNameFile?.name,
        point: data.point,
        eWallet: data.eWallet,
        userLevelId: data.userLevelId,
        isDeleted: data.isDeleted,
        isActive: data.isActive
      };
      await callApiRoute(userData);
      if (updatedNameFile) {
        const imageRef = ref(storage, `images/user/${updatedNameFile.name}`);
        await uploadBytes(imageRef, updatedNameFile);
      };
      toast.success('Create user success...')
    } catch (error) {
      toast.error('Error...')
      console.error("Error when call API", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading title="New User" />
      <hr className="bg-slate-300 w-full h-px" />
      <div className="w-full flex">
        <RolesContainer
          id='roles'
          label="roles"
          disabled={isLoading}
          custom="w-full"
          register={register}
          getValues={getValues}
          setValue={setValue}
          errors={errors}
          reset={reset}
          fields={roleFields}
          append={roleAppend}
          remove={roleRemove}
        />
      </div>
      <Input
        id="firstName"
        label="first name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="lastName"
        label="last name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="idCard"
        label="id card"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <div className="w-full flex">
        <PhonesContainer
          id='phones'
          label="phones"
          disabled={isLoading}
          custom="w-full"
          register={register}
          getValues={getValues}
          setValue={setValue}
          errors={errors}
          reset={reset}
          fields={phoneFields}
          append={phoneAppend}
          remove={phoneRemove}
        />
      </div>
      <Input
        id="password"
        label="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="password"
        required
      />
      <CustomCheckBox
        id="isEmailActive"
        label="is email active"
        disabled={isLoading}
        register={register}
      />
      <CustomCheckBox
        id="isPhoneActive"
        label="is phone active"
        disabled={isLoading}
        register={register}
      />
      <div className="w-full flex">
        <AddressesContainer
          id='addresses'
          label="addresses"
          disabled={isLoading}
          custom="w-full"
          register={register}
          getValues={getValues}
          setValue={setValue}
          errors={errors}
          reset={reset}
          fields={addressFields}
          append={addressAppend}
          remove={addressRemove}
        />
      </div>
      <ImageInput
        id={'avatar'}
        label={'avatar'}
        storagePath={'images/user/'}
        disabled={isLoading}
        getValues={getValues}
        setValue={setValue}
        errors={errors}
      />
      <Input
        id="point"
        label="point"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="number"
      />
      <Input
        id="eWallet"
        label="eWallet"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <DropdownInput
        id={'userLevelId'}
        label="user level"
        disabled={isLoading}
        register={register}
        errors={errors}
        options={allUserLevels ? allUserLevels.map(item => ({
          value: item.id,
          label: item.name,
        })) : []}
        required={true}
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
