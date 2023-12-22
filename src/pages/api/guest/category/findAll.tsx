import axios from "axios";
import { Category } from "./Models";


interface ParamProps {
  search?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const findAll = async (params: ParamProps): Promise<Category[]> => {
  try {
    const response = await axios.get("http://localhost:8081/api/guest/category", {params: params
  });
    return response.data;
    
  } catch (error) {
    console.error("Can not get data API route");
    throw error;  
  }
};

export default findAll;
