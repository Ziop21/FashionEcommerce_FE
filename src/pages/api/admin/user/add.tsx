import api from "@/pages/api/api";
import { User } from "./Models";

const add = async (user: User) => {
  try {
    const response = await api.post('/api/admin/manager/user', user);
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default add;
