import api from "@/pages/api/api";
import { ChangePasswordRequest } from "./Models";

const updatePassword = async (ChangePasswordRequest: ChangePasswordRequest) => {
  try {
    const response = await api.put('/api/customer/user/password', ChangePasswordRequest);
    return response;    
  } catch (error) {
    console.error("Error: ", error)
    throw error;
  }
};

export default updatePassword;
