"use client"

import { useEffect, useState } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";

import ViewForm from "./ViewForm";

import { Stock } from "@/pages/api/admin/stock/Models";
import callApiRoute from "@/pages/api/admin/stock/findById";
import { Product } from "@/pages/api/admin/product/Models";
import { Size } from "@/pages/api/admin/size/Models";
import { Color } from "@/pages/api/admin/color/Models";
import findAllProduct from "@/pages/api/admin/product/findAll";
import findAllColor from "@/pages/api/admin/color/findAll";
import findAllSize from "@/pages/api/admin/size/findAll";

interface IPrams {
  stockId: string;
}
const View = ({ params }: { params: IPrams }) => {
  const [foundStock, setFoundStock] = useState<Stock>();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allSizes, setAllSizes] = useState<Size[]>([]);
  const [allColors, setAllColors] = useState<Color[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResp = await findAllProduct({pageSize: 100});
            setAllProducts(productResp.items);
            const colorResp = await findAllColor({pageSize: 100});
            setAllColors(colorResp.items);
            const sizeResp = await findAllSize({pageSize: 100});
            setAllSizes(sizeResp.items);
        const response = await callApiRoute(params.stockId);
        if (response) {
          setFoundStock(response);
          // console.log('foundStock: ', response)
        } else {
          console.error("Error: Data not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


  return (
    <div>
      <Container>
        <FormWrap>
          <ViewForm 
          foundStock={foundStock}
          allProducts={allProducts}
          allColors={allColors}
          allSizes={allSizes}
          />
        </FormWrap>
      </Container>
    </div>
  );
}

export default View;