"use client"
import { useEffect, useState } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import ViewForm from "./ViewForm";

import findById from "@/pages/api/admin/order/findById";
import { Order } from "@/pages/api/admin/order/Models";

interface IPrams {
    orderId: string;
}
const View = ({ params }: {params: IPrams}) => {
    const [foundOrder, setFoundOrder] = useState<Order>();

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await findById(params.orderId);
            setFoundOrder(response);
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
                    <ViewForm foundOrder = {foundOrder}/>
                </FormWrap>
            </Container>
        </div>
    );
}
 
export default View;