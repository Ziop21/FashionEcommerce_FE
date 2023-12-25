'use client';

import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormReset, UseFormSetValue } from 'react-hook-form';
import Button from '../../components/Button';
import DropdownInput from '@/app/components/inputs/DropdownInput';
import { ERole, Role } from '@/pages/api/admin/user/Models';

interface ListObjectInputProps {
  id: string;
  label: string;
  disabled: boolean;
  required?: boolean;
  custom?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues?: UseFormGetValues<any>;
  setValue?: UseFormSetValue<any>;
  reset?: UseFormReset<any>;
  fields: any;
  append: any;
  remove: any;
}

const RolesContainer: React.FC<ListObjectInputProps> = ({
  id,
  label,
  disabled,
  required,
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
          {fields.map((item: any, index:number) => (
            <div key={item.id} className='flex border-2 p-2 rounded'>
              <div className='w-full'>
                <DropdownInput
                  id={`${id}.${index}.name`}
                  label="Role"
                  disabled={disabled}
                  register={register}
                  errors={errors}
                  options={Object.values(ERole).map(role => ({
                    value: role,
                    label: role.toString(),
                  }))}
                  required = {required}
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

export default RolesContainer;
