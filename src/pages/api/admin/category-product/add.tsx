import api from "@/pages/api/api";
import { CategoryProduct } from "./Models";

const add = async (categoryProduct: CategoryProduct) => {
  try {
    const response = await api.post('/api/admin/manager/category-product', categoryProduct);
    return response.data.items;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
