import api from "@/pages/api/api";
import { Size } from "./Models";

const add = async (size: Size) => {
  try {
    console.log(size);
    const response = await api.post('/api/admin/manager/size', size);
    return response.data.items;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
