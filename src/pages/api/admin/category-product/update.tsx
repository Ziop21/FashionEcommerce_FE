import api from "@/pages/api/api";
import { CategoryProduct } from "./Models";

const update = async (id: string | undefined, categoryProducts: CategoryProduct) => {
  try {
    const response = await api.put('/api/admin/manager/category-product/' + id, categoryProducts);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
