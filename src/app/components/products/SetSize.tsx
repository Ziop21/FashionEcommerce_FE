'use client';

import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import GetStockById from "@/pages/api/stock/getAllStock";
import { useEffect, useState } from "react";
interface SetSizeProps {
    sizes: Size[];
    cartProduct: CartProductType,
    handleSizeSelect: (value: Size) => void
}
interface Size {
    id: string;
    name: string;
}

interface Product {
    id: string;
    sizeId: string;
    colorId: string;
    quantity: number;
    reviews: any[]; // hoặc bạn có thể xác định kiểu cho reviews nếu có
  }

const SetSize: React.FC<SetSizeProps> = ({ sizes , cartProduct, handleSizeSelect }) => {

    const [product, setProduct] = useState<Product[] | null>(null);
    
    console.log(cartProduct.selectedColor?.id)
    useEffect(() => {
        const fetchData = async () => {
            const productData = await GetStockById(cartProduct.productId);
            let filteredProducts = [];
            for (let i = 0; i < productData.length; i++) {
                if (productData[i].colorId === cartProduct.selectedColor?.id) {
                    console.log(productData[i].colorId, 'ss')
                    filteredProducts.push(productData[i]);
                }
            }
            if (filteredProducts) {
                setProduct(filteredProducts);
            }
        };
        fetchData();
    }, [cartProduct.selectedColor?.id])
    const uniqueSizeIds = new Set<string>();
    const uniqueSizes = sizes.filter((size) => {
        if (uniqueSizeIds.has(size.id)) {
            return false; 
        }
        uniqueSizeIds.add(size.id); 
        return true; 
    });

    function checkSizeId(sizeId : string) {
        for (let i = 0; i < product.length; i++) {
            if (product[i].sizeId === sizeId) {
                return true;
            }
        }
        return false;
    }
    console.log(uniqueSizes)


    return (
        <div>
            <div className="flex gap-4 items-center">
                <span className="font-semibold">SIZE:</span>
                <div className="flex gap-1">
                    
                {cartProduct.selectedColor?.id != undefined ? (
                    uniqueSizes.map((size) => (
                        checkSizeId(size.id) && (
                        <div
                            key={size.id}
                            onClick={() => handleSizeSelect(size)}
                            className={`h-7 w-7 rounded-full border-teal-400 
                                flex items-center justify-center
                                ${
                                cartProduct.selectedSize === size
                                    ? 'border-[1.5px]'
                                    : 'border-none'
                                }
                            `}
                        >
                            <div
                            className={`
                                h-5 w-5 rounded-full border-[1.2px] border-slate-400 cursor-pointer flex items-center justify-center
                            `}
                            >
                            {size.name}
                            </div>
                        </div>
                        )
                    ))
                    ) : (
                    <div className="text-green-500">Please chose color</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SetSize;
