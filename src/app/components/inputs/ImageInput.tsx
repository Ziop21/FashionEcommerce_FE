"use client"
import { storage } from "@/config/firebaseConfig";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import Image from "next/image";

interface ImageInputProps {
    id: string;
    label: string;
    storagePath: string;
    disabled?: boolean;
    required?: boolean;
    errors: any;
    getValues: UseFormGetValues<any>;
    setValue: UseFormSetValue<any>;
    imageWidth: number;
    imageHeigth: number;
}

const ImageInput: React.FC<ImageInputProps> = ({
    id,
    label,
    storagePath,
    disabled,
    required,
    errors,
    getValues,
    setValue,
    imageWidth,
    imageHeigth,
}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const setImageFromRef = async (ref: any) => {
        const url = await getDownloadURL(ref);
        setImageUrl(url);
    }

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const fileName = getValues(id);
                if (fileName && Object.keys(fileName).length > 0) {
                    await setImageFromRef(ref(storage, `${storagePath}${fileName}`))
                }
            } catch (error) {
                console.error('Error fetching image URL:', error);
            }
        };
        fetchImageUrl();
    }, [getValues(id)]);


    const handleFileChange = async (event: any) => {
        const deleteOldImage = async () => {
            try {
                const oldFileName = getValues(id);
                if (oldFileName && Object.keys(oldFileName).length > 0) {
                    const oldImageRef = ref(storage, `${storagePath}${oldFileName}`)
                    const oldImageURL = await getDownloadURL(oldImageRef);
                    if (oldImageURL) {
                        await deleteObject(oldImageRef);
                    }
                }
            } catch (error) {
                console.error('Error deleting old image:', error);
            }
        }
        deleteOldImage();
        setImageUrl(null);
        setValue(id, event.target.files[0])
    }

    return (
        <div className="flex w-full items-center border-2 rounded-md p-4 relative">
            <label
                htmlFor={id}
                className={`absolute cursor-text text-md duration-150 transform
                -translate-y-3
                top-4
                left-4
                peer-placeholder-shown:scale-100
                peer-placeholder-shown:translate-y-0
                peer-focus:scale-75
                peer-focus:-translate-y-4
                ${errors[id] ? 'text-rose-500' : 'text-slate-400'}
                bg-white px-1
                z-10
                `}
            >
                {label}
            </label>
            {!disabled &&
                <input
                    id={id}
                    disabled={disabled}
                    type="file"
                    onChange={(event) => { handleFileChange(event) }}
                    accept=".jpg, .jpeg, .png"
                    className={`mt-5 outline-none bg-white font-light
                transition disabled:opacity-70 disabled:cursor-not-allowed
                ${errors[id] ? 'border-rose-400' : 'border-slate-300'}
                ${errors[id] ? 'focus:border-rose-400' : 'focus:border-slate-500'}
                `}
                />}
            {errors[id] && (
                <div className="popup" style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid red', padding: '10px', borderRadius: '5px', zIndex: 999 }}>
                    <span style={{ color: 'red' }}>{errors[id].message}</span>
                </div>
            )}
            {imageUrl &&
                <div className="mr-auto mt-5">
                <Image
                    width={imageWidth}
                    height={imageHeigth}
                    src={imageUrl ?? ''}
                    alt={getValues(id)}
                    className="w-full h-full object-contain"
                />
            </div>
            }
            
        </div>
    );
}
export default ImageInput;