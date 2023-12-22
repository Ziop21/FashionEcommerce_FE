import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import Product from "@/app/product/[productId]/page";
import { storage } from "@/config/firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import Image from "next/image";
import { useEffect, useState } from "react";
interface ProductImageProps {
   product: Product,
}

const ProductImage: React.FC<ProductImageProps> = ({ product }) => {
   const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const urls = await Promise.all(
          product.images.map(async (img) => {
            return getDownloadURL(ref(storage, `images/product/${img}`));
          })
        );
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };

    fetchImageUrls();
  }, [product.images]);
   return (
      <div className="grid grid-cols-6 gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
         <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
            {imageUrls.map((img) => {
               return (
                  <div className={`relative w-[80%] aspect-square rounded border-teal-300`} >
                     <Image
                        src={img}
                        alt="image conten"
                        fill
                        className="object-contain"
                     />
                  </div>
               )
            })
            }
         </div>
         <div className="col-span-5 relative aspect-square">
            <Image
               src={imageUrls[0]}
               alt="img"
               fill
               className="
                w-full h-full object-contain
                max-h-[500px] min-h-[300px] sm:min-h-[400px]
                "
            />
         </div>
      </div>
   );
}

export default ProductImage;