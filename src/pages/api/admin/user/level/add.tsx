import api from "@/pages/api/api";
import { UserLevel } from "./Models";

const add = async (userLevel: UserLevel) => {
  try {
    const response = await api.post('/api/admin/manager/user-level', userLevel);
    return response.data.items;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
