import { Product } from "./Models";
import { AxiosResponse } from "axios";

import api from "@/pages/api/api";

interface ParamProps {
  search?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps): Promise<Product[]> => {
  try {
    const response: AxiosResponse<Product[]> = await api.get('/api/admin/manager/product', {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
