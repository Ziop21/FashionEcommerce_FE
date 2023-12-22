import axios from "axios";
import { Size } from "./Models";

const findById = async (sizeId: string): Promise<Size> => {
  try {
    const response = await axios.get("http://localhost:8081/api/guest/size/" + sizeId);
    return response.data;
  } catch (error) {
    console.error("Can not get data API route");
    throw error;  
  }
};

export default findById;