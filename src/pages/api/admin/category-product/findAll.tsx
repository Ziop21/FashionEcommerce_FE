import api from "@/pages/api/api";
import { AxiosResponse } from "axios";
import { CategoryProduct } from "./Models";

interface ParamProps {
  search?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps): Promise<CategoryProduct[]> => {
  try {
    const response: AxiosResponse<CategoryProduct[]> = await api.get('/api/admin/manager/category-product', {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
