'use client';

import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormReset, UseFormSetValue } from 'react-hook-form';
import Button from '../../components/Button';
import DropdownInput from '@/app/components/inputs/DropdownInput';
import { Stock } from '@/pages/api/admin/stock/Models';
import Input from "@/app/components/inputs/Input";
import { User } from '@/pages/api/admin/user/Models';
import ImagesContainer from '@/app/components/inputs/ImagesContainer';
import { Order } from '@/pages/api/admin/order/Models';

interface ListObjectInputProps {
  id: string;
  label: string;
  disabled: boolean;
  required?: boolean;
  custom?: string;
  allUsers: User[];
  allOrders: Order[];
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues?: UseFormGetValues<any>;
  setValue?: UseFormSetValue<any>;
  reset?: UseFormReset<any>;
  control?: any;
  fields: any;
  append: any;
  remove: any;
}

const ReviewsContainer: React.FC<ListObjectInputProps> = ({
  id,
  label,
  disabled,
  required,
  custom,
  allUsers,
  allOrders,
  register,
  errors,
  getValues,
  setValue,
  reset,
  control,
  fields,
  append,
  remove
}) => {
  // console.log("errors[id]", errors[`${id}`] ? errors[`${id}`][0]['quantity'] : null)
  return (
    <>
      <div className={`rounded-lg border-2 p-4 border-slate-300 flex flex-col items-start space-y-4 ${custom}`}>
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
              <div className='w-full'>
                <DropdownInput
                  id={`${id}.${index}.orderId`}
                  label="order"
                  disabled={disabled}
                  register={register}
                  errors={errors}
                  options={
                    allOrders ? allOrders.map(order => ({
                      value: order.id,
                      label: order.id,
                    })) : []
                  }
                  required
                />
              </div>
              <div className='w-25 ml-2'>
                <Input
                  id={`${id}.${index}.content`}
                  label="content"
                  disabled={disabled}
                  register={register}
                  errors={errors}
                  type="textarea"
                  required
                />
              </div>
              <div className="w-full flex">
                <ImagesContainer
                  id='images'
                  label="images"
                  itemLabel="image"
                  storagePath="images/stock/"
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
              <div className='w-20 ml-2'>
                <Button disabled={disabled} label='Delete' onClick={() => remove(index)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ml-2">
        <Button custom='w-5 ml-2' disabled={disabled} label='Add' onClick={() => append({})} />
        <Button custom='w-5 ml-2 mt-2' disabled={disabled} label='Clear' onClick={() => fields.forEach(() => remove())} />
      </div>
    </>
  );
};

export default ReviewsContainer;
