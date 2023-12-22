"use client"

import { useEffect, useState } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";

import ViewForm from "./ViewForm";

import { StockDiary } from "@/pages/api/admin/stock/diary/Models";
import callApiRoute from "@/pages/api/admin/stock/diary/findById";
import findProductById from "@/pages/api/admin/product/findById";
import findById from "@/pages/api/admin/stock/findById";
import findAll from "@/pages/api/admin/stock/findAll";
import { Stock } from "@/pages/api/admin/stock/Models";

interface IPrams {
  stockDiaryId: string;
}
const View = ({ params }: { params: IPrams }) => {
  const [foundStockDiary, setFoundStockDiary] = useState<StockDiary>();
  const [allStocks, setAllStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callApiRoute(params.stockDiaryId);
        setFoundStockDiary(response);
        let stocks: Stock[] = [];
        const stockResp = await findById(response.stockId);
        console.log(stockResp)
        stocks.push(stockResp);
        // const prodResp = await findProductById(stockResp.productId);
        // const stocks = await findAll({search: prodResp.name});
        setAllStocks(stocks);
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
          <ViewForm 
          foundStockDiary={foundStockDiary} 
          allStocks={allStocks}
          />
        </FormWrap>
      </Container>
    </div>
  );
}

export default View;