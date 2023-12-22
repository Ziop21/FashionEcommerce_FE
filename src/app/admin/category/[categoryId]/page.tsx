"use client"
import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import ViewForm from "./ViewForm";
import { useEffect, useState } from "react";
import { Category } from "@/pages/api/admin/category/Models";
import callApiRoute from "@/pages/api/admin/category/findById";

interface IPrams {
    categoryId: string;
}
const View = ({ params }: { params: IPrams }) => {
    const [foundCategory, setFoundCategory] = useState<Category>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await callApiRoute(params.categoryId);
                if (response) {
                    setFoundCategory(response);
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
                    <ViewForm foundCategory={foundCategory} />
                </FormWrap>
            </Container>
        </div>
    );
}

export default View;