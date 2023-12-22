'use client';

import { FieldErrors, FieldValues, UseFormGetValues, UseFormRegister, UseFormReset, UseFormSetValue, useForm } from 'react-hook-form';
import Button from '../../components/Button';
import DropdownInput from '@/app/components/inputs/DropdownInput';
import { Stock } from '@/pages/api/admin/stock/Models';
import Input from "@/app/components/inputs/Input";
import { useEffect, useState } from 'react';
import DropdownCheckout from '@/app/components/inputs/DropdownCheckout';
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface ListObjectInputProps {
  id: string;
  label: string;
  disabled: boolean;
  required?: boolean;
  custom?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  reset?: UseFormReset<any>;
  fields: any;
  append: any;
  remove: any;
}

interface FormData {
  detailAddress: string;
  ward: string;
  districts: string;
  city: string;
}

const schema: ZodType<FormData> = z.object({
  detailAddress: z.string().min(1),
  ward: z.string().min(1),
  districts: z.string().min(1),
  city: z.string().min(1),
})

const OrderItemsContainer: React.FC<ListObjectInputProps> = ({
  id,
  label,
  disabled,
  custom,
  register,
  errors,
  getValues,
  setValue,
  reset,
  fields,
  append,
  remove
}) => {
  // console.log("errors[id]", errors[`${id}`] ? errors[`${id}`][0]['quantity'] : null)
  const [code, setCode] = useState({
    city: 0,
    districts: 0,
    ward: 0
  });

  const { register: addressRegister, handleSubmit: addressHandleSubmit,
    formState: { errors: addressErrors }, control: addressControl,
    getValues: addressGetValue, setValue: addressSetValue } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        detailAddress: null,
        ward: null,
        districts: null,
        city: null,
      }
    })

  const [city, setCity] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [ward, setWard] = useState<string>('');
  const handleCityChange = (selectedKey: number, name: string) => {
    setCode((prevCode) => ({
      ...prevCode,
      city: selectedKey,
    }));
    setCity(name);
  };

  const handleDistrictChange = (selectedKey: number, name: string) => {
    setCode((prevCode) => ({
      ...prevCode,
      districts: selectedKey,
    }));
    setDistrict(name);
  };

  const handleWardChange = (selectedKey: number, name: string) => {
    setCode((prevCode) => ({
      ...prevCode,
      ward: selectedKey,
    }));
    setWard(name);
  };

  const handleAddBtnClick = async () => {
    append(`${addressGetValue('detailAddress')}, ${ward}, ${district}, ${city}`);
  }

  return (
    <>
      <div className={`w-full rounded-lg border-2 p-4 border-slate-300 flex flex-col items-start space-y-4 ${custom}`}>
        <label
          htmlFor={id}
          className={`cursor-text text-md duration-150 transform
        ${errors[id] ? 'text-rose-500' : 'text-slate-400'}`}
        >
          {label}
        </label>
        <div className="flex flex-wrap">
          {fields.map((item, index) => (
            <div key={item.id} className='flex border-2 p-2 rounded'>
              <div className='w-25 ml-2'>
                <Input
                  id={`${id}.${index}`}
                  label="address"
                  disabled={true}
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className='w-20 ml-2'>
                <Button disabled={disabled} label='Delete' onClick={() => remove(index)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-3/5 pr-2 ml-2">
        <div className='ml-2'>
          <Input
            id={"detailAddress"}
            label="detail address"
            register={addressRegister}
            errors={addressErrors} />
          <DropdownCheckout
            placeholder="Province"
            type="province"
            code={code}
            onChange={handleCityChange}
          />
          <DropdownCheckout placeholder="District" type="district" code={code}
            onChange={handleDistrictChange}
          />
          <DropdownCheckout placeholder="Ward" type="ward" code={code}
            onChange={handleWardChange}
          />
        </div>
        <Button custom='w-5 ml-2' disabled={disabled} label='Add' onClick={handleAddBtnClick} />
        <Button custom='w-5 ml-2 mt-2' disabled={disabled} label='Clear' onClick={() => fields.forEach(() => remove())} />
      </div>
    </>
  );
};

export default OrderItemsContainer;
