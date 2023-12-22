import api from "@/pages/api/api";
import { Stock } from "./Models";

const add = async (stock: Stock) => {
  try {
    const response = await api.post('/api/admin/manager/stock', stock);
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
