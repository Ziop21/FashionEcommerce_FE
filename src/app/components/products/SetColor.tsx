'use client';

import { CartProductType } from "@/app/product/[productId]/ProductDetails";
interface SetColorProps {
    colors: Color[];
    cartProduct: CartProductType,
    handleColorSelect: (value: Color) => void
}
interface Color {
    id: string;
    name: string;
    code: string;
}

const SetColor: React.FC<SetColorProps> = ({ colors, cartProduct, handleColorSelect }) => {
    // Create a Set to track unique color IDs
    const uniqueColorIds = new Set<string>();


    const uniqueColors = colors.filter((color) => {
        if (uniqueColorIds.has(color.id)) {
            return false; 
        }
        uniqueColorIds.add(color.id); 
        return true; 
    });

    return (
        <div>
            <div className="flex gap-4 items-center">
                <span className="font-semibold">COLOR:</span>
                <div className="flex gap-1">
                    {uniqueColors.map((color) => (
                        <div
                            key={color.id}
                            onClick={() => handleColorSelect(color)}
                            className={`h-7 w-7 rounded-full border-teal-300 
                                flex items-center justify-center
                                ${
                                    cartProduct.selectedColor === color
                                        ? 'border-[1.5px]'
                                        : 'border-none'
                                }
                                `}
                        >
                            <div
                                style={{ background: color.code }}
                                className="h-5 w-5 rounded-full border-[1.2px] border-slate-300 cursor-pointer"
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default SetColor;
