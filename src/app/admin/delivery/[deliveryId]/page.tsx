"use client"

import { useEffect, useState } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import ViewForm from "./ViewForm";

import { Delivery } from "@/pages/api/admin/delivery/Models";
import callApiRoute from "@/pages/api/admin/delivery/findById";

interface IPrams {
    deliveryId: string;
}
const View = ({ params }: {params: IPrams}) => {
    const [foundDelivery, setFoundDelivery] = useState<Delivery>(); 

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await callApiRoute(params.deliveryId);
          if (response) {
            setFoundDelivery(response);
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
                    <ViewForm foundDelivery = {foundDelivery}/>
                </FormWrap>
            </Container>
        </div>
    );
}
 
export default View;