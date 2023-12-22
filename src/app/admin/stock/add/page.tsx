"use client"
import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import AddForm from "./AddForm";
import { useEffect, useState } from "react";
import { Product } from "@/pages/api/admin/product/Models";
import { Size } from "@/pages/api/admin/size/Models";
import { Color } from "@/pages/api/admin/color/Models";
import findAllProduct from "@/pages/api/admin/product/findAll";
import findAllColor from "@/pages/api/admin/color/findAll";
import findAllSize from "@/pages/api/admin/size/findAll";

const Add = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [allSizes, setAllSizes] = useState<Size[]>([]);
    const [allColors, setAllColors] = useState<Color[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const productResp = await findAllProduct({pageSize: 100});
            setAllProducts(productResp.items);
            const colorResp = await findAllColor({pageSize: 100});
            setAllColors(colorResp.items);
            const sizeResp = await findAllSize({pageSize: 100});
            setAllSizes(sizeResp.items);
        }
        fetchData();
    }, [])

    return (
        <div>
            <Container>
                <FormWrap>
                    <AddForm
                    allColors={allColors}
                    allProducts={allProducts}
                    allSizes={allSizes}
                    />
                </FormWrap>
            </Container>
        </div>
    );
}
 
export default Add;