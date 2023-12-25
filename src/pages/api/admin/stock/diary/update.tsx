import api from "@/pages/api/api";
import { StockDiary } from "./Models";

const update = async (id: string | undefined, stockDiary: StockDiary) => {
  try {
    const response = await api.put('/api/admin/manager/stock-diary/' + id, stockDiary);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
