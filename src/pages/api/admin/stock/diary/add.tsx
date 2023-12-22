import api from "@/pages/api/api";
import { StockDiary } from "./Models";

const add = async (stockDiary: StockDiary) => {
  try {
    const response = await api.post('/api/admin/manager/stock-diary', stockDiary);
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
