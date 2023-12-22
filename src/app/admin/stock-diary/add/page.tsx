'use client'

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import AddForm from "./AddForm";
import { Stock } from "@/pages/api/admin/stock/Models";
import { useEffect, useState } from "react";
import findAll from "@/pages/api/admin/stock/findAll";

const Add = () => {
    const [allStocks, setAllStocks] = useState<Stock[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const stockResp = await findAll({pageSize: 20});
            // console.log('stockResp.items', stockResp.items)
            setAllStocks(stockResp.items);
        }
        fetchData();
    }, [])

    return (
        <div>
            <Container>
                <FormWrap>
                    <AddForm allStocks={allStocks}/>
                </FormWrap>
            </Container>
        </div>
    );
}
 
export default Add;