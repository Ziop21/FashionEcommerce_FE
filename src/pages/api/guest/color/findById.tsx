import axios from "axios";
import { Color } from "./Models";

const findColorById = async (colorId: string): Promise<Color> => {
  try {
    const response = await axios.get("http://localhost:8081/api/guest/color/" + colorId);
    return response.data;
  } catch (error) {
    console.error("Can not get data API route");
    throw error;  
  }
};

export default findColorById;