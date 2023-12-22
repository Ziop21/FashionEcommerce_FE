import api from "@/pages/api/api";
import { Delivery } from "./Models";

const add = async (delivery: Delivery) => {
  try {
    console.log(delivery);
    const response = await api.post('/api/admin/manager/delivery', delivery);
    return response.data.items;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
