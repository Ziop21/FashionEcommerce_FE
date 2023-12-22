import api from "@/pages/api/api";
import { Color } from "@/pages/api/admin/color/Models";
import { AxiosResponse } from "axios";

interface ParamProps {
  search?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps): Promise<Color[]> => {
  try {
    const response: AxiosResponse<Color[]> = await api.get('/api/admin/manager/color', {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
