"use client"
import { useEffect, useState } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import ViewForm from "./ViewForm";

import findAllUser from "@/pages/api/admin/user/findAll"
import findAllDelivery from "@/pages/api/admin/delivery/findAll"
import findById from "@/pages/api/admin/order/findById";

import { User } from "@/pages/api/admin/user/Models";
import { Delivery } from "@/pages/api/admin/delivery/Models";
import { Order } from "@/pages/api/admin/order/Models";

interface IPrams {
    orderId: string;
}
const View = ({ params }: {params: IPrams}) => {
    const [foundOrder, setFoundOrder] = useState<Order>();
    const [allUsers, setAllUsers] = useState<User[]>();
    const [allDeliveries, setAllDeliveries] = useState<Delivery[]>();

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await findById(params.orderId);
            setFoundOrder(response);
            const respUsers = await findAllUser({pageSize: 100});
            setAllUsers(respUsers.items);
            const respDeliveries = await findAllDelivery({pageSize: 100});
            setAllDeliveries(respDeliveries.items);
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
                    <ViewForm foundOrder = {foundOrder} allUsers={allUsers} allDeliveries={allDeliveries} />
                </FormWrap>
            </Container>
        </div>
    );
}
 
export default View;