'use client';

import { FieldErrors, UseFormGetValues, UseFormRegister } from 'react-hook-form';

import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';

interface ListObjectInputProps {
    id: string;
    label: string;
    itemLabel: string;
    disabled: boolean;
    required?: boolean;
    custom?: string;
    register: UseFormRegister<any>;
    errors: FieldErrors;
    fields: any;
    append: any;
    remove: any;
}

const PhonesContainer: React.FC<ListObjectInputProps> = ({
    id,
    label,
    itemLabel,
    disabled,
    required,
    custom,
    register,
    errors,
    fields,
    append,
    remove
}) => {
    // console.log('eeeeeeee', errors['images'] ? errors['images'][0] : '')
    const handleClearBtnClick = async () => {
        fields.map(() => remove());
    }

    const handleItemDeleteBtnClick = async (index: any) => {
        try {
            remove(index)
        } catch (error) {
            console.error('Error deleting old image:', error);
        }
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
                        <div key={item.id} className='w-full flex border-2 p-2 rounded'>
                            <div className='w-full'>
                                <Input
                                    id={`${id}.${index}`}
                                    label={itemLabel}
                                    register={register}
                                    disabled={disabled}
                                    errors={errors}
                                    required={required}
                                />
                            </div>
                            <div className='w-20 ml-2'>
                                <Button disabled={disabled} label='Delete' onClick={() => handleItemDeleteBtnClick(index)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-1/5 pr-2 ml-2 mt-4">
                <Button custom='w-5 ml-2' disabled={disabled} label='Add' onClick={() => append()} />
                <Button custom='w-5 ml-2 mt-2' disabled={disabled} label='Clear' onClick={() => handleClearBtnClick()} />
            </div>
        </>
    );
};

export default PhonesContainer;
