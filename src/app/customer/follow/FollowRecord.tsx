'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";
import deleteById from "@/pages/api/customer/follow/delete";

interface FollowProps {
    data: any;
    afterDelete: () => void;
}


const FollowRecord: React.FC<FollowProps> = ({
    data,
    afterDelete,
}) => {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const url = await getDownloadURL(ref(storage, `images/product/${data.image}`));
                setImageUrl(url);
            } catch (error) {
                console.error('Error fetching image URL:', error);
            }
        };
        fetchImageUrl();
    }, [data.image]);

    const onDeleteBtnClick = async () => {
        try {
            // console.log('id', data.id)
            await deleteById(data.id);
            toast.success('Deleted')
            afterDelete();
        } catch (error) {
            toast.error('Error')
        }
    }

    return (
        <div className="flex flex-row border-2 rounded-lg p-2 w-1/3">
            <div className="cursor-pointer p-2">
                <Image
                    onClick={() => router.push(`/product/${data.productId}`)}
                    height={400}
                    width={200}
                    src={imageUrl ?? ''}
                    alt={data.name}
                    className="object-contain"
                />
            </div>
            <div className="flex flex-col mt-0.5 p-2 gap-6">
                <span>{`Name: ${data.productName}`}</span>
                <span>{`Price: ${data.price}`}</span>
                {data.promotionalPrice && <span>{`Promotional price: ${data.promotionalPrice ?? ''}`}</span>}
                <Button
                    label="delete"
                    onClick={onDeleteBtnClick}
                />
            </div>
        </div>
    );
}

export default FollowRecord;
