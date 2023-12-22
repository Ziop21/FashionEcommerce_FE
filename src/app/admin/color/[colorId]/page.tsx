"use client"

import { useEffect, useState } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";

import ViewForm from "./ViewForm";

import { Color } from "@/pages/api/admin/color/Models";
import callApiRoute from "@/pages/api/admin/color/findById";

interface IPrams {
  colorId: string;
}
const View = ({ params }: { params: IPrams }) => {
  const [foundColor, setFoundColor] = useState<Color>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callApiRoute(params.colorId);
        if (response) {
          setFoundColor(response);
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
          <ViewForm foundColor={foundColor} />
        </FormWrap>
      </Container>
    </div>
  );
}

export default View;