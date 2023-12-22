'use client';

import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormReset, UseFormSetValue } from 'react-hook-form';
import Button from '../../components/Button';
import DropdownInput from '@/app/components/inputs/DropdownInput';
import { Stock } from '@/pages/api/admin/stock/Models';
import Input from "@/app/components/inputs/Input";

interface ListObjectInputProps {
  id: string;
  label: string;
  disabled: boolean;
  required?: boolean;
  custom?: string;
  allStocks?: Stock[];
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues: UseFormGetValues<any>;
  setValue?: UseFormSetValue<any>;
  reset?: UseFormReset<any>;
  fields: any;
  append: any;
  remove: any;
}

const OrderItemsContainer: React.FC<ListObjectInputProps> = ({
  id,
  label,
  disabled,
  required,
  custom,
  allStocks,
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
            <div key={item.id} className='flex flex-col border-2 p-2 rounded'>
              <div className='w-full'>
                <DropdownInput
                  id={`${id}.${index}.stockId`}
                  label="stock"
                  disabled={disabled}
                  register={register}
                  errors={errors}
                  options={
                    allStocks ? allStocks.map(stock => ({
                      value: stock.id,
                      label: stock.productName + " " + stock.colorName + " " + stock.sizeName,
                    })) : []
                  }
                  required
                  preValue={getValues(`${id}.${index}.stockId`)}
                />
              </div>
              <div className='w-25'>
                <Input
                  id={`${id}.${index}.quantity`}
                  label="quantity"
                  disabled={disabled}
                  register={register}
                  errors={errors}
                  type="number"
                  required
                />
              </div>
              <div className='w-20'>
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

export default OrderItemsContainer;
