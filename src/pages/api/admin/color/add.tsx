import api from "@/pages/api/api";
import { Color } from "@/pages/api/admin/color/Models";

const add = async (color: Color) => {
  try {
    console.log(color);
    const response = await api.post('/api/admin/manager/color', color);
    return response.data.items;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
