"use client"

import { useEffect, useState } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import ViewForm from "./ViewForm";

import findById from "@/pages/api/admin/user/level/findById";
import { UserLevel } from "@/pages/api/admin/user/level/Models";

interface IPrams {
    userLevelId: string;
}
const View = ({ params }: {params: IPrams}) => {
    const [foundUserLevel, setFoundUserLevel] = useState<UserLevel>();
    
    useEffect(() => {
        const fetchData = async () => {
        try {
        const response = await findById(params.userLevelId);
        if (response) {
            setFoundUserLevel(response);
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
                    <ViewForm foundUserLevel = {foundUserLevel}/>
                </FormWrap>
            </Container>
        </div>
    );
}
 
export default View;