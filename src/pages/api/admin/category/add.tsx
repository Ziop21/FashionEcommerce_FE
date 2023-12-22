import { Category } from "./Models";
import api from "@/pages/api/api";

const add = async (category: Category) => {
  try {
    console.log(category);
    const response = await api.post('/api/admin/manager/category', category);
    return response.data.items;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
