import axios from "axios";
import { Category } from "./Models";



const findById = async (categoryId: string): Promise<Category> => {
  try {
    const response = await axios.get("http://localhost:8081/api/guest/category/" + categoryId);
    return response.data;
  } catch (error) {
    console.error("Can not get data API route");
    throw error;  
  }
};

export default findById;