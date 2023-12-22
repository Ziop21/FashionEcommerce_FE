import axios from "axios";
import { Product } from "./Models";

interface ParamProps {
  search?: string;
  categoryIds?: string,
  sizeIds?: string;
  colorIds?: string;
  fromRating?: number;
  toRating?: number;
  fromPrice?: number;
  toPrice?: number;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

const getAllProduct = async (params: ParamProps): Promise<Product[]> => {
  try {
    const response = await axios.get("http://localhost:8081/api/guest/product", {params: params
  });
    return response.data;
    
  } catch (error) {
    console.error("Error in getting data!!! ", error);
    throw error;  
  }
};

export default getAllProduct;
