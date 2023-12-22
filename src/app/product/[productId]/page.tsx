'use client'

import Container from "@/app/components/Container";
import ProductDetails from "./ProductDetails";
import ListRating from "./ListRating";
import { useEffect, useState } from "react";
import findById from "@/pages/api/guest/products/findById";

interface IPrams {
    productId: string;
}
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    promotionalPrice: number;
    images: Array<string>;
    rating: number;
    stocks: Array<Stock>;
  }

  interface Stock {
    id: string;
    sizeId: string;
    colorId: string;
    quantity: number;
    reviews: Array<Review>;
  }
  
  interface Review {
    sizeName: string;
    colorName: string;
    username: string;
    content: string;
    rating: number;
    images: Array<string>;
  }

const Product = ({ params }: {params: IPrams}) => {

    console.log(params.productId);
    const [products, setProducts] = useState<Product[] | null>(null);

    useEffect(() => {
    const fetchData = async () => {
        try {
        const result = await findById(params.productId);
        console.log(result)
        setProducts(result);
        } catch (error) {
        console.error("Error fetching data:", error);
        }
    };
    fetchData();
    }, []);

    console.log(products)

    return ( 
        <div className="p-8">
            <Container>
                <ProductDetails product = {products}/>
                <div className="flex flex-col mt-20 gap-4">
                    {/* <div>Add Rating</div> */}
                    <ListRating product={products}/>
                </div>
            </Container>
        </div>
     );
}
 
export default Product;