"use client"

import { useEffect, useState } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";

import ViewForm from "./ViewForm";

import { Product } from "@/pages/api/admin/product/Models";
import callApiRoute from "@/pages/api/admin/product/findById";

interface IPrams {
  productId: string;
}
const View = ({ params }: { params: IPrams }) => {
  const [foundProduct, setFoundProduct] = useState<Product>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callApiRoute(params.productId);
        if (response) {
          setFoundProduct(response);
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
          <ViewForm foundProduct={foundProduct} />
        </FormWrap>
      </Container>
    </div>
  );
}

export default View;