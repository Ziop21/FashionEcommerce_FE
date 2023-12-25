
import api from "@/pages/api/api";

interface ParamProps {
  search?: string;
  sizeIds?: string[];
  colorIds?: string[];
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps) => {
  try {
    const response = await api.get('/api/admin/manager/stock', {
      params: params,
    });
    // console.log('response', response)
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default findAll;
