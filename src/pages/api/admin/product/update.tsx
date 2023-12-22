import api from "@/pages/api/api";
import { Product } from "./Models";

const update = async (id: string, product: Product) => {
  try {
    const response = await api.put('/api/admin/manager/product/' + id, product);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
