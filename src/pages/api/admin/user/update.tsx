import api from "@/pages/api/api";
import { User } from "./Models";

const update = async (id: string | undefined, user: User) => {
  try {
    const response = await api.put('/api/admin/manager/user/' + id, user);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
