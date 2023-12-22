"use client"
import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import ViewForm from "./ViewForm";
import { useEffect, useState } from "react";
import { User } from "@/pages/api/admin/user/Models";
import callApiRoute from "@/pages/api/admin/user/findById";

interface IPrams {
    userId: string;
}
const View = ({ params }: { params: IPrams }) => {
    const [foundUser, setFoundUser] = useState<User>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await callApiRoute(params.userId);
                if (response) {
                    setFoundUser(response);
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
                    <ViewForm foundUser={foundUser} />
                </FormWrap>
            </Container>
        </div>
    );
}

export default View;