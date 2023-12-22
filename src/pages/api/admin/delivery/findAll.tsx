import api from "@/pages/api/api";
import { Delivery } from "./Models";
import { AxiosResponse } from "axios";

interface ParamProps {
  search?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps): Promise<Delivery[]> => {
  try {
    const response: AxiosResponse<Delivery[]> = await api.get('/api/admin/manager/delivery', {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
