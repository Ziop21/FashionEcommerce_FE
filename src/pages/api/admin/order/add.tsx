import api from "@/pages/api/api";
import { Order } from "./Models";

const add = async (order: Order) => {
  try {
    const response = await api.post('/api/admin/manager/order', order);
    return response.data.items;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
