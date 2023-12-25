import api from "@/pages/api/api";
import { Size } from "./Models";
import { AxiosResponse } from "axios";

interface ParamProps {
  search?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps) => {
  try {
    const response = await api.get('/api/admin/manager/size', {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
