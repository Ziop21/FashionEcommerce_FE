"use client"
import { useEffect, useState } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import ViewForm from "./ViewForm";

import findById from "@/pages/api/admin/size/findById";

import { Size } from "@/pages/api/admin/size/Models";
interface IPrams {
    sizeId: string;
}
const View = ({ params }: {params: IPrams}) => {
    const [foundSize, setFoundSize] = useState<Size>();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await findById(params.sizeId);
            if (response) {
              setFoundSize(response);
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
                    <ViewForm foundSize = {foundSize}/>
                </FormWrap>
            </Container>
        </div>
    );
}
 
export default View;