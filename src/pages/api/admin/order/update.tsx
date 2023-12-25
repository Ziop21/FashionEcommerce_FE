import api from "@/pages/api/api";
import { Order } from "./Models";

const update = async (id: string | undefined, order: Order) => {
  try {
    const response = await api.put('/api/admin/manager/order/' + id, order);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
