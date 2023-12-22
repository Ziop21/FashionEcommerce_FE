import api from "@/pages/api/api";

interface ParamProps {
  search?: string;
  sizeIds?: string[];
  colorIds?: string[];
  fromRating?: number;
  toRating?: number;
  fromPrice?: number;
  toPrice?: number;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}
const getAllProduct = async (params: ParamProps): Promise<Product[]> => {
  try {
    const response = await api.get("/api/guest/product", {
      params: params,
    });
    return response.data.items;
  } catch (error) {
    console.error("Error in getting data!!! ", error);
  }
};

export default getAllProduct;