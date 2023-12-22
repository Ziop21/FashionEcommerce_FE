import api from "@/pages/api/api";
import { Color } from "@/pages/api/admin/color/Models";

const update = async (id: string, color: Color) => {
  try {
    const response = await api.put('/api/admin/manager/color/' + id, color);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
