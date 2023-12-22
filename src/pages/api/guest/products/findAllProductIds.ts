import axios from "axios";
import { ProductId } from "./Models";

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

const findAllProductIds = async (params: ParamProps): Promise<ProductId[]> => {
  try {
    const response = await axios.get("http://localhost:8081/api/guest/product/productIds", {
      params: params
    });
    return response.data;
  } catch (error) {
    console.error("Error in getting data!!! ", error);
    throw error;
  }
};

export default findAllProductIds;
