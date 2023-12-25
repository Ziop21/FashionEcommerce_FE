import api from "../../api";
import { Category } from "./Models";

const findById = async (categoryId: string): Promise<Category> => {
  try {
    const response = await api.get("/api/guest/category/" + categoryId);
    return response.data;
  } catch (error) {
    console.error("Can not get data API route");
    throw error;  
  }
};

export default findById;