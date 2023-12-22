import api from "@/pages/api/api";
import {Category} from "@/pages/api/admin/category/Models"
import { AxiosResponse } from "axios";

interface ParamProps {
  search?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps): Promise<Category[]> => {
  try {
    const response: AxiosResponse<Category[]> = await api.get('/api/admin/manager/category', {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
