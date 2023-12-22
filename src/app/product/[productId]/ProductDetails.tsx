'use client'

import Button from "@/app/components/Button";
import ProductImage from "@/app/components/products/ProductImage";
import SetSize from "@/app/components/products/SetSize";
import SetColor from "@/app/components/products/SetColor";
import SetQuantity from "@/app/components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import Product from "./page";
import { formatPrice } from "@/utils/formatPrice";
import findColorById from "@/pages/api/guest/color/findById";
import { SizeChart, getCodeByName  } from "@/utils/sizeChart/size"; 
import findById from "@/pages/api/guest/size/findById";
import Heading from "@/app/components/Heading";
import getCategories from "@/pages/api/product/getCategories";

interface ProductDetailsProps{
   product : Product
}

export type CartProductType = {
   productId: string;
   name: string;
   description: string;
   image: string;
   selectedColor: Color | undefined;
   selectedSize: Size | undefined;
   quantity: number;
   price: number;
}
interface Size {
   id: string;
   name: string;
 }
 
interface Color {
   id: string;
   name: string;
   code: string;
 }

const Horizontal = () =>{
   return <hr className="w-[30%] my-2"/>
}

const ProductDetails: React.FC<ProductDetailsProps> = ({product}) => {
   if (!product) {
      return <div>Loading...</div>;
    }

   const {handleAddProductToCart, cartProducts} = useCart(); 
   const [isProductInCart, setIsProductInCart] = useState(false);
   const [sizes, setSizes] =useState<Size[]>([]);
   useEffect(() => {
     const fetchData = async () => {
      const sizesResult = [];
      for (let i = 0; i < product.stocks.length; i++) {
        const stockId = product.stocks[i]?.sizeId;
        const sizeResult = await findById(stockId);
        sizesResult.push(sizeResult);
      }
      setSizes(sizesResult);
     };
     fetchData();
   },[product.stocks]);

   const [colors, setColors] =useState<Color[]>([]);
   useEffect(() => {
     const fetchData = async () => {
      const colorsResult = [];
      for (let i = 0; i < product.stocks.length; i++) {
        const stockId = product.stocks[i]?.colorId;
        const colorResult = await findColorById(stockId);
         colorsResult.push(colorResult);
      }
      setColors(colorsResult);
     };
     fetchData();
   },[product.stocks]);

   const [cartProduct, setCartProduct] = 
   useState<CartProductType>(
      {
         productId: product.id,
         name: product.name,
         description: product.description,
         image: product.images[0],
         selectedColor: colors[0],
         selectedSize: sizes[0],
         quantity: 1,
         price: product.price
      }
   );

   const router = useRouter()

   useEffect(()=> {
      setIsProductInCart(false);

      if (cartProducts){
         const existingIndex = cartProducts.findIndex((item) => item.productId == product.id)

         if(existingIndex > -1) {
            setIsProductInCart(true)
         }
      }
   }, [cartProducts])

   const productRating = product.rating
   const handleColorSelect = useCallback(
      (value: Color) => {
        setCartProduct((prev: Product.Color) => {
          return { ...prev, selectedColor: value };
        });
      },
      [cartProduct.selectedColor]
   );

   const handleSizeSelect = useCallback(
      (value: Size) => {
        setCartProduct((prev: Product.Color) => {
          return { ...prev, selectedSize: value };
        });
      },
      [cartProduct.selectedSize]
   );

   const handleQtyIncrease = useCallback(() => {
      if (cartProduct.quantity == 99) {return;}
      setCartProduct((prev) => { return { ...prev, quantity: prev.quantity + 1};});
   },  [cartProduct]);

   const handleQtyDecrease =useCallback(() => {
      if (cartProduct.quantity == 1) {return;}
      setCartProduct((prev) => { return { ...prev, quantity: prev.quantity - 1};});}
   , [cartProduct]);
   
   const [category, setCategory] = useState<string>('');;
   useEffect(() => {
      const fetchData = async () => {
        try {
          const categories = await getCategories(product.id);
          console.log(categories)
          setCategory(categories);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
      fetchData();
    }, [product]);

    return ( 
      <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
         <ProductImage product={product} />
         <div className="flex flex-col gap-1 text-slate-500 text-sm">
            <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
            <div className="flex items-center gap-2">
               <Rating value={productRating} readOnly />
               {/* <div>{product.stocks[0].reviews.length} reviews</div> */}
            </div>
            <Horizontal />
            <div className="text-justify">{product.description}</div>
            <Horizontal />
            <div>
               <span className="font-semibold">PRICE :</span> {formatPrice(product.price)}
            </div>
            {product.promotionalPrice && (
            <div>
               <span className="font-semibold">NEW PRICE: </span> {formatPrice(product.promotionalPrice)}
            </div>
            )}
            <Horizontal />

            {/* <div className={product.inStock ? "text-teal-400" : "text-rose-400"}>
               {product.inStock ? "In stock" : "Out of stock"}
            </div> */}

            <Horizontal />
            {isProductInCart ? (<>
            
            <p className="mb-2 text-slate-500 flex items-center gap-1"> 
               <MdCheckCircle className="text-teal-400"  size={20} />
               <span>Product added to cart</span>
            </p>
            <div className="max-w-[300px]">
               <Button label="View Cart" outline onClick={() =>{
                  router.push('/cart');
               }} />
            </div>

            </>) :(<>
               <SetColor 
                  colors={colors} 
                  cartProduct={cartProduct} 
                  handleColorSelect={handleColorSelect}
               />
               <Horizontal />
               
               <SetSize
                  sizes={sizes} 
                  cartProduct={cartProduct} 
                  handleSizeSelect={handleSizeSelect}
               />

               <Horizontal />
               <SetQuantity 
                  cartProduct={cartProduct}
                  handleQtyIncrease={handleQtyIncrease}
                  handleQtyDecrease={handleQtyDecrease}
               />
               <Horizontal />
               <div className="max-w-[300px]">
                  <Button label="Add To Cart" onClick={() => handleAddProductToCart(cartProduct) }
                  />
               </div>
            </>)}
         </div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
         <Heading title="SIZE CHART"/>
         <img src={getCodeByName(category[0])} alt="shirt" className="w-[70%] h-auto " />
      </div>
   </div>
   );
}
 
export default ProductDetails
;