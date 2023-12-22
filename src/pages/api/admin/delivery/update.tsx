import api from "@/pages/api/api";
import { Delivery } from "./Models";

const update = async (id: string, delivery: Delivery) => {
  try {
    const response = await api.put('/api/admin/manager/delivery/' + id, delivery);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
