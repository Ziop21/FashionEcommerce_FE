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

interface ItemContentProps{
    item: CartProductType
}


const ItemContent: React.FC<ItemContentProps> = ({item}) => {
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
    } = useCart()
    return ( 
    <div className="grid grid-cols-4 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
        <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
            <Link href={`/product/${item.productId}`}>
                <div className="relative w-[40px] aspect-square">
                    <Image src={imageUrl ?? ""}
                    alt = {item.name}
                    fill
                    className="object-contain"
                    />
                </div>
            </Link>
            <div className="flex flex-col justify-between">
                <Link href={`/product/${item.productId}`}>
                    {truncateText(item.name)}   
                </Link>
                <div className="flex items-center">
                    <div 
                    style={{background: item.selectedColor? item.selectedColor.code : ''}}
                    className="h-4 w-4 rounded-full border-[1.2px] border-slate-300 cursor-pointer mr-2"></div>
                    <div className="cursor-pointer">Size {item.selectedSize ? item.selectedSize.name : '!!!'}</div>
                </div>
            </div>
        </div>
        <div className="justify-self-center">{(item.quantity? item.quantity : '!!!')}</div>
        <div className="justify-self-end font-semibold mr-5">
            {formatPrice(item.price * item.quantity)}
        </div>
    </div> );
}
 
export default ItemContent;