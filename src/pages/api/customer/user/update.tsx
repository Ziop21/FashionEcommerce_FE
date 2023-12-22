import api from "@/pages/api/api";
import { UserRequest } from "./Models";

const update = async (userRequest: UserRequest) => {
  try {
    // console.log('UserRequest', userRequest);
    const response = await api.put('/api/customer/user', userRequest);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default update;
