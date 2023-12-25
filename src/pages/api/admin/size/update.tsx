import api from "@/pages/api/api";
import { Size } from "./Models";

const update = async (id: string | undefined, size: Size) => {
  try {
    const response = await api.put('/api/admin/manager/size/' + id, size);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
