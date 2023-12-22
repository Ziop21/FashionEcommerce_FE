import api from "@/pages/api/api";
import { UserLevel } from "./Models";

const update = async (id: string, userLevel: UserLevel) => {
  try {
    const response = await api.put('/api/admin/manager/user-level/' + id, userLevel);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
