'use client'

import Link from "next/link";
import { formatPrice } from "../../utils/formatPrice";
import { CartProductType } from "../product/[productId]/ProductDetails";
import { truncateText } from "../../utils/truncateText";
import Image from "next/image";
import SetQuantity from "../components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";

interface ItemContentProps {
    item: CartProductType
}


const ItemContent: React.FC<ItemContentProps> = ({ item }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const url = await getDownloadURL(ref(storage, `images/product/${item.image}`));
                setImageUrl(url);
            } catch (error) {
                console.error('Error fetching image URL:', error);
            }
        };

        fetchImageUrl();
    }, [item.image]);
    const {
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease
    } = useCart()
    return (<div className="grid grid-cols-6 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
        <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
            <Link href={`/product/${item.productId}`}>
                <div className="relative w-[70px] aspect-square">
                    <Image src={imageUrl ?? ''}
                        alt={item.name}
                        fill
                        className="object-contain"
                    />
                </div>
            </Link>
            <div className="flex flex-col justify-between">
                <Link href={`/product/${item.productId}`}>
                    {truncateText(item.name)}
                </Link>
                <div style={{ background: item.selectedColor ? item.selectedColor.code : '' }}
                    className="h-5 w-5 rounded-full border-[1.2px] borger-slate-300 cursor-pointer"
                />
                <div className="w-[70px]">
                    <button className="text-slate-500 underline" onClick={() => handleRemoveProductFromCart(item)}>
                        Remove
                    </button>
                </div>
            </div>
        </div>
        <div className="justify-self-center">{(item.selectedSize ? item.selectedSize.name : 'Not Found')}</div>
        <div className="justify-self-center">{formatPrice(item.price)}</div>
        <div className="justify-self-center">
            <SetQuantity
                cartCounter={true}
                cartProduct={item}
                handleQtyDecrease={() => { handleCartQtyDecrease(item) }}
                handleQtyIncrease={() => { handleCartQtyIncrease(item) }}
            />
        </div>
        <div className="justify-self-end font-semibold">
            {formatPrice(item.price * item.quantity)}
        </div>
    </div>);
}

export default ItemContent;