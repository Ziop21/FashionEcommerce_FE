import { AxiosResponse } from "axios";

import { StockDiary } from "./Models";
import api from "@/pages/api/api";

interface ParamProps {
  search?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps): Promise<StockDiary[]> => {
  try {
    const response: AxiosResponse<StockDiary[]> = await api.get('/api/admin/manager/stock-diary', {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
