import api from "@/pages/api/api";
import { Stock } from "./Models";

const update = async (id: string | undefined, stock: Stock) => {
  try {
    const response = await api.put('/api/admin/manager/stock/' + id, stock);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
