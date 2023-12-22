"use client"
import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import AddForm from "./AddForm";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getCurrentUserRoles } from "@/pages/handler/AuthorizationHanlder";

const Add = () => {
    return (
        <div>
            <Container>
                <FormWrap>
                    <AddForm/>
                </FormWrap>
            </Container>
        </div>
    );
}
 
export default Add;