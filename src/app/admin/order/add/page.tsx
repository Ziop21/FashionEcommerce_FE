"use client"

import { useState, useEffect } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import AddForm from "./AddForm";

import findAllUser from "@/pages/api/admin/user/findAll"
import findAllDelivery from "@/pages/api/admin/delivery/findAll"

import { User } from "@/pages/api/admin/user/Models";
import { Delivery } from "@/pages/api/admin/delivery/Models";

const Add = () => {
    const [allUsers, setAllUsers] = useState<User[]>();
    const [allDeliveries, setAllDeliveries] = useState<Delivery[]>();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const respUsers = await findAllUser({});
            setAllUsers(respUsers.items);
            const respDeliveries = await findAllDelivery({});
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
                    <AddForm allUsers={allUsers} allDeliveries={allDeliveries}/>
                </FormWrap>
            </Container>
        </div>
    );
}
 
export default Add;