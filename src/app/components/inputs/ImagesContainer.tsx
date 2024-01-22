'use client';

import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import Button from '../Button';
import ImageInput from '@/app/components/inputs/ImageInput';
import { useEffect } from 'react';
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/config/firebaseConfig';

interface ListObjectInputProps {
    id: string;
    label: string;
    maximumImages?: number;
    itemLabel: string;
    storagePath: string;
    disabled: boolean;
    required?: boolean;
    custom?: string;
    register: UseFormRegister<any>;
    errors: FieldErrors;
    getValues: UseFormGetValues<any>;
    setValue: UseFormSetValue<any>;
    fields: any;
    append: any;
    remove: any;
}

const ImagesContainer: React.FC<ListObjectInputProps> = ({
    id,
    label,
    maximumImages,
    itemLabel,
    storagePath,
    disabled,
    required,
    custom,
    register,
    errors,
    getValues,
    setValue,
    fields,
    append,
    remove
}) => {
    // console.log('eeeeeeee', errors['images'] ? errors['images'][0] : '')
    const handleClearBtnClick = async () => {
        fields.map(async (image: any, item: number) => {
            const oldFileName = Object.values(fields[item]).slice(0, -1).join('');
            if (oldFileName && Object.keys(oldFileName).length > 0) {
                const oldImageRef = ref(storage, `${storagePath}${oldFileName}`)
                const oldImageURL = await getDownloadURL(oldImageRef);
                if (oldImageURL) {
                    await deleteObject(oldImageRef);
                }
            }
        });
        fields.map(() => remove());
    }

    const handleItemDeleteBtnClick = async (index: any) => {
        try {
            const oldFileName = Object.values(fields[index]).slice(0, -1).join('');
            if (oldFileName && Object.keys(oldFileName).length > 0) {
                const oldImageRef = ref(storage, `${storagePath}${oldFileName}`)
                await deleteObject(oldImageRef);
            }
            remove(index)
        } catch (error) {
            console.error('Error deleting old image:', error);
            remove(index)
        }
    }

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
                    {fields.map((item: any, index: number) => (
                        <div key={item.id} className='w-full flex border-2 p-2 rounded'>
                            <div className='w-full'>
                                <ImageInput
                                    id={`${id}.${index}`}
                                    label={itemLabel}
                                    storagePath={storagePath}
                                    disabled={disabled}
                                    getValues={getValues}
                                    setValue={setValue}
                                    errors={errors}
                                    imageHeigth={300}
                                    imageWidth={100}
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
            <div className="ml-2">
                <Button custom='w-5 ml-2' disabled={disabled} label='Add' onClick={() => {
                    if (maximumImages) {
                        const images: File[] = getValues(id);
                        if (images.length < maximumImages){
                            append();
                        }
                    }
                    else {
                        append()
                    }
                    }} />
                <Button custom='w-5 ml-2 mt-2' disabled={disabled} label='Clear' onClick={() => handleClearBtnClick()} />
            </div>
        </>
    );
};

export default ImagesContainer;
