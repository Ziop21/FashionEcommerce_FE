'use client'

import Image from "next/image";
import Cookies from 'js-cookie';
import { truncateText } from "../../../utils/truncateText";
import { formatPrice } from "../../../utils/formatPrice";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import add from "@/pages/api/customer/follow/add";
import { JWT_COOKIE_NAME } from "@/config/ApplicationConfig";

interface ProductCardProps {
    data: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    // console.log(data);
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    // const productRating = 
    // data.reviews.reduce((acc: number, item: any ) => 
    // item.rating + acc , 0) / 
    // data.reviews.length
    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const url = await getDownloadURL(ref(storage, `images/product/${data.images[0]}`));
                setImageUrl(url);
            } catch (error) {
                console.error('Error fetching image URL:', error);
            }
        };

        fetchImageUrl();
    }, [data.images]);

    const handleFollowBtnClick = async () => {
        try {
            const jwt = Cookies.get(JWT_COOKIE_NAME)
            if (jwt) {
                await add(data.id);
                toast.success('Followed');
            }
            else {
                router.push('/login');
            }
        } catch (error) {
            toast.error('Can not follow product')
        }
    }

    return (
        <div
            className="col-span-1 border-[1.2px] border-slate-300 border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-sm  ">
            <div onClick={handleFollowBtnClick} className="hover:scale-105 cursor-pointer mx-auto w-4/5 bg-slate-100 rounded-lg border-2 border-slate-300 flex flex-row items-center justify-center">
                <span className="">Follow</span>
                <div className="ml-4">
                    <FaHeart size="25" color="red" />
                </div>
            </div>
            <div className="flex mt-1 flex-col items-center w-full gap-1">
                <div className="cursor-pointer aspect-square overflow-hidden relative w-full">
                    <Image
                        onClick={() => router.push(`/product/${data.id}`)}
                        fill
                        src={imageUrl ?? ''}
                        alt={data.name}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="mt-4">{truncateText(data.name)}</div>
                <div>
                    {/* <Rating value={productRating} readOnly /> */}
                </div>
                {/* <div>{data.reviews.length
                } reviews</div> */}
                <div className="font-semibold">{formatPrice(data.price)}</div>
            </div>
        </div>
    );
}

export default ProductCard;