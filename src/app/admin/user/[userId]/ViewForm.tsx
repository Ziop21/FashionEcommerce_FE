"use client"
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";

import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";

import { User } from "@/pages/api/admin/user/Models";
import update from "@/pages/api/admin/user/update";
import { z, ZodType } from "zod";
import findAll from "@/pages/api/admin/user/level/findAll";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import ImagesContainer from "@/app/components/inputs/ImagesContainer";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import { ERole, Role } from "@/pages/api/admin/user/Models";
import ImageInput from "@/app/components/inputs/ImageInput";
import AddressesContainer from "../AddressesContainer";
import PhonesContainer from "../PhonesContainer";
import RolesContainer from "../RolesContainer";
import DropdownInput from "@/app/components/inputs/DropdownInput";

interface ViewFormProps {
  foundUser?: User;
}

interface FormData {
  id: string,
  roles: Role[],
  firstName: string,
  lastName: string,
  idCard?: string | null,
  email: string,
  phones?: string[] | null,
  password?: string | null,
  hashedPassword: string,
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
  id: z.string(),
  roles: z.array(roleSchema).min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  idCard: z.string().nullable(),
  // idCard: z.any().nullable().refine((val) => typeof val === "string" || val.length >= 0, {
  //   message: "idCard length must greater than or equal to 0",
  // }),
  email: z.string().email(),
  phones: z.array(z.string().length(10)).nullable(),
  password: z.string().min(5).nullable().optional(),
  hashedPassword: z.string(),
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
const ViewForm = (props: ViewFormProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [allUserLevels, setAllUserLevels] = useState();
  const [oldAvatar, setOldAvatar] = useState<string | undefined>(undefined)

  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const response = await findAll({});
        if (response) {
          setAllUserLevels(response.items);
        }
      } catch (error) {
        console.error('fetch all stocks failed');
      }
    }
    fetchAllUser();
  }, [])

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
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


  useEffect(() => {
    if (props.foundUser) {
      setValue('id', props.foundUser.id)
      setValue('roles', props.foundUser.roles)
      setValue('firstName', props.foundUser.firstName)
      setValue('lastName', props.foundUser.lastName)
      setValue('idCard', props.foundUser.idCard)
      setValue('email', props.foundUser.email)
      setValue('phones', props.foundUser.phones)
      setValue('hashedPassword', props.foundUser.hashedPassword)
      setValue('isEmailActive', props.foundUser.isEmailActive)
      setValue('isPhoneActive', props.foundUser.isPhoneActive)
      setValue('addresses', props.foundUser.addresses)
      setOldAvatar(props.foundUser.avatar);
      setValue('avatar', props.foundUser.avatar)
      setValue('point', props.foundUser.point)
      setValue('eWallet', props.foundUser.eWallet)
      setValue('userLevelId', props.foundUser.userLevelId)
      setValue('point', props.foundUser.point)
      setValue('isDeleted', props.foundUser.isDeleted)
      setValue('isActive', props.foundUser.isActive)
    }
  }, [props.foundUser]);

  const onEdit: SubmitHandler<FieldValues> = async () => {
    setIsEdit(!isEdit);
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log(data)
    let fileName = data.avatar;
    let updatedNameFile: File | null = null;
    console.log(data.avatar)
    if (data.avatar !== null && data.avatar.name) {
      const fileNameWithoutExtension = data.avatar.name.split('.').slice(0, -1).join('.');
      const fileExtension = data.avatar.name.split('.').pop();
      fileName = `${fileNameWithoutExtension}_${v4().replace(/-/g, '_')}.${fileExtension}`;
      updatedNameFile = new File([data.avatar.slice()], fileName, { type: data.avatar.type });
    }
    if (isEdit) {
      try {
        setIsEdit(false);
        toast.loading('Please wait...', { duration: 1000 });
        const userData: User = {
          id: data.id,
          roles: data.roles,
          firstName: data.firstName,
          lastName: data.lastName,
          idCard: data.idCard,
          email: data.email,
          phones: data.phones,
          password: data.password,
          hashedPassword: data.hashedPassword,
          isEmailActive: data.isEmailActive,
          isPhoneActive: data.isPhoneActive,
          addresses: data.addresses,
          avatar: fileName,
          point: data.point,
          eWallet: data.eWallet,
          userLevelId: data.userLevelId,
          isDeleted: data.isDeleted,
          isActive: data.isActive
        };
        await update(userData.id, userData);
        // console.log('updatedNameFile', updatedNameFile)
        if (updatedNameFile) {
          const imageRef = ref(storage, `images/user/${updatedNameFile.name}`);
          await uploadBytes(imageRef, updatedNameFile);
        };
        if (data.avatar !== null){
          if (data.avatar.name === undefined || data.avatar.name === null) {
            if (data.avatar !== oldAvatar) {
              const oldImageRef = ref(storage, `images/user/${oldAvatar}`)
              const oldImageURL = await getDownloadURL(oldImageRef);
              if (oldImageURL) {
                await deleteObject(oldImageRef);
              }
              setOldAvatar(updatedNameFile?.name);
            }
          }
        }
        
        toast.success('Update success...')
      } catch (error) {
        toast.error("Error!!!");
        console.log("Error when update: ", error);
        setIsEdit(true);
      }
    }
  };

  return (
    <>
      <Heading title="User" />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="id"
        label="id"
        disabled={true}
        register={register}
        errors={errors}
        required
      />
      <div className="w-full flex">
        <RolesContainer
          id='roles'
          label="roles"
          disabled={!isEdit}
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
      />
      <Input
        id="email"
        label="email"
        disabled={!isEdit}
        register={register}
        errors={errors}
        required
      />
      <div className="w-full flex">
        <PhonesContainer
          id='phones'
          label="phones"
          disabled={!isEdit}
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
        id="hashedPassword"
        label="hashed password"
        disabled={true}
        register={register}
        errors={errors}
        required
      />
      <Button
        label="change password"
        disabled={!isEdit}
        onClick={() => { setChangePassword(true) }}
      />
      {changePassword && <Input
        id="password"
        label="password"
        disabled={!isEdit}
        register={register}
        errors={errors}
        type="password"
      />}
      <CustomCheckBox
        id="isEmailActive"
        label="is email active"
        disabled={!isEdit}
        register={register}
      />
      <CustomCheckBox
        id="isPhoneActive"
        label="is phone active"
        disabled={!isEdit}
        register={register}
      />
      <div className="w-full flex">
        <AddressesContainer
          id='addresses'
          label="addresses"
          disabled={!isEdit}
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
        disabled={!isEdit}
        getValues={getValues}
        imageWidth={10}
        imageHeigth={30}
        setValue={setValue}
        errors={errors}
      />
      <Input
        id="point"
        label="point"
        disabled={!isEdit}
        register={register}
        errors={errors}
        type="number"
      />
      <Input
        id="eWallet"
        label="eWallet"
        disabled={!isEdit}
        register={register}
        errors={errors}
      />
      <DropdownInput
        id={'userLevelId'}
        label="user level"
        disabled={!isEdit}
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