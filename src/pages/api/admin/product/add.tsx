import api from "@/pages/api/api";
import { Product } from "./Models";

const add = async (product: Product) => {
  try {
    const response = await api.post('/api/admin/manager/product', product);
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
