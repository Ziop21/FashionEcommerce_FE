import api from "../../api";

interface ParamProps {
  search?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps) => {
  try {
    const response = await api.get("/api/guest/category", {params: params
  });
    return response.data;
    
  } catch (error) {
    console.error("Can not get data API route");
    throw error;  
  }
};

export default findAll;
