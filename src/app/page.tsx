'use client'

import { useEffect, useState } from "react";
import Container from "./components/Container";
import HomeBanner from "./components/HomeBanner";
import getAllProduct from "@/pages/api/guest/products/findAllProducts";
import ProductCard from "./components/products/ProductCard";

export default function Home() {
  
const [mostViewestProducts, setMostViewestProducts] = useState([]); 


useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await getAllProduct({
        pageSize: 6,
        sort: 'view_DESC',
      });
      setMostViewestProducts(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }; 
  fetchData();
}, []);
  return (
   <div className="p-8 bg-slate-100">
    <Container>
      <div>
        <HomeBanner/>
      </div>
      <div>
        <span className="text-2xl font-bold">MOST VIEW PRODUCTS</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {mostViewestProducts.map((product: any) => {
            return <ProductCard data={product}/>;
            })}
        </div>
      </div>
    </Container>
   </div>
  )
}
