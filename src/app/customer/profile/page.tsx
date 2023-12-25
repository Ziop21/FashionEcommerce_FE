"use client"

import { useEffect, useState } from "react";
import Container from "@/app/components/Container";
import ViewForm from "./ViewForm";
import { ChangePasswordRequest, UserResponse } from "@/pages/api/customer/user/Models";
import findById from "@/pages/api/customer/user/findById";
import Heading from "@/app/components/Heading";
import FormWrap from "@/app/components/FormWrap";
import { ZodType, z } from "zod";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import updatePassword from "@/pages/api/customer/user/updatePassword";
import customerDeleteUser from "@/pages/api/customer/user/delete";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { JWT_COOKIE_NAME, JWT_REFRESH_COOKIE_NAME } from "@/config/ApplicationConfig";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";

interface FormData {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
}

const deleteUserChema: ZodType<any> = z.object({
  confirmPassword: z.string().min(1),
})

const changePwdSchema: ZodType<FormData> = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
  confirmPassword: z.string().min(1),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Confirm password do not match",
  path: ["confirmPassword"]
})

const View = () => {
  const [foundUser, setFoundUser] = useState<UserResponse>();
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteUser, setDeleteUser] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await findById();
        if (response) {
          setFoundUser(response);
        } else {
          console.error("Error: Data not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const { register: changePwdRegister, handleSubmit: handleChangePwdSubmit, formState: { errors: changePwdError }
    , control: changePwdControl, getValues: changePwdGetValues, setValue: changePwdSetValues, reset: changePwdReset } =
    useForm<FieldValues>({
      resolver: zodResolver(changePwdSchema),
      defaultValues: {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
      }
    })

  const { register: deleteUserRegister, handleSubmit: handledeleteUserSubmit, formState: { errors: deleteUserError }
    , control: deleteUserControl, getValues: deleteUserGetValues, setValue: deleteUserSetValues, reset: deleteUserReset } =
    useForm<FieldValues>({
      resolver: zodResolver(deleteUserChema),
      defaultValues: {
        confirmPassword: '',
      }
    })
  const onChangePasswordBtnClick = async (data: any) => {
    // console.log('data', data)
    try {
      setIsLoading(true);
      toast.loading('Please wait...', { duration: 1000 });
      const changePasswordRequest: ChangePasswordRequest = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      await updatePassword(changePasswordRequest);
      toast.success('Change password successfully')
      setIsLoading(false);
      setChangePassword(false);
      changePwdReset();
    } catch (error) {
      toast.error("Error!!!");
      console.log("Error when update: ", error);
      setIsLoading(false);
    }
  }

  const onDeleteUserBtnClick = async (data: any) => {
    // console.log('data', data)
    try {
      const deleteOldImage = async () => {
        try {
          const oldFileName = foundUser?.avatar;
          if (oldFileName && oldFileName.length > 0) {
            const oldImageRef = ref(storage, `images/user/${oldFileName}`)
            const oldImageURL = await getDownloadURL(oldImageRef);
            if (oldImageURL) {
              await deleteObject(oldImageRef);
            }
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      setIsLoading(true);
      toast.loading('Please wait...', { duration: 1000 });
      const changePasswordRequest: ChangePasswordRequest = {
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmPassword: data.confirmPassword,
      };
      await customerDeleteUser(changePasswordRequest);
      Cookies.remove(JWT_COOKIE_NAME)
      Cookies.remove(JWT_REFRESH_COOKIE_NAME)
      await deleteOldImage();
      router.push('/');
    } catch (error) {
      toast.error("Error!!!");
      console.log("Error when delete: ", error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Container>
        <div className="mt-4">
          <Heading center title="PROFILE" />
          <hr className="mt-4 bg-slate-300 w-full h-px" />
        </div>
        <div className="mt-10 px-24 w-full">
          <Button
            label={'Change password'}
            // disabled={}
            onClick={() => { setChangePassword(!changePassword) }}
          />
        </div>
        {changePassword &&
          <div className="w-2/3 mx-auto">
            <Input
              id="oldPassword"
              label="old password"
              disabled={isLoading}
              register={changePwdRegister}
              errors={changePwdError}
              type="password"
              required
            />
            <Input
              id="newPassword"
              label="new password"
              disabled={isLoading}
              register={changePwdRegister}
              errors={changePwdError}
              type="password"
              required
            />
            <Input
              id="confirmPassword"
              label="confirm new password"
              disabled={isLoading}
              register={changePwdRegister}
              errors={changePwdError}
              type="password"
              required
            />
            <Button
              label={'Confirm'}
              // disabled={}
              onClick={handleChangePwdSubmit(onChangePasswordBtnClick)}
            />
          </div>
        }
        <ViewForm foundUser={foundUser} />
        <div className="mt-10 px-24 w-full">
          <Button
            label={'Delete user'}
            custom="bg-red-400"
            // disabled={}
            onClick={() => { setDeleteUser(!deleteUser) }}
          />
        </div>
        {deleteUser &&
          <div className="w-2/3 mx-auto">
            <Input
              id="confirmPassword"
              label="confirm password"
              disabled={isLoading}
              register={deleteUserRegister}
              errors={deleteUserError}
              type="password"
              required
            />
            <Button
              label={'confirm'}
              // disabled={}
              custom="bg-red-400"
              onClick={handledeleteUserSubmit(onDeleteUserBtnClick)}
            />
          </div>
        }
      </Container>
    </div>
  );
}

export default View;