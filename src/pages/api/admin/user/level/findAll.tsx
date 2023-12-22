import api from "@/pages/api/api";
import { UserLevel } from "./Models";
import { AxiosResponse } from "axios";

interface ParamProps {
  search?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps): Promise<UserLevel[]> => {
  try {
    const response: AxiosResponse<UserLevel[]> = await api.get('/api/admin/manager/user-level', {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
