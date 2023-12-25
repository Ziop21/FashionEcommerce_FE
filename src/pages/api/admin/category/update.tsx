import api from "@/pages/api/api";
import { Category } from "./Models";

const update = async (id: string | undefined, category: Category) => {
  try {
    const response = await api.put('/api/admin/manager/category/' + id, category);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
