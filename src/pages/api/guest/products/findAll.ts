import api from "../../api";

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

const getAllProduct = async (params: ParamProps) => {
  try {
    const response = await api.get("/api/guest/product", {params: params
  });
    return response.data;
    
  } catch (error) {
    console.error("Error in getting data!!! ", error);
    throw error;  
  }
};

export default getAllProduct;
